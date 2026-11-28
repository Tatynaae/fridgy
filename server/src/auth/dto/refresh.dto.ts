import { z } from 'zod';

export const refreshSchema = z
  .object({
    refreshToken: z.string().min(1, 'Refresh token is required').max(512),
  })
  .strict();

export const logoutSchema = z
  .object({
    refreshToken: z.string().min(1).max(512).optional(),
  })
  .strict();

export type RefreshDto = z.infer<typeof refreshSchema>;
