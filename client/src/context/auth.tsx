import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { api, ApiError, setAccessTokenInMemory, setUnauthorizedHandler, type ApiUser } from '@/lib/api';
import {
  clearTokensOnFreshInstall,
  deleteAccessToken,
  deleteCachedUser,
  readAccessToken,
  readCachedUser,
  saveAccessToken,
  saveCachedUser,
} from '@/lib/token-storage';

type Status = 'loading' | 'authenticated' | 'unauthenticated';

type AuthContextValue = {
  status: Status;
  user: ApiUser | null;
  showWelcome: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (displayName: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  dismissWelcome: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<Status>('loading');
  const [user, setUser] = useState<ApiUser | null>(null);
  const [showWelcome, setShowWelcome] = useState(false);

  // Локальная очистка сессии: работает сразу и без сети
  const clearSession = useCallback(async () => {
    setAccessTokenInMemory(null);
    setUser(null);
    setStatus('unauthenticated');
    await Promise.allSettled([deleteAccessToken(), deleteCachedUser()]);
  }, []);

  // Восстановление сессии при запуске
  useEffect(() => {
    setUnauthorizedHandler(() => {
      void clearSession();
    });

    (async () => {
      try {
        await clearTokensOnFreshInstall();
        const token = await readAccessToken();
        if (!token) {
          setStatus('unauthenticated');
          return;
        }
        setAccessTokenInMemory(token);
        setUser(await readCachedUser());
        setStatus('authenticated'); // сразу в приложение с кэшем профиля

        // проверяем токен в фоне; 401 вызовет выход через onUnauthorized
        api.me().catch((e) => {
          if (!(e instanceof ApiError)) return;
        });
      } catch {
        setStatus('unauthenticated');
      }
    })();

    return () => setUnauthorizedHandler(null);
  }, [clearSession]);

  const login = useCallback(async (email: string, password: string) => {
    const res = await api.login(email, password);
    setAccessTokenInMemory(res.accessToken);
    await saveAccessToken(res.accessToken); // SecureStore
    await saveCachedUser(res.user);          // AsyncStorage
    setUser(res.user);
    setStatus('authenticated');
  }, []);

  const register = useCallback(
    async (displayName: string, email: string, password: string) => {
      await api.register(displayName, email, password);
      setShowWelcome(true); // покажем экран «Аккаунт создан!»
      try {
        await login(email, password); // регистрация токен не возвращает
      } catch (e) {
        setShowWelcome(false);
        throw e;
      }
    },
    [login],
  );

  const logout = useCallback(() => {
    // запрос стартует с ещё не стёртым токеном, ответ не ждём
    api.logout().catch(() => {});
    void clearSession();
  }, [clearSession]);

  const dismissWelcome = useCallback(() => setShowWelcome(false), []);

  const value = useMemo(
    () => ({ status, user, showWelcome, login, register, logout, dismissWelcome }),
    [status, user, showWelcome, login, register, logout, dismissWelcome],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}