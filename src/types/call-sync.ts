/** Payload entry for POST /api/admin/calls/sync (matches CUS Tech backend). */
export type SyncCallLogEntry = {
  number: string;
  type: number;
  date: number;
  duration: string;
};

export type SyncCallsPayload = {
  userId: string;
  logs: SyncCallLogEntry[];
};

export type SyncCallsResponse = {
  success: boolean;
  count?: number;
  message?: string;
};
