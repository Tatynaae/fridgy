import { ApiError } from './client';

// Сервер (NestJS) отвечает по-английски — переводим известные сообщения для пользователя
const MESSAGES: Record<string, string> = {
  'Invalid email or password': 'Неверный email или пароль',
  'Email already registered': 'Этот email уже зарегистрирован',
  'Invalid or expired password reset token':
    'Ссылка недействительна или устарела. Запросите сброс пароля заново.',
  'Password must be at least 8 characters': 'Минимум 8 символов',
  'Password must be at most 128 characters': 'Максимум 128 символов',
  'Password cannot contain only whitespace': 'Пароль не может состоять из пробелов',
  'Display name must be at least 2 characters': 'Имя: минимум 2 символа',
  'Display name must be at most 100 characters': 'Имя: максимум 100 символов',
};

export function humanizeError(error: unknown, fallback: string): string {
  if (error instanceof ApiError) {
    if (error.status === 0) return error.message; // «Не удалось подключиться к серверу»
    if (MESSAGES[error.message]) return MESSAGES[error.message];
    if (error.status === 429) return 'Слишком много попыток. Подождите немного.';
    if (error.status >= 500) return 'Ошибка сервера. Попробуйте позже.';
    if (error.status === 400) return 'Проверьте введённые данные';
  }
  return fallback;
}
