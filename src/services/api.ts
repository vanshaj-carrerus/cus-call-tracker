import type { ApiError } from '@/types/auth';

/**
 * Shared fetch wrapper — parses JSON, normalizes errors, and throws ApiError.
 */
export async function apiRequest<T>(url: string, options: RequestInit = {}): Promise<T> {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const message =
        (data as { message?: string }).message ??
        (data as { error?: string }).error ??
        'Something went wrong. Please try again.';

      const error: ApiError = { message, status: response.status };
      throw error;
    }

    return data as T;
  } catch (error) {
    if (error && typeof error === 'object' && 'message' in error) {
      throw error;
    }

    throw {
      message: 'Network error. Check your connection and try again.',
    } satisfies ApiError;
  }
}
