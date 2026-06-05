import { useEffect, useRef } from 'react';
import { AppState, Platform } from 'react-native';

import { useAuth } from '@/context/auth-context';
import { runCallLogSync } from '@/services/call-sync-runner';
import {
  registerCallSyncBackgroundTask,
  unregisterCallSyncBackgroundTask,
} from '@/tasks/call-sync-background';

/**
 * Registers periodic background sync when signed in, and runs a foreground sync
 * when the app becomes active.
 */
export function useCallSync() {
  const { token, user, isLoading } = useAuth();
  const lastForegroundSync = useRef(0);

  useEffect(() => {
    if (isLoading || Platform.OS === 'web') return;

    if (!token || !user?.id) {
      unregisterCallSyncBackgroundTask().catch(() => {});
      return;
    }

    registerCallSyncBackgroundTask().catch((err) => {
      console.warn('[call-sync] Failed to register background task:', err);
    });

    return () => {
      unregisterCallSyncBackgroundTask().catch(() => {});
    };
  }, [token, user?.id, isLoading]);

  useEffect(() => {
    if (isLoading || !token || !user?.id || Platform.OS === 'web') return;

    const syncIfDue = () => {
      const now = Date.now();
      if (now - lastForegroundSync.current < 60_000) return;
      lastForegroundSync.current = now;

      runCallLogSync().catch((err) => {
        console.warn('[call-sync] Foreground sync failed:', err);
      });
    };

    syncIfDue();

    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        syncIfDue();
      }
    });

    return () => subscription.remove();
  }, [token, user?.id, isLoading]);
}
