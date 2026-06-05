import * as BackgroundTask from 'expo-background-task';
import * as TaskManager from 'expo-task-manager';
import { Platform } from 'react-native';

import { runCallLogSync } from '@/services/call-sync-runner';

export const CALL_SYNC_TASK = 'BACKGROUND_CALL_SYNC';

const SYNC_INTERVAL_MINUTES = 15;

TaskManager.defineTask(CALL_SYNC_TASK, async () => {
  try {
    const result = await runCallLogSync(200);
    if (result.synced) {
      console.log(`[call-sync] Background synced ${result.count} logs`);
    }
    return BackgroundTask.BackgroundTaskResult.Success;
  } catch (error) {
    console.error('[call-sync] Background task failed:', error);
    return BackgroundTask.BackgroundTaskResult.Failed;
  }
});

export async function registerCallSyncBackgroundTask(): Promise<void> {
  if (Platform.OS === 'web') return;

  const status = await BackgroundTask.getStatusAsync();
  if (status === BackgroundTask.BackgroundTaskStatus.Restricted) {
    return;
  }

  const registered = await TaskManager.isTaskRegisteredAsync(CALL_SYNC_TASK);
  if (registered) return;

  await BackgroundTask.registerTaskAsync(CALL_SYNC_TASK, {
    minimumInterval: SYNC_INTERVAL_MINUTES,
  });
}

export async function unregisterCallSyncBackgroundTask(): Promise<void> {
  if (Platform.OS === 'web') return;

  const registered = await TaskManager.isTaskRegisteredAsync(CALL_SYNC_TASK);
  if (!registered) return;

  await BackgroundTask.unregisterTaskAsync(CALL_SYNC_TASK);
}
