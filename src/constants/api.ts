/**
 * API endpoints are loaded from environment variables so URLs can differ
 * per environment without changing application code.
 */
export const API_CONFIG = {
  loginUrl: process.env.EXPO_PUBLIC_LOGIN_API_URL ?? '',
  signupUrl: process.env.EXPO_PUBLIC_SIGNUP_API_URL ?? '',
} as const;

export function assertApiConfigured(): void {
  if (!API_CONFIG.loginUrl || !API_CONFIG.signupUrl) {
    throw {
      message:
        'API URLs are not configured. Set EXPO_PUBLIC_LOGIN_API_URL and EXPO_PUBLIC_SIGNUP_API_URL in your .env file.',
    };
  }
}
