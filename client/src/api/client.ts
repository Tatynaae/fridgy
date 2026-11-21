import Constants from 'expo-constants';
import { Platform } from 'react-native';

import { tokenStorage } from '@/lib/storage';

/**
 * Адрес бэкенда (/server, порт 3000).
 * 1) EXPO_PUBLIC_API_URL, если задан (например, http://192.168.1.10:3000);
 * 2) иначе берём IP машины, на которой запущен Metro (работает и на реальном телефоне);
 * 3) иначе Android-эмулятор → 10.0.2.2, остальное → localhost.
 */
function resolveBaseUrl(): string {
  const fromEnv = process.env.EXPO_PUBLIC_API_URL;
  if (fromEnv) return fromEnv.replace(/\/+$/, '');

  const host = Constants.expoConfig?.hostUri?.split(':')[0];
  if (host) return `http://${host}:3000`;

  return Platform.OS === 'android' ? 'http://10.0.2.2:3000' : 'http://localhost:3000';
}

export const API_URL = resolveBaseUrl();

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Вызывается при 401 на защищённых запросах (токен истёк / отозван).
let onUnauthorized: (() => void) | null = null;
export function setUnauthorizedHandler(handler: (() => void) | null) {
  onUnauthorized = handler;
}

type RequestOptions = {
  method?: 'GET' | 'POST';
  body?: unknown;
  /** Подставить Authorization: Bearer <token> из SecureStore. */
  auth?: boolean;
  /** Подставить конкретный токен вместо токена из хранилища (401 при этом не разлогинивает) */
  token?: string;
};

// NestJS отдаёт ошибки как { message: string | string[], errors?: ZodIssue[] }.
function extractMessage(data: unknown, fallback: string): string {
  if (data && typeof data === 'object') {
    const { message, errors } = data as { message?: unknown; errors?: { message?: string }[] };
    if (Array.isArray(errors) && errors[0]?.message) return errors[0].message;
    if (typeof message === 'string') return message;
    if (Array.isArray(message) && typeof message[0] === 'string') return message[0];
  }
  return fallback;
}

export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, auth = false } = options;

  const headers: Record<string, string> = { Accept: 'application/json' };
  if (body !== undefined) headers['Content-Type'] = 'application/json';

  // Явный token — для запроса, который должен уйти с уже отозванным из хранилища токеном (выход).
  const token = options.token ?? (auth ? await tokenStorage.get() : null);
  if (token) headers.Authorization = `Bearer ${token}`;

  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError(
      `Не удалось подключиться к серверу (${API_URL}). Проверьте, что бэкенд запущен.`,
      0,
    );
  }

  const data: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    if (response.status === 401 && auth) onUnauthorized?.();
    throw new ApiError(extractMessage(data, 'Что-то пошло не так'), response.status);
  }

  return data as T;
}
