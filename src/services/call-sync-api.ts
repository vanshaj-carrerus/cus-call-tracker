import type { CallRecord } from '@/types/call';

const API_BASE = process.env.EXPO_PUBLIC_API_URL ?? 'https://your-custech-api.com';

type SyncResult = {
  inserted: number;
  updated: number;
  total: number;
};

export async function syncCallsToServer(
  token: string,
  calls: CallRecord[],
  deviceId?: string,
): Promise<SyncResult> {
  const response = await fetch(`${API_BASE}/api/call-tracker/sync`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      deviceId,
      calls,
    }),
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.message ?? 'Sync failed');
  }

  return json.data;
}
