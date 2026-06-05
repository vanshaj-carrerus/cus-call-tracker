import { useCallback, useEffect, useState } from 'react';

import { useAuth } from '@/context/auth-context';
import { listCalls, type ListCallsParams } from '@/services/calls.service';
import type { TrackerCall } from '@/types/tracker-call';

export function useTrackerCalls(params?: ListCallsParams) {
  const { token } = useAuth();
  const [calls, setCalls] = useState<TrackerCall[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const refresh = useCallback(async () => {
    if (!token) {
      setCalls([]);
      return;
    }

    setLoading(true);
    setError(undefined);
    try {
      const data = await listCalls(params);
      setCalls(data.data ?? []);
    } catch (err) {
      setCalls([]);
      setError(err && typeof err === 'object' && 'message' in err ? String(err.message) : 'Failed to load calls');
    } finally {
      setLoading(false);
    }
  }, [token, params?.from, params?.to]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { calls, loading, error, refresh };
}
