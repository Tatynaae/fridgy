import { API_URL } from '@/lib/config';
import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  saveTokens,
} from '@/lib/token-storage';

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  /** Подставить access-токен и при 401 попробовать обновить его через refresh-токен */
  auth?: boolean;
};

// Вызывается, когда сессию восстановить нельзя (refresh-токен просрочен/отозван)
let onSessionExpired: (() => void) | null = null;
export function setSessionExpiredHandler(handler: (() => void) | null) {
  onSessionExpired = handler;
}

// Достаёт читаемое сообщение из ответа NestJS ({ message: string | string[], errors?: [...] })
function extractMessage(data: unknown, fallback: string): string {
  if (data && typeof data === 'object') {
    const d = data as { message?: unknown; errors?: { message?: string }[] };
    if (Array.isArray(d.errors) && d.errors[0]?.message) {
      return d.errors[0].message;
    }
    if (typeof d.message === 'string') return d.message;
    if (Array.isArray(d.message) && typeof d.message[0] === 'string') {
      return d.message[0];
    }
  }
  return fallback;
}

async function rawRequest(
  path: string,
  method: string,
  body: unknown,
  accessToken: string | null,
): Promise<{ status: number; ok: boolean; data: unknown }> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (accessToken) headers.Authorization = `Bearer ${accessToken}`;

  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new ApiError('Не удалось подключиться к серверу', 0);
  }

  const text = await response.text();
  let data: unknown = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = null;
  }
  return { status: response.status, ok: response.ok, data };
}

// Один общий запрос на обновление, даже если параллельно упало несколько запросов с 401
let refreshPromise: Promise<string | null> | null = null;

export function refreshAccessToken(): Promise<string | null> {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      const refreshToken = await getRefreshToken();
      if (!refreshToken) return null;

      const res = await rawRequest('/auth/refresh', 'POST', { refreshToken }, null);
      if (!res.ok) {
        if (res.status === 401) await clearTokens();
        return null;
      }
      const tokens = res.data as { accessToken: string; refreshToken: string };
      await saveTokens(tokens);
      return tokens.accessToken;
    })().finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
}

export async function request<T>(
  path: string,
  { method = 'GET', body, auth = false }: RequestOptions = {},
): Promise<T> {
  let res = await rawRequest(path, method, body, auth ? await getAccessToken() : null);

  // access-токен живёт 15 минут — при 401 обновляем его и повторяем запрос один раз
  if (auth && res.status === 401) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      res = await rawRequest(path, method, body, newToken);
    } else if (!(await getRefreshToken())) {
      onSessionExpired?.();
    }
  }

  if (!res.ok) {
    throw new ApiError(extractMessage(res.data, 'Что-то пошло не так'), res.status);
  }

  return res.data as T;
}
