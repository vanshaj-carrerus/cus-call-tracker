import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { deleteSecureItem, getSecureItem, setSecureItem } from '@/lib/secure-storage';
import { loginUser, signupUser } from '@/services/auth.service';
import type { LoginPayload, SignupPayload, User } from '@/types/auth';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

type AuthContextValue = {
  user: User | null;
  token: string | null;
  /** True while restoring a saved session on app launch. */
  isLoading: boolean;
  /** True while a login or signup request is in progress. */
  isSubmitting: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  signup: (payload: SignupPayload) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Restore session from secure storage when the app starts
  useEffect(() => {
    async function restoreSession() {
      try {
        const [storedToken, storedUser] = await Promise.all([
          getSecureItem(TOKEN_KEY),
          getSecureItem(USER_KEY),
        ]);

        if (storedToken) {
          setToken(storedToken);
          setUser(storedUser ? JSON.parse(storedUser) : null);
        }
      } finally {
        setIsLoading(false);
      }
    }

    restoreSession();
  }, []);

  const persistSession = useCallback(async (nextToken: string, nextUser: User) => {
    await Promise.all([
      setSecureItem(TOKEN_KEY, nextToken),
      setSecureItem(USER_KEY, JSON.stringify(nextUser)),
    ]);
    setToken(nextToken);
    setUser(nextUser);
  }, []);

  const clearSession = useCallback(async () => {
    await Promise.all([deleteSecureItem(TOKEN_KEY), deleteSecureItem(USER_KEY)]);
    setToken(null);
    setUser(null);
  }, []);

  const login = useCallback(
    async (payload: LoginPayload) => {
      setIsSubmitting(true);
      try {
        const response = await loginUser(payload);

        if (!response.success || !response.token) {
          throw { message: 'Login failed. Please try again.' };
        }

        await persistSession(response.token, response.user);
      } finally {
        setIsSubmitting(false);
      }
    },
    [persistSession],
  );

  const signup = useCallback(
    async (payload: SignupPayload) => {
      setIsSubmitting(true);
      try {
        const response = await signupUser(payload);

        if (!response.success || !response.token) {
          throw { message: 'Signup failed. Please try again.' };
        }

        await persistSession(response.token, response.user);
      } finally {
        setIsSubmitting(false);
      }
    },
    [persistSession],
  );

  const logout = useCallback(async () => {
    await clearSession();
  }, [clearSession]);

  const value = useMemo(
    () => ({ user, token, isLoading, isSubmitting, login, signup, logout }),
    [user, token, isLoading, isSubmitting, login, signup, logout],
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
