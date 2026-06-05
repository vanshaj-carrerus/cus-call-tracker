import { trackerFetch } from '@/services/tracker-api';
import type {
  CreateTrackerCallPayload,
  TrackerCallResponse,
  TrackerCallsListResponse,
  UpdateTrackerCallPayload,
} from '@/types/tracker-call';

export type ListCallsParams = {
  from?: string;
  to?: string;
};

function buildCallsQuery(params?: ListCallsParams): string {
  if (!params?.from && !params?.to) return '/calls';

  const search = new URLSearchParams();
  if (params.from) search.set('from', params.from);
  if (params.to) search.set('to', params.to);
  return `/calls?${search.toString()}`;
}

/** GET logged-in user's calls (optional date range). */
export async function listCalls(params?: ListCallsParams): Promise<TrackerCallsListResponse> {
  return trackerFetch<TrackerCallsListResponse>(buildCallsQuery(params));
}

/** POST a new call record. */
export async function createCall(payload: CreateTrackerCallPayload): Promise<TrackerCallResponse> {
  return trackerFetch<TrackerCallResponse>('/calls', {
    method: 'POST',
    body: JSON.stringify({
      call_date: payload.call_date ?? new Date().toISOString(),
      call_duration: payload.call_duration,
      call_type: payload.call_type,
      call_notes: payload.call_notes,
      call_feedback: payload.call_feedback,
      user: payload.user,
    }),
  });
}

/** PATCH an existing call. */
export async function updateCall(
  callId: string,
  payload: UpdateTrackerCallPayload,
): Promise<TrackerCallResponse> {
  return trackerFetch<TrackerCallResponse>(`/calls/${callId}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

/** DELETE a call. */
export async function deleteCall(callId: string): Promise<{ success: boolean }> {
  return trackerFetch<{ success: boolean }>(`/calls/${callId}`, { method: 'DELETE' });
}
