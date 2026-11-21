// SecureStore is native-only. Browser sessions live in memory until a reload.
let accessToken: string | null = null;

export const tokenStorage = {
  async read() {
    return accessToken;
  },
  async write(token: string) {
    accessToken = token;
  },
  async clear() {
    accessToken = null;
  },
};
