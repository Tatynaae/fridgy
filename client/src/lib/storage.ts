import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// Правило из презентации: токены — только в SecureStore (шифрование: Keychain / Keystore),
// всё остальное (профиль, флаги, настройки) — в AsyncStorage. Ключи SecureStore: только буквы, цифры, «.», «-», «_».
const ACCESS_TOKEN_KEY = 'auth.accessToken';
const USER_KEY = 'app:user';
const INSTALLED_KEY = 'app:installed';

// SecureStore работает только на iOS и Android. На web его нет — для разработки откатываемся на AsyncStorage.
const hasSecureStore = Platform.OS !== 'web';

// Токен доступен только после разблокировки устройства и не попадает в бэкап / на другое устройство.
const SECURE_OPTIONS: SecureStore.SecureStoreOptions = {
  keychainAccessible: SecureStore.AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY,
};

// Токен держим в памяти: системный вызов Keychain медленный, с диска читаем один раз при запуске.
// undefined — ещё не читали, null — токена нет.
let memoryToken: string | null | undefined;

export const tokenStorage = {
  async get(): Promise<string | null> {
    if (memoryToken !== undefined) return memoryToken;
    const stored = hasSecureStore
      ? await SecureStore.getItemAsync(ACCESS_TOKEN_KEY, SECURE_OPTIONS)
      : await AsyncStorage.getItem(ACCESS_TOKEN_KEY);
    // Если за время чтения успели записать/очистить токен — не затираем свежее значение
    if (memoryToken === undefined) memoryToken = stored;
    return memoryToken;
  },

  async set(token: string): Promise<void> {
    memoryToken = token;
    if (hasSecureStore) await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, token, SECURE_OPTIONS);
    else await AsyncStorage.setItem(ACCESS_TOKEN_KEY, token);
  },

  async clear(): Promise<void> {
    memoryToken = null; // из памяти — сразу, чтобы выход сработал мгновенно
    if (hasSecureStore) await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY, SECURE_OPTIONS);
    else await AsyncStorage.removeItem(ACCESS_TOKEN_KEY);
  },
};

export type StoredUser = {
  id: string;
  email: string;
  displayName: string | null;
};

/** Кэш профиля (не секрет) — чтобы показать профиль сразу при запуске, до ответа сервера. */
export const userStorage = {
  async get(): Promise<StoredUser | null> {
    try {
      const raw = await AsyncStorage.getItem(USER_KEY);
      return raw ? (JSON.parse(raw) as StoredUser) : null;
    } catch {
      return null; // повреждённая строка не должна ронять приложение
    }
  },

  async set(user: StoredUser): Promise<void> {
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  async clear(): Promise<void> {
    await AsyncStorage.removeItem(USER_KEY);
  },
};

/**
 * На iOS Keychain переживает удаление приложения: после переустановки «воскресают» старые токены.
 * AsyncStorage при удалении очищается, поэтому флаг первого запуска позволяет это поймать:
 * нет флага → это первый запуск после установки → чистим SecureStore.
 */
export async function clearStaleSecretsOnFirstLaunch(): Promise<void> {
  try {
    if (await AsyncStorage.getItem(INSTALLED_KEY)) return;
    await tokenStorage.clear();
    await AsyncStorage.setItem(INSTALLED_KEY, '1');
  } catch {
    // не блокируем запуск, если хранилище недоступно
  }
}
