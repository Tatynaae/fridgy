import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { AppState } from 'react-native';

import { authApi, AuthApiError, type User } from './api';
import { tokenStorage } from './token-storage';

type SessionContextValue = {
  user: User | null;
  loading: boolean;
  restoreError: boolean;
  restore: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [restoreError, setRestoreError] = useState(false);
  const activeToken = useRef<string | null>(null);
  const endingSession = useRef(false);

  const restore = useCallback(async () => {
    setLoading(true);
    setRestoreError(false);
    try {
      const token = await tokenStorage.read();
      if (token) {
        try {
          const profile = await authApi.me(token);
          activeToken.current = token;
          setUser(profile);
        } catch (error) {
          if (!(error instanceof AuthApiError) || error.status !== 401)
            throw error;
          await tokenStorage.clear();
        }
      }
    } catch {
      setRestoreError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void restore();
  }, [restore]);

  useEffect(() => {
    const checkSession = async () => {
      const token = activeToken.current;
      if (!token || endingSession.current) return;
      try {
        await authApi.me(token);
      } catch (error) {
        if (
          error instanceof AuthApiError &&
          error.status === 401 &&
          activeToken.current === token &&
          !endingSession.current
        ) {
          // Clear the active session even if device storage is temporarily unavailable.
          endingSession.current = true;
          try {
            await tokenStorage.clear();
          } catch {
            setRestoreError(true);
          } finally {
            activeToken.current = null;
            endingSession.current = false;
            setUser(null);
          }
        }
      }
    };
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') void checkSession();
    });
    const interval = setInterval(() => {
      if (AppState.currentState === 'active') void checkSession();
    }, 60000);
    return () => {
      subscription.remove();
      clearInterval(interval);
    };
  }, []);

  async function signIn(email: string, password: string) {
    const session = await authApi.login({ email, password });
    try {
      await tokenStorage.write(session.accessToken);
    } catch {
      await authApi.logout(session.accessToken).catch(() => undefined);
      throw new Error('Не удалось сохранить сессию на устройстве.');
    }
    activeToken.current = session.accessToken;
    setUser(session.user);
  }

  async function signOut() {
    const token = activeToken.current;
    if (!token || endingSession.current) return;
    endingSession.current = true;
    try {
      try {
        await authApi.logout(token);
      } catch (error) {
        if (error instanceof AuthApiError && error.status !== 401) throw error;
        // An offline device can still remove its local session.
      }
      try {
        await tokenStorage.clear();
      } catch {
        throw new Error(
          'Не удалось удалить сессию с устройства. Попробуй ещё раз.',
        );
      }
      activeToken.current = null;
      setUser(null);
    } finally {
      endingSession.current = false;
    }
  }

  return (
    <SessionContext.Provider
      value={{ user, loading, restoreError, restore, signIn, signOut }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) throw new Error('SessionProvider is missing');
  return context;
}
