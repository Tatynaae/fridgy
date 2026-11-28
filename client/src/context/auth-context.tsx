import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { authApi, type User } from '@/api/auth';
import { ApiError, setSessionExpiredHandler } from '@/api/client';
import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  saveTokens,
} from '@/lib/token-storage';

type AuthContextValue = {
  user: User | null;
  /** true, пока при запуске приложения проверяется сохранённый токен */
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (input: {
    email: string;
    password: string;
    displayName?: string;
  }) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Если refresh-токен протух посреди работы — выкидываем на экран входа
  useEffect(() => {
    setSessionExpiredHandler(() => setUser(null));
    return () => setSessionExpiredHandler(null);
  }, []);

  // При старте: берём токены из secure storage и проверяем сессию через /auth/me
  // (если access-токен истёк, api/client сам обновит его по refresh-токену)
  useEffect(() => {
    (async () => {
      try {
        const [access, refresh] = await Promise.all([getAccessToken(), getRefreshToken()]);
        if (!access && !refresh) return;
        const me = await authApi.me();
        setUser({ id: me.id, email: me.email, displayName: me.displayName });
      } catch (error) {
        // Сессия недействительна — удаляем токены. При ошибке сети оставляем.
        if (error instanceof ApiError && error.status === 401) {
          await clearTokens();
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const result = await authApi.login({ email, password });
    await saveTokens({
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    });
    setUser(result.user);
  }, []);

  const signUp = useCallback(
    async (input: { email: string; password: string; displayName?: string }) => {
      await authApi.register(input);
      // register токен не возвращает — сразу логинимся
      await signIn(input.email, input.password);
    },
    [signIn],
  );

  const signOut = useCallback(async () => {
    try {
      // Сервер отзывает и access-, и refresh-токен
      await authApi.logout((await getRefreshToken()) ?? undefined);
    } catch {
      // даже если сервер недоступен, локально выходим
    }
    await clearTokens();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, loading, signIn, signUp, signOut }),
    [user, loading, signIn, signUp, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
