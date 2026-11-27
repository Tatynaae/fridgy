import { Platform } from 'react-native';

const apiUrl = (
  process.env.EXPO_PUBLIC_API_URL ??
  (Platform.OS === 'android' ? 'http://10.0.2.2:3000' : 'http://localhost:3000')
).replace(/\/+$/, '');

type AuthUser = {
  id: string;
  email: string;
  displayName: string | null;
};

export type AuthSession = {
  accessToken: string;
  user: AuthUser;
};

export class AuthRequestError extends Error {
  constructor(public readonly status: number) {
    super(`Authentication request failed (${status})`);
  }
}

async function request<T>(
  endpoint: string,
  method: 'GET' | 'POST',
  body?: Record<string, string>,
  accessToken?: string,
): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(`${apiUrl}/auth/${endpoint}`, {
      method,
      headers: {
        ...(body ? { 'Content-Type': 'application/json' } : {}),
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });

    if (!response.ok) throw new AuthRequestError(response.status);
    return await response.json() as T;
  } finally {
    clearTimeout(timeout);
  }
}

export const authApi = {
  signIn: (email: string, password: string) =>
    request<AuthSession>('login', 'POST', { email, password }),
  register: (email: string, password: string, displayName: string) =>
    request('register', 'POST', { email, password, displayName }),
  sendResetLink: (email: string) => request('forgot-password', 'POST', { email }),
  resetPassword: (token: string, newPassword: string) =>
    request('reset-password', 'POST', { token, newPassword }),
  me: (accessToken: string) => request<AuthUser>('me', 'GET', undefined, accessToken),
  signOut: (accessToken: string) => request('logout', 'POST', undefined, accessToken),
};

export function authErrorMessage(error: unknown) {
  if (error instanceof AuthRequestError) {
    if (error.status === 400) return 'Проверьте введенные данные и попробуйте снова.';
    if (error.status === 429) return 'Слишком много попыток. Попробуйте чуть позже.';
    return 'Не удалось выполнить запрос. Попробуйте еще раз.';
  }

  return 'Не удалось связаться с сервером. Проверьте подключение и попробуйте снова.';
}
