export type NativeCallLogEntry = {
  phoneNumber: string;
  name?: string | null;
  type: number;
  duration: number;
  dateTime: number;
  phoneAccountId?: string | null;
};
