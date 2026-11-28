import { API_URL } from '@/lib/config';
import { getAccessToken } from '@/lib/token-storage';

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

type RequestOptions = {
  method?: 'GET' | 'POST';
  body?: unknown;
  auth?: boolean;
  /** Явный токен (например, сразу после логина, пока он ещё не сохранён). */
  token?: string;
};

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

export async function request<T>(
  path: string,
  { method = 'GET', body, auth = false, token }: RequestOptions = {},
): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };

  if (auth || token) {
    const accessToken = token ?? (await getAccessToken());
    if (accessToken) headers.Authorization = `Bearer ${accessToken}`;
  }

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

  if (!response.ok) {
    throw new ApiError(
      extractMessage(data, 'Что-то пошло не так'),
      response.status,
    );
  }

  return data as T;
}
