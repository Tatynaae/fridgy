import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const ACCESS_TOKEN_KEY = 'fridgy_access_token';

// expo-secure-store не работает в вебе — там используем localStorage (только для разработки).
const isWeb = Platform.OS === 'web';

export async function saveAccessToken(token: string): Promise<void> {
  if (isWeb) {
    globalThis.localStorage?.setItem(ACCESS_TOKEN_KEY, token);
    return;
  }
  await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, token);
}

export async function getAccessToken(): Promise<string | null> {
  if (isWeb) {
    return globalThis.localStorage?.getItem(ACCESS_TOKEN_KEY) ?? null;
  }
  return SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
}

export async function clearAccessToken(): Promise<void> {
  if (isWeb) {
    globalThis.localStorage?.removeItem(ACCESS_TOKEN_KEY);
    return;
  }
  await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
}
