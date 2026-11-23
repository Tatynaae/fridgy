import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const ACCESS_TOKEN_KEY = 'auth.accessToken';
const INSTALLED_FLAG_KEY = 'app:installed';
const PROFILE_KEY = 'app:profile';

// SecureStore не работает в вебе, поэтому там запасной вариант (только для разработки)
const useSecure = Platform.OS !== 'web';

const SECURE_OPTIONS: SecureStore.SecureStoreOptions = {
  // токен не попадает в бэкап и на другое устройство (слайд про keychainAccessible)
  keychainAccessible: SecureStore.AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY,
};

export async function saveAccessToken(token: string) {
  if (useSecure) {
    await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, token, SECURE_OPTIONS);
  } else {
    await AsyncStorage.setItem(ACCESS_TOKEN_KEY, token);
  }
}

export async function readAccessToken(): Promise<string | null> {
  return useSecure
    ? SecureStore.getItemAsync(ACCESS_TOKEN_KEY)
    : AsyncStorage.getItem(ACCESS_TOKEN_KEY);
}

export async function deleteAccessToken() {
  if (useSecure) {
    await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
  } else {
    await AsyncStorage.removeItem(ACCESS_TOKEN_KEY);
  }
}

// На iOS Keychain переживает удаление приложения. Если флага первого запуска нет,
// значит приложение поставили заново, и старый токен нужно стереть.
export async function clearTokensOnFreshInstall() {
  const flag = await AsyncStorage.getItem(INSTALLED_FLAG_KEY);
  if (flag === null) {
    await deleteAccessToken();
    await AsyncStorage.setItem(INSTALLED_FLAG_KEY, '1');
  }
}

// Профиль пользователя (не секрет) хранится в AsyncStorage как JSON
export type CachedUser = { id: string; email: string; displayName: string | null };

export async function readCachedUser(): Promise<CachedUser | null> {
  try {
    const raw = await AsyncStorage.getItem(PROFILE_KEY);
    return raw !== null ? (JSON.parse(raw) as CachedUser) : null;
  } catch {
    return null; // повреждённая строка не должна ронять приложение
  }
}

export async function saveCachedUser(user: CachedUser) {
  await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(user));
}

export async function deleteCachedUser() {
  await AsyncStorage.removeItem(PROFILE_KEY);
}