export type CallType = 'incoming' | 'outgoing' | 'missed' | 'rejected' | 'blocked' | 'unknown';

export type CallRecord = {
  id: string;
  phoneNumber: string;
  contactName?: string;
  type: CallType;
  durationSeconds: number;
  timestamp: number;
  simLabel?: string;
};

export type CallStats = {
  totalCalls: number;
  totalDurationSeconds: number;
  incoming: number;
  outgoing: number;
  missed: number;
};
