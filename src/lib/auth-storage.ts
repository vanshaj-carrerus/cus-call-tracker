import { deleteSecureItem, getSecureItem, setSecureItem } from '@/lib/secure-storage';
import type { User } from '@/types/auth';

export const AUTH_TOKEN_KEY = 'auth_token';
export const AUTH_USER_KEY = 'auth_user';

export async function getToken(): Promise<string | null> {
  return getSecureItem(AUTH_TOKEN_KEY);
}

export async function getStoredUser(): Promise<User | null> {
  const raw = await getSecureItem(AUTH_USER_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

export async function setAuth(token: string, user: User): Promise<void> {
  await Promise.all([
    setSecureItem(AUTH_TOKEN_KEY, token),
    setSecureItem(AUTH_USER_KEY, JSON.stringify(user)),
  ]);
}

export async function clearAuth(): Promise<void> {
  await Promise.all([deleteSecureItem(AUTH_TOKEN_KEY), deleteSecureItem(AUTH_USER_KEY)]);
}
