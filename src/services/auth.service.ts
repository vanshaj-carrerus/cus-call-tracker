import { trackerFetch } from '@/services/tracker-api';
import type { AuthResponse, LoginPayload, MeResponse, SignupPayload } from '@/types/auth';

/** POST login credentials; returns token and user on success. */
export async function loginUser(payload: LoginPayload): Promise<AuthResponse> {
  return trackerFetch<AuthResponse>('/auth/login', {
    method: 'POST',
    skipAuth: true,
    body: JSON.stringify({
      email: payload.email.trim().toLowerCase(),
      password: payload.password,
    }),
  });
}

/** POST signup data; returns token and user on success. */
export async function signupUser(payload: SignupPayload): Promise<AuthResponse> {
  return trackerFetch<AuthResponse>('/auth/signup', {
    method: 'POST',
    skipAuth: true,
    body: JSON.stringify({
      name: payload.name.trim(),
      email: payload.email.trim().toLowerCase(),
      password: payload.password,
    }),
  });
}

/** GET current user from token (validates session on app launch). */
export async function fetchCurrentUser(): Promise<MeResponse> {
  return trackerFetch<MeResponse>('/auth/me');
}
