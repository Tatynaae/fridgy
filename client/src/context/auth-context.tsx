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
import { ApiError } from '@/api/client';
import {
  clearAccessToken,
  getAccessToken,
  saveAccessToken,
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

  // При старте: берём токен из secure storage и проверяем его через /auth/me
  useEffect(() => {
    (async () => {
      try {
        const token = await getAccessToken();
        if (!token) return;
        const me = await authApi.me();
        setUser({ id: me.id, email: me.email });
      } catch (error) {
        // Токен просрочен/отозван — удаляем. При ошибке сети токен оставляем.
        if (error instanceof ApiError && error.status === 401) {
          await clearAccessToken();
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const result = await authApi.login({ email, password });
    await saveAccessToken(result.accessToken);
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
      await authApi.logout();
    } catch {
      // даже если сервер недоступен, локально выходим
    }
    await clearAccessToken();
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
