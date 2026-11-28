import { MOCK_AUTH } from '@/lib/config';
import { getAccessToken } from '@/lib/token-storage';

import { mockAuthApi } from './auth.mock';
import { request } from './client';

export type User = {
  id: string;
  email: string;
  displayName?: string | null;
};

export type AuthResponse = {
  accessToken: string;
  refreshToken: string;
  tokenType: 'Bearer';
  user: User;
};

export type LoginResponse = AuthResponse;

const serverAuthApi = {
  register: (body: { email: string; password: string; displayName?: string }) =>
    request<User>('/auth/register', { method: 'POST', body }),

  login: (body: { email: string; password: string }) =>
    request<AuthResponse>('/auth/login', { method: 'POST', body }),

  refresh: (refreshToken: string) =>
    request<AuthResponse>('/auth/refresh', { method: 'POST', body: { refreshToken } }),

  me: () => request<User>('/auth/me', { auth: true }),

  logout: (refreshToken?: string) =>
    request<{ message: string }>('/auth/logout', {
      method: 'POST',
      auth: true,
      body: refreshToken ? { refreshToken } : {},
    }),

  forgotPassword: (email: string) =>
    request<{ message: string }>('/auth/forgot-password', {
      method: 'POST',
      body: { email },
    }),

  resetPassword: (token: string, newPassword: string) =>
    request<{ message: string }>('/auth/reset-password', {
      method: 'POST',
      body: { token, newPassword },
    }),
};

export const authApi: typeof serverAuthApi = MOCK_AUTH
  ? {
      ...mockAuthApi,
      refresh: serverAuthApi.refresh,
      me: async () => mockAuthApi.me(await getAccessToken()),
    }
  : serverAuthApi;
