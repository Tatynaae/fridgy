// Правила совпадают с zod-схемами сервера (server/src/auth/dto),
// тексты ошибок — из макета Figma.
import { ApiError } from '@/api/client';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEmail(value: string): string | undefined {
  if (!EMAIL_RE.test(value.trim())) return 'Некорректный email';
}

export function validateName(value: string): string | undefined {
  const name = value.trim();
  if (name.length < 2 || name.length > 100) return 'Некорректное имя';
}

export function validatePassword(value: string): string | undefined {
  if (!value) return 'Введите пароль';
  if (value.length < 8) return 'Минимум 8 символов';
  if (value.length > 128) return 'Максимум 128 символов';
  if (!value.trim()) return 'Пароль не может состоять из пробелов';
}

export function validateConfirm(password: string, confirm: string): string | undefined {
  if (confirm !== password) return 'Пароли не совпадают';
}

/**
 * Текст ошибки для плашки. Сервер отвечает по-английски, поэтому для известных
 * статусов подставляем русский текст из макета (`byStatus`).
 */
export function errorMessage(error: unknown, byStatus: Record<number, string> = {}): string {
  if (error instanceof ApiError && byStatus[error.status]) return byStatus[error.status];
  if (error instanceof ApiError && error.status >= 500) {
    return 'Сервер временно недоступен. Попробуйте ещё раз.';
  }
  return error instanceof Error ? error.message : 'Что-то пошло не так';
}

/**
 * Ошибка из-за введённых данных (4xx: неверный пароль, email занят).
 * Только такие блокируют кнопку до правки полей; при сбое сети / 5xx можно сразу повторить.
 */
export function isInputError(error: unknown): boolean {
  return error instanceof ApiError && error.status >= 400 && error.status < 500;
}
