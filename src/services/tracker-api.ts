import { assertApiConfigured, TRACKER_BASE } from '@/constants/api';
import { getToken } from '@/lib/auth-storage';
import { apiRequest } from '@/services/api';

export type TrackerFetchOptions = RequestInit & {
  /** Omit Bearer token (login/signup before a session exists). */
  skipAuth?: boolean;
};

/**
 * Authenticated fetch against /api/call-tracker/admin/* (CUS Tech backend).
 */
export async function trackerFetch<T>(
  path: string,
  options: TrackerFetchOptions = {},
): Promise<T> {
  assertApiConfigured();

  const { skipAuth, ...fetchOptions } = options;
  const headers: Record<string, string> = {
    ...(fetchOptions.headers as Record<string, string>),
  };

  if (!skipAuth) {
    const token = await getToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  return apiRequest<T>(`${TRACKER_BASE}${path}`, { ...fetchOptions, headers });
}
