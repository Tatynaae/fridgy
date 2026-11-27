// SecureStore is native only. The browser session lives in the provider's memory.
export const sessionStorage = {
  get: async (): Promise<string | null> => null,
  save: async (_token: string): Promise<void> => {},
  clear: async (): Promise<void> => {},
};
