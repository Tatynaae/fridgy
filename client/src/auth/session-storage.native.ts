import * as SecureStore from 'expo-secure-store';

const tokenKey = 'fridgy.accessToken';
const options = { keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY };

export const sessionStorage = {
  get: () => SecureStore.getItemAsync(tokenKey, options),
  save: (token: string) => SecureStore.setItemAsync(tokenKey, token, options),
  clear: () => SecureStore.deleteItemAsync(tokenKey, options),
};
