import { API_CONFIG, assertApiConfigured } from '@/constants/api';
import { apiRequest } from '@/services/api';
import type { AuthResponse, LoginPayload, SignupPayload } from '@/types/auth';

/** POST login credentials; returns token and user on success. */
export async function loginUser(payload: LoginPayload): Promise<AuthResponse> {
  assertApiConfigured();

  return apiRequest<AuthResponse>(API_CONFIG.loginUrl, {
    method: 'POST',
    body: JSON.stringify({
      email: payload.email.trim().toLowerCase(),
      password: payload.password,
    }),
  });
}

/** POST signup data; returns token and user on success. */
export async function signupUser(payload: SignupPayload): Promise<AuthResponse> {
  assertApiConfigured();

  return apiRequest<AuthResponse>(API_CONFIG.signupUrl, {
    method: 'POST',
    body: JSON.stringify({
      name: payload.name.trim(),
      email: payload.email.trim().toLowerCase(),
      password: payload.password,
    }),
  });
}
