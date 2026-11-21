// Правила совпадают с zod-схемами на сервере (server/src/auth/dto)
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEmail(email: string): string | undefined {
  if (!email.trim()) return 'Введите email';
  if (!EMAIL_RE.test(email.trim())) return 'Некорректный email';
}

export function validatePassword(password: string): string | undefined {
  if (password.length < 8) return 'Минимум 8 символов';
  if (password.length > 128) return 'Максимум 128 символов';
  if (!password.trim()) return 'Пароль не может состоять из пробелов';
}

export function validateName(name: string): string | undefined {
  const value = name.trim();
  if (!value) return undefined; // имя необязательное
  if (value.length < 2) return 'Минимум 2 символа';
  if (value.length > 100) return 'Максимум 100 символов';
}
