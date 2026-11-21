import { Platform } from 'react-native';

const localHost = Platform.OS === 'android' ? '10.0.2.2' : '127.0.0.1';
const baseUrl = (
  process.env.EXPO_PUBLIC_API_URL || `http://${localHost}:3000`
).replace(/\/+$/, '');

export type User = { id: string; email: string; displayName?: string | null };
type Session = { accessToken: string; user: User };
type Credentials = { email: string; password: string };

export class AuthApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
  }
}

async function request<T>(
  path: string,
  options: { body?: object; token?: string; method?: 'POST' } = {},
): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 10000);
  try {
    const response = await fetch(`${baseUrl}/auth/${path}`, {
      method: options.method ?? 'GET',
      signal: controller.signal,
      headers: {
        ...(options.body && { 'Content-Type': 'application/json' }),
        ...(options.token && { Authorization: `Bearer ${options.token}` }),
      },
      body: options.body && JSON.stringify(options.body),
    });

    if (!response.ok) {
      const messages: Record<number, string> = {
        400: 'Проверь введённые данные.',
        401:
          path === 'reset-password'
            ? 'Ссылка устарела или уже использована.'
            : 'Неверная почта или пароль.',
        409: 'Этот email уже зарегистрирован.',
      };
      throw new AuthApiError(
        response.status,
        messages[response.status] ?? 'Ошибка сервера. Попробуй ещё раз.',
      );
    }
    return (await response.json()) as T;
  } catch (error) {
    if (error instanceof AuthApiError) throw error;
    throw new Error(
      'Не удалось связаться с сервером. Проверь подключение и повтори попытку.',
    );
  } finally {
    clearTimeout(timer);
  }
}

export const authApi = {
  login: (body: Credentials) =>
    request<Session>('login', { method: 'POST', body }),
  register: (body: Credentials & { displayName?: string }) =>
    request<User>('register', { method: 'POST', body }),
  me: (token: string) => request<User>('me', { token }),
  logout: (token: string) => request('logout', { method: 'POST', token }),
  forgotPassword: (email: string) =>
    request('forgot-password', { method: 'POST', body: { email } }),
  resetPassword: (token: string, newPassword: string) =>
    request('reset-password', { method: 'POST', body: { token, newPassword } }),
};
