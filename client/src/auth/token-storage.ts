import * as SecureStore from 'expo-secure-store';

const KEY = 'fridgy.auth.accessToken';

export const tokenStorage = {
  read: () => SecureStore.getItemAsync(KEY),
  write: (token: string) => SecureStore.setItemAsync(KEY, token),
  clear: () => SecureStore.deleteItemAsync(KEY),
};
