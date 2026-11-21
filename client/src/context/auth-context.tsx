import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { authApi } from '@/api/auth';
import { ApiError, setUnauthorizedHandler } from '@/api/client';
import {
  clearStaleSecretsOnFirstLaunch,
  tokenStorage,
  userStorage,
  type StoredUser,
} from '@/lib/storage';

type AuthContextValue = {
  /** true, пока читаем токен из SecureStore при запуске */
  isLoading: boolean;
  isAuthenticated: boolean;
  user: StoredUser | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<StoredUser | null>(null);

  // Локальный выход: чистим SecureStore + AsyncStorage и состояние.
  const clearSession = useCallback(async () => {
    await Promise.all([tokenStorage.clear(), userStorage.clear()]);
    setToken(null);
    setUser(null);
  }, []);

  // Восстановление сессии при запуске приложения.
  useEffect(() => {
    let cancelled = false;

    (async () => {
      let savedToken: string | null = null;
      try {
        await clearStaleSecretsOnFirstLaunch();
        const [token, savedUser] = await Promise.all([tokenStorage.get(), userStorage.get()]);
        if (cancelled) return;

        savedToken = token;
        if (token) {
          // Токен есть → сразу в приложение с кэшем профиля.
          setToken(token);
          setUser(savedUser);
        }
      } finally {
        // Сплэш держится, пока статус loading: экран входа не мелькает.
        if (!cancelled) setIsLoading(false);
      }

      if (!savedToken) return;

      // Токен проверяем в фоне. Только ответ сервера 401 = сессия истекла или отозвана;
      // «нет сети» (status 0) и 5xx сессию не трогают.
      try {
        await authApi.me();
      } catch (error) {
        const stillSame = (await tokenStorage.get()) === savedToken;
        if (error instanceof ApiError && error.status === 401 && stillSame && !cancelled) {
          await clearSession();
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [clearSession]);

  // Любой защищённый запрос с 401 → выходим из аккаунта.
  useEffect(() => {
    setUnauthorizedHandler(() => {
      void clearSession();
    });
    return () => setUnauthorizedHandler(null);
  }, [clearSession]);

  const signIn = useCallback(async (email: string, password: string) => {
    const result = await authApi.login({ email, password });
    // Токен — в SecureStore, профиль — в AsyncStorage.
    await tokenStorage.set(result.accessToken);
    await userStorage.set(result.user);
    setToken(result.accessToken);
    setUser(result.user);
  }, []);

  const signOut = useCallback(async () => {
    const current = await tokenStorage.get();
    // Токен на сервере гасим, не дожидаясь ответа: выход срабатывает сразу, даже без сети.
    if (current) authApi.logout(current).catch(() => {});
    await clearSession();
  }, [clearSession]);

  const value = useMemo<AuthContextValue>(
    () => ({ isLoading, isAuthenticated: token !== null, user, signIn, signOut }),
    [isLoading, token, user, signIn, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
