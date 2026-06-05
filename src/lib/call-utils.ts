import type { CallRecord, CallStats, CallType } from '@/types/call';

const CALL_TYPE_MAP: Record<number, CallType> = {
  1: 'incoming',
  2: 'outgoing',
  3: 'missed',
  5: 'rejected',
  6: 'blocked',
};

export function mapNativeCallType(type: number): CallType {
  return CALL_TYPE_MAP[type] ?? 'unknown';
}

export function formatDuration(totalSeconds: number): string {
  if (totalSeconds <= 0) return '0s';
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  }
  return `${seconds}s`;
}

export function formatPhoneNumber(value: string): string {
  const digits = value.replace(/\D/g, '');
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  return value || 'Unknown';
}

export function formatCallTimestamp(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();
  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  const time = date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  if (isToday) return `Today, ${time}`;

  return date.toLocaleString([], {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function getCallTypeLabel(type: CallType): string {
  switch (type) {
    case 'incoming':
      return 'Incoming';
    case 'outgoing':
      return 'Outgoing';
    case 'missed':
      return 'Missed';
    case 'rejected':
      return 'Rejected';
    case 'blocked':
      return 'Blocked';
    default:
      return 'Unknown';
  }
}

export function startOfDayMs(date: Date): number {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

export function isSameCalendarDay(a: Date, b: Date): boolean {
  return startOfDayMs(a) === startOfDayMs(b);
}

export function isCallOnDay(call: CallRecord, day: Date): boolean {
  const dayStart = startOfDayMs(day);
  const dayEnd = new Date(day);
  dayEnd.setHours(23, 59, 59, 999);
  return call.timestamp >= dayStart && call.timestamp <= dayEnd.getTime();
}

export function filterCallsByDay(calls: CallRecord[], day: Date): CallRecord[] {
  return calls.filter((call) => isCallOnDay(call, day));
}

export function formatDashboardDate(date: Date): string {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

export type DashboardDayOption =
  | { type: 'day'; id: string; label: string; date: Date }
  | { type: 'more'; id: 'more'; label: 'More' };

export function getDashboardDayOptions(now = new Date()): DashboardDayOption[] {
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);

  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const dayBeforeYesterday = new Date(today);
  dayBeforeYesterday.setDate(today.getDate() - 2);

  return [
    { type: 'day', id: 'today', label: 'Today', date: today },
    { type: 'day', id: 'yesterday', label: 'Yesterday', date: yesterday },
    {
      type: 'day',
      id: 'day-before',
      label: formatDashboardDate(dayBeforeYesterday),
      date: dayBeforeYesterday,
    },
    { type: 'more', id: 'more', label: 'More' },
  ];
}

export function getDaySectionTitle(day: Date, now = new Date()): string {
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);
  if (isSameCalendarDay(day, today)) return "Today's calls";
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  if (isSameCalendarDay(day, yesterday)) return "Yesterday's calls";
  return `Calls on ${formatDashboardDate(day)}`;
}

export function computeCallStats(calls: CallRecord[]): CallStats {
  return calls.reduce<CallStats>(
    (stats, call) => {
      stats.totalCalls += 1;
      stats.totalDurationSeconds += call.durationSeconds;
      if (call.type === 'incoming') stats.incoming += 1;
      if (call.type === 'outgoing') stats.outgoing += 1;
      if (call.type === 'missed') stats.missed += 1;
      return stats;
    },
    {
      totalCalls: 0,
      totalDurationSeconds: 0,
      incoming: 0,
      outgoing: 0,
      missed: 0,
    },
  );
}

export function groupCallsByDate(calls: CallRecord[]): { title: string; data: CallRecord[] }[] {
  const groups = new Map<string, CallRecord[]>();

  for (const call of calls) {
    const date = new Date(call.timestamp);
    const key = date.toLocaleDateString([], {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
    const existing = groups.get(key) ?? [];
    existing.push(call);
    groups.set(key, existing);
  }

  return Array.from(groups.entries()).map(([title, data]) => ({ title, data }));
}
