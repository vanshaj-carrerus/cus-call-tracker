import { setAuth } from '@/lib/auth-storage';
import { fetchCurrentUser, loginUser, signupUser } from '@/services/auth.service';
import type { ApiError, AuthResponse, LoginPayload, SignupPayload, User } from '@/types/auth';

/**
 * POST login/signup on submit, persist token, then GET /auth/me to confirm the session.
 */
export async function submitAuth(
  action: 'login' | 'signup',
  payload: LoginPayload | SignupPayload,
): Promise<{ token: string; user: User }> {
  const response: AuthResponse =
    action === 'login'
      ? await loginUser(payload as LoginPayload)
      : await signupUser(payload as SignupPayload);

  if (!response.success || !response.token || !response.user) {
    const error: ApiError = {
      message:
        response.message ??
        `${action === 'login' ? 'Login' : 'Signup'} failed. Please try again.`,
    };
    throw error;
  }

  await setAuth(response.token, response.user);

  let user = response.user;

  try {
    const me = await fetchCurrentUser();
    if (me.success && me.user) {
      user = me.user;
      await setAuth(response.token, user);
    }
  } catch {
    // Keep signup/login user if /me is unavailable
  }

  return { token: response.token, user };
}
