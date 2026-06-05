/**
 * CUS Tech backend base URL (no trailing slash).
 * Dev: http://localhost:3000 — Prod: https://www.custech.co
 */
export const API_BASE = process.env.EXPO_PUBLIC_API_BASE_URL?.replace(/\/$/, '') ?? '';

/** Admin call-tracker API prefix */
export const TRACKER_BASE = API_BASE ? `${API_BASE}/api/call-tracker/admin` : '';

/** Bulk device call-log sync (Mongoose upsert on CUS Tech). */
export const ADMIN_CALLS_SYNC_URL = API_BASE ? `${API_BASE}/api/admin/calls/sync` : '';

export function assertApiConfigured(): void {
  if (!TRACKER_BASE) {
    throw {
      message:
        'API base URL is not configured. Set EXPO_PUBLIC_API_BASE_URL in your .env file (e.g. http://localhost:3000).',
    };
  }
}
