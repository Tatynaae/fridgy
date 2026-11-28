import { request } from './client';

export type User = {
  id: string;
  email: string;
  displayName?: string | null;
};

export type LoginResponse = {
  accessToken: string;
  tokenType: 'Bearer';
  user: User;
};

export const authApi = {
  register: (body: { email: string; password: string; displayName?: string }) =>
    request<User>('/auth/register', { method: 'POST', body }),

  login: (body: { email: string; password: string }) =>
    request<LoginResponse>('/auth/login', { method: 'POST', body }),

  me: () => request<{ id: string; email: string }>('/auth/me', { auth: true }),

  logout: () =>
    request<{ message: string }>('/auth/logout', { method: 'POST', auth: true }),

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
