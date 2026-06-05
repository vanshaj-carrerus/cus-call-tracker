import { ADMIN_CALLS_SYNC_URL, assertApiConfigured } from '@/constants/api';
import type { SyncCallLogEntry, SyncCallsResponse } from '@/types/call-sync';

/**
 * Upload device call logs to CUS Tech admin sync endpoint.
 * Backend dedupes via callId = userId_number_date.
 */
export async function syncCallLogsToServer(
  userId: string,
  logs: SyncCallLogEntry[],
): Promise<SyncCallsResponse> {
  assertApiConfigured();

  if (!ADMIN_CALLS_SYNC_URL) {
    throw new Error('Sync URL is not configured.');
  }

  if (logs.length === 0) {
    return { success: true, count: 0 };
  }

  const response = await fetch(ADMIN_CALLS_SYNC_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, logs }),
  });

  const result = (await response.json().catch(() => ({}))) as SyncCallsResponse;

  if (!response.ok || !result.success) {
    throw new Error(result.message ?? 'Sync failed');
  }

  return result;
}
