import { request } from './client';

export type ApiUser = {
  id: string;
  email: string;
  displayName: string | null;
};

export type LoginResponse = {
  accessToken: string;
  tokenType: 'Bearer';
  user: ApiUser;
};

type MessageResponse = { message: string };

export const authApi = {
  register: (data: { email: string; password: string; displayName?: string }) =>
    request<ApiUser & { createdAt: string }>('/auth/register', { method: 'POST', body: data }),

  login: (data: { email: string; password: string }) =>
    request<LoginResponse>('/auth/login', { method: 'POST', body: data }),

  // GET /auth/me отдаёт только { id, email }
  me: () => request<{ id: string; email: string }>('/auth/me', { auth: true }),

  logout: (token: string) => request<MessageResponse>('/auth/logout', { method: 'POST', token }),

  forgotPassword: (email: string) =>
    request<MessageResponse>('/auth/forgot-password', { method: 'POST', body: { email } }),

  resetPassword: (data: { token: string; newPassword: string }) =>
    request<MessageResponse>('/auth/reset-password', { method: 'POST', body: data }),
};
