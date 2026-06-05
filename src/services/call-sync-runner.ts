import { toSyncLogEntries } from '@/lib/call-sync-mapper';
import { getStoredUser } from '@/lib/auth-storage';
import { fetchCallLogsForSync } from '@/services/call-log';
import { syncCallLogsToServer } from '@/services/call-sync-api';
import type { CallRecord } from '@/types/call';

export type CallSyncResult =
  | { synced: false; reason: 'no_user' | 'no_logs' | 'skipped' }
  | { synced: true; count: number };

/**
 * Read the signed-in user, load native call history, and POST to /api/admin/calls/sync.
 */
export async function runCallLogSync(limit = 200): Promise<CallSyncResult> {
  const user = await getStoredUser();
  if (!user?.id) {
    return { synced: false, reason: 'no_user' };
  }

  const calls = await fetchCallLogsForSync(limit);
  if (calls.length === 0) {
    return { synced: false, reason: 'no_logs' };
  }

  const result = await syncCallLogsToServer(user.id, toSyncLogEntries(calls));
  return { synced: true, count: result.count ?? calls.length };
}

/** Sync when the UI already has loaded device calls (e.g. pull-to-refresh). */
export async function syncLoadedCalls(calls: CallRecord[]): Promise<CallSyncResult> {
  const user = await getStoredUser();
  if (!user?.id) {
    return { synced: false, reason: 'no_user' };
  }

  if (calls.length === 0) {
    return { synced: false, reason: 'no_logs' };
  }

  const result = await syncCallLogsToServer(user.id, toSyncLogEntries(calls));
  return { synced: true, count: result.count ?? calls.length };
}
