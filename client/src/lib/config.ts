import { Platform } from 'react-native';

// Бэкенд запускается локально (server/, порт 3000).
// Android-эмулятор видит localhost компьютера по адресу 10.0.2.2.
// Для реального телефона задайте EXPO_PUBLIC_API_URL=http://<IP-компьютера>:3000
const defaultHost = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';

export const API_URL =
  process.env.EXPO_PUBLIC_API_URL ?? `http://${defaultHost}:3000`;

// Заглушка авторизации вместо сервера (src/api/auth.mock.ts).
// Чтобы ходить в настоящий бэкенд, задайте EXPO_PUBLIC_MOCK_AUTH=false
export const MOCK_AUTH = process.env.EXPO_PUBLIC_MOCK_AUTH !== 'false';
