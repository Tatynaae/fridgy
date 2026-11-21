import { Platform } from 'react-native';

const DEFAULT_URL = Platform.OS === 'android' ? 'http://10.0.2.2:3000' : 'http://localhost:3000';
export const API_URL = (process.env.EXPO_PUBLIC_API_URL ?? DEFAULT_URL).replace(/\/+$/, '');

export type ApiUser = { id: string; email: string; displayName: string | null };
type LoginResponse = { accessToken: string; tokenType: string; user: ApiUser };

export class ApiError extends Error {
  status: number; // 0 = нет сети
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

// Токен держим в памяти, с диска он читается один раз при запуске
let accessToken: string | null = null;
let onUnauthorized: (() => void) | null = null;

export function setAccessTokenInMemory(token: string | null) {
  accessToken = token;
}
export function setUnauthorizedHandler(handler: (() => void) | null) {
  onUnauthorized = handler;
}

async function request<T>(
  path: string,
  options: { method?: string; body?: unknown; auth?: boolean } = {},
): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (options.auth && accessToken) headers.Authorization = `Bearer ${accessToken}`;

  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      method: options.method ?? 'GET',
      headers,
      body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    });
  } catch (e) {
    console.log('FETCH FAILED:', `${API_URL}${path}`, e);
    throw new ApiError(0, 'Network error');
  }

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    // «Нет сети» не равно «сессия истекла»: разлогиниваем только по ответу 401
    if (res.status === 401 && options.auth) onUnauthorized?.();
    throw new ApiError(res.status, typeof data?.message === 'string' ? data.message : 'Request failed');
  }
  return data as T;
}

export const api = {
  register: (displayName: string, email: string, password: string) =>
    request<ApiUser>('/auth/register', { method: 'POST', body: { displayName, email, password } }),

  login: (email: string, password: string) =>
    request<LoginResponse>('/auth/login', { method: 'POST', body: { email, password } }),

  me: () => request<{ id: string; email: string }>('/auth/me', { auth: true }),

  logout: () => request<{ message: string }>('/auth/logout', { method: 'POST', auth: true }),
};

export function authErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.status === 0) return 'Не удалось связаться с сервером. Проверьте соединение.';
    if (error.status === 409) return 'Этот email уже зарегистрирован. Войдите или восстановите пароль.';
    if (error.status === 401) return 'Неверный email или пароль.';
    if (error.status === 400) return 'Проверьте введённые данные.';
  }
  return 'Что-то пошло не так. Попробуйте позже.';
}