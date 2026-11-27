import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { AppState } from 'react-native';

import { authApi, authErrorMessage, AuthRequestError, type AuthSession } from './api';
import { sessionStorage } from './session-storage';
import { getTokenExpiry } from './token-expiry';

export class SessionStorageError extends Error {
  constructor(operation: 'read' | 'save' | 'clear', cause: unknown) {
    const messages = {
      read: 'Не удалось прочитать сессию на устройстве. Попробуйте еще раз.',
      save: 'Не удалось сохранить сессию на устройстве. Попробуйте еще раз.',
      clear: 'Не удалось удалить токен с устройства. Попробуйте еще раз.',
    };
    super(messages[operation], { cause });
  }
}

async function clearStoredSession() {
  try {
    await sessionStorage.clear();
  } catch (error) {
    throw new SessionStorageError('clear', error);
  }
}

const AuthSessionContext = createContext<{
  session: AuthSession | null;
  restoring: boolean;
  restoreError: string | null;
  retryRestore: () => void;
  signIn: (email: string, password: string, isCurrent: () => boolean) => Promise<void>;
  register: typeof authApi.register;
  signOut: () => Promise<void>;
} | null>(null);

export function AuthSessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [restoring, setRestoring] = useState(true);
  const [restoreError, setRestoreError] = useState<string | null>(null);
  const [restoreAttempt, setRestoreAttempt] = useState(0);
  const changingSession = useRef(false);

  useEffect(() => {
    let active = true;

    async function restore() {
      try {
        let accessToken: string | null;
        try {
          accessToken = await sessionStorage.get();
        } catch (error) {
          throw new SessionStorageError('read', error);
        }

        if (!active) return;

        const expiresAt = accessToken ? getTokenExpiry(accessToken) : undefined;
        if (expiresAt !== undefined && Date.now() >= expiresAt) {
          await clearStoredSession();
        } else if (accessToken) {
          try {
            const user = await authApi.me(accessToken);
            if (active) setSession({ accessToken, user });
          } catch (error) {
            if (!(error instanceof AuthRequestError && error.status === 401)) throw error;
            if (active) await clearStoredSession();
          }
        }
        if (active) setRestoreError(null);
      } catch (error) {
        if (active) setRestoreError(error instanceof SessionStorageError ? error.message : authErrorMessage(error));
      } finally {
        if (active) setRestoring(false);
      }
    }

    void restore();
    return () => { active = false; };
  }, [restoreAttempt]);

  useEffect(() => {
    if (!session) return;

    let active = true;
    let checking = false;

    const accessToken = session.accessToken;
    const expiresAt = getTokenExpiry(accessToken);

    async function endSession() {
      if (!active || changingSession.current) return;
      changingSession.current = true;

      try {
        await clearStoredSession();
      } catch (error) {
        if (active && error instanceof SessionStorageError) setRestoreError(error.message);
      } finally {
        if (active) setSession(null);
        changingSession.current = false;
      }
    }

    async function checkSession() {
      if (!active || changingSession.current) return;
      if (expiresAt !== undefined && Date.now() >= expiresAt) {
        await endSession();
        return;
      }

      if (checking) return;
      checking = true;
      try {
        await authApi.me(accessToken);
      } catch (error) {
        if (error instanceof AuthRequestError && error.status === 401) await endSession();
      } finally {
        checking = false;
      }
    }

    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') void checkSession();
    });
    const timer = setInterval(() => {
      if (AppState.currentState === 'active') void checkSession();
    }, 30_000);

    const expiryTimer = expiresAt === undefined ? undefined : setTimeout(
      () => void checkSession(),
      Math.min(Math.max(expiresAt - Date.now(), 0), 2_147_483_647),
    );

    return () => {
      active = false;
      subscription.remove();
      clearTimeout(expiryTimer);
      clearInterval(timer);
    };
  }, [session]);

  function retryRestore() {
    if (restoring) return;
    setRestoring(true);
    setRestoreAttempt((attempt) => attempt + 1);
  }

  async function signIn(email: string, password: string, isCurrent: () => boolean) {
    if (changingSession.current) return;
    changingSession.current = true;
    try {
      const next = await authApi.signIn(email, password);
      if (!isCurrent()) return;
      try {
        await sessionStorage.save(next.accessToken);
      } catch (error) {
        throw new SessionStorageError('save', error);
      }
      setSession(next);
    } finally {
      changingSession.current = false;
    }
  }

  async function signOut() {
    if (!session || changingSession.current) return;
    changingSession.current = true;

    try {
      await clearStoredSession();
      setSession(null);

      // Local logout also works offline. Server revocation is best-effort.
      void authApi.signOut(session.accessToken).catch(() => undefined);
    } finally {
      changingSession.current = false;
    }
  }

  return (
    <AuthSessionContext.Provider value={{
      session, restoring, restoreError, retryRestore, signIn, register: authApi.register, signOut,
    }}>
      {children}
    </AuthSessionContext.Provider>
  );
}

export function useAuthSession() {
  const session = useContext(AuthSessionContext);
  if (!session) throw new Error('AuthSessionProvider is missing');
  return session;
}
