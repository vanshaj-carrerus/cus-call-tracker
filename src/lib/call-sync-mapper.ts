import type { CallRecord, CallType } from '@/types/call';
import type { SyncCallLogEntry } from '@/types/call-sync';

/** Android CallLog.Calls type constants used by the admin sync API. */
const CALL_TYPE_TO_NATIVE: Record<CallType, number> = {
  incoming: 1,
  outgoing: 2,
  missed: 3,
  rejected: 5,
  blocked: 6,
  unknown: 0,
};

export function callTypeToNative(type: CallType): number {
  return CALL_TYPE_TO_NATIVE[type] ?? 0;
}

export function toSyncLogEntry(call: CallRecord): SyncCallLogEntry {
  return {
    number: call.phoneNumber,
    type: callTypeToNative(call.type),
    date: call.timestamp,
    duration: String(call.durationSeconds),
  };
}

export function toSyncLogEntries(calls: CallRecord[]): SyncCallLogEntry[] {
  return calls.map(toSyncLogEntry);
}
