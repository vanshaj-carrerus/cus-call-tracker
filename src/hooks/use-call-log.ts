import { useCallback, useEffect, useMemo, useState } from 'react';

import { useAuth } from '@/context/auth-context';
import { computeCallStats } from '@/lib/call-utils';
import { loadCallHistory, type CallLogSource } from '@/services/call-log';
import { syncLoadedCalls } from '@/services/call-sync-runner';
import type { CallRecord, CallStats } from '@/types/call';

export function useCallLog(limit = 200) {
  const { token, user } = useAuth();
  const [calls, setCalls] = useState<CallRecord[]>([]);
  const [stats, setStats] = useState<CallStats>({
    totalCalls: 0,
    totalDurationSeconds: 0,
    incoming: 0,
    outgoing: 0,
    missed: 0,
  });
  const [source, setSource] = useState<CallLogSource>('demo');
  const [message, setMessage] = useState<string | undefined>();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const refresh = useCallback(async () => {
    setRefreshing(true);
    setError(undefined);
    try {
      const result = await loadCallHistory(limit);
      setCalls(result.calls);
      setStats(computeCallStats(result.calls));
      setSource(result.source);
      setMessage(result.message);

      if (token && user?.id && result.source === 'device' && result.calls.length > 0) {
        syncLoadedCalls(result.calls).catch(() => {});
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load call history');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [limit, token, user?.id]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const callById = useMemo(() => {
    const map = new Map<string, CallRecord>();
    for (const call of calls) {
      map.set(call.id, call);
    }
    return map;
  }, [calls]);

  return {
    calls,
    stats,
    source,
    message,
    loading,
    refreshing,
    error,
    refresh,
    callById,
  };
}
