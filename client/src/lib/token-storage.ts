import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// Токены храним в expo-secure-store: iOS Keychain / Android Keystore (EncryptedSharedPreferences).
const ACCESS_TOKEN_KEY = 'fridgy_access_token';
const REFRESH_TOKEN_KEY = 'fridgy_refresh_token';

export type Tokens = { accessToken: string; refreshToken: string };

// expo-secure-store не работает в вебе — там fallback на localStorage (только для разработки).
const isWeb = Platform.OS === 'web';

const secureOptions: SecureStore.SecureStoreOptions = {
  // Токен доступен только на этом устройстве и не попадает в бэкапы iCloud
  keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
};

async function setItem(key: string, value: string) {
  if (isWeb) {
    globalThis.localStorage?.setItem(key, value);
    return;
  }
  await SecureStore.setItemAsync(key, value, secureOptions);
}

async function getItem(key: string): Promise<string | null> {
  if (isWeb) return globalThis.localStorage?.getItem(key) ?? null;
  return SecureStore.getItemAsync(key, secureOptions);
}

async function deleteItem(key: string) {
  if (isWeb) {
    globalThis.localStorage?.removeItem(key);
    return;
  }
  await SecureStore.deleteItemAsync(key, secureOptions);
}

export async function saveTokens({ accessToken, refreshToken }: Tokens): Promise<void> {
  await Promise.all([
    setItem(ACCESS_TOKEN_KEY, accessToken),
    setItem(REFRESH_TOKEN_KEY, refreshToken),
  ]);
}

export function getAccessToken(): Promise<string | null> {
  return getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken(): Promise<string | null> {
  return getItem(REFRESH_TOKEN_KEY);
}

export async function clearTokens(): Promise<void> {
  await Promise.all([deleteItem(ACCESS_TOKEN_KEY), deleteItem(REFRESH_TOKEN_KEY)]);
}
