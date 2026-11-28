import { ApiError } from './client';
import type { LoginResponse, User } from './auth';

// Заглушка авторизации: работает без сервера, пускает с любым email и паролем.
// Токен вида "mock.<email>" — по нему /auth/me восстанавливает пользователя после перезапуска.
const TOKEN_PREFIX = 'mock.';

// Имена из регистрации живут только до перезапуска приложения
const displayNames = new Map<string, string>();

const delay = () => new Promise((resolve) => setTimeout(resolve, 300));

function mockUser(email: string): User {
  return {
    id: `mock-${email}`,
    email,
    displayName: displayNames.get(email) ?? null,
  };
}

export const mockAuthApi = {
  register: async (body: { email: string; password: string; displayName?: string }) => {
    await delay();
    if (body.displayName) displayNames.set(body.email, body.displayName);
    return mockUser(body.email);
  },

  login: async (body: { email: string; password: string }): Promise<LoginResponse> => {
    await delay();
    return {
      accessToken: `${TOKEN_PREFIX}${body.email}`,
      refreshToken: 'mock.refresh',
      tokenType: 'Bearer',
      user: mockUser(body.email),
    };
  },

  me: async (token: string | null) => {
    if (!token?.startsWith(TOKEN_PREFIX)) {
      throw new ApiError('Unauthorized', 401);
    }
    const { id, email } = mockUser(token.slice(TOKEN_PREFIX.length));
    return { id, email };
  },

  logout: async () => ({ message: 'ok' }),

  forgotPassword: async (_email: string) => {
    await delay();
    return { message: 'ok' };
  },

  resetPassword: async (_token: string, _newPassword: string) => {
    await delay();
    return { message: 'ok' };
  },
};
