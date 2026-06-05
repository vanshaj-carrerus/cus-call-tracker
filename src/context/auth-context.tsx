import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { clearAuth, getStoredUser, getToken, setAuth } from '@/lib/auth-storage';
import { fetchCurrentUser } from '@/services/auth.service';
import type { User } from '@/types/auth';

type AuthContextValue = {
  user: User | null;
  token: string | null;
  /** True while restoring a saved session on app launch. */
  isLoading: boolean;
  /** Apply session after a successful login/signup API round-trip. */
  establishSession: (token: string, user: User) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function restoreSession() {
      try {
        const storedToken = await getToken();
        if (!storedToken) return;

        setToken(storedToken);
        const storedUser = await getStoredUser();
        if (storedUser) setUser(storedUser);

        try {
          const data = await fetchCurrentUser();
          if (data.success && data.user) {
            await setAuth(storedToken, data.user);
            setUser(data.user);
          }
        } catch {
          await clearAuth();
          setToken(null);
          setUser(null);
        }
      } finally {
        setIsLoading(false);
      }
    }

    restoreSession();
  }, []);

  const establishSession = useCallback(async (nextToken: string, nextUser: User) => {
    await setAuth(nextToken, nextUser);
    setToken(nextToken);
    setUser(nextUser);
  }, []);

  const logout = useCallback(async () => {
    await clearAuth();
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, token, isLoading, establishSession, logout }),
    [user, token, isLoading, establishSession, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}
