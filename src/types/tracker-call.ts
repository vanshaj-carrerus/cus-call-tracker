export type TrackerCallType = 'incoming' | 'outgoing' | 'missed';

export type TrackerCall = {
  id: string;
  user?: string;
  call_date: string;
  call_duration: number;
  call_type: TrackerCallType;
  call_notes?: string;
  call_feedback?: string;
};

export type CreateTrackerCallPayload = {
  call_date?: string;
  call_duration: number;
  call_type: TrackerCallType;
  call_notes?: string;
  call_feedback?: string;
  user?: string;
};

export type UpdateTrackerCallPayload = Partial<
  Pick<TrackerCall, 'call_date' | 'call_duration' | 'call_type' | 'call_notes' | 'call_feedback'>
>;

export type TrackerCallsListResponse = {
  success: boolean;
  data: TrackerCall[];
};

export type TrackerCallResponse = {
  success: boolean;
  data: TrackerCall;
};
