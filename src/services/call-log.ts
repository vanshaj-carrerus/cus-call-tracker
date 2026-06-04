import { Platform, PermissionsAndroid } from 'react-native';

import { mapNativeCallType } from '@/lib/call-utils';
import type { CallRecord } from '@/types/call';

const DEMO_CALLS: CallRecord[] = [
  {
    id: 'demo-1',
    phoneNumber: '+15551234001',
    contactName: 'Acme Support',
    type: 'incoming',
    durationSeconds: 312,
    timestamp: Date.now() - 1000 * 60 * 25,
    simLabel: 'Work SIM',
  },
  {
    id: 'demo-2',
    phoneNumber: '+15559876543',
    contactName: 'Warehouse',
    type: 'outgoing',
    durationSeconds: 84,
    timestamp: Date.now() - 1000 * 60 * 60 * 2,
    simLabel: 'Work SIM',
  },
  {
    id: 'demo-3',
    phoneNumber: '+15550001122',
    type: 'missed',
    durationSeconds: 0,
    timestamp: Date.now() - 1000 * 60 * 60 * 5,
    simLabel: 'Work SIM',
  },
  {
    id: 'demo-4',
    phoneNumber: '+15553334455',
    contactName: 'IT Helpdesk',
    type: 'incoming',
    durationSeconds: 540,
    timestamp: Date.now() - 1000 * 60 * 60 * 26,
    simLabel: 'Work SIM',
  },
];

export type CallLogSource = 'device' | 'demo';

export type LoadCallLogResult = {
  calls: CallRecord[];
  source: CallLogSource;
  message?: string;
};

async function requestAndroidPermissions(): Promise<boolean> {
  if (Platform.OS !== 'android') return false;

  const permissions = [
    PermissionsAndroid.PERMISSIONS.READ_CALL_LOG,
    PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE,
  ];

  const results = await PermissionsAndroid.requestMultiple(permissions);
  return permissions.every(
    (permission) => results[permission] === PermissionsAndroid.RESULTS.GRANTED,
  );
}

function mapNativeRecord(entry: {
  phoneNumber: string;
  name?: string;
  type: number;
  duration: number;
  dateTime: number;
  phoneAccountId?: string;
  rawType?: string;
}): CallRecord {
  return {
    id: `${entry.dateTime}-${entry.phoneNumber}`,
    phoneNumber: entry.phoneNumber,
    contactName: entry.name || undefined,
    type: mapNativeCallType(entry.type),
    durationSeconds: Math.max(0, Math.floor(entry.duration)),
    timestamp: entry.dateTime,
    simLabel: entry.phoneAccountId || entry.rawType || undefined,
  };
}

async function loadAndroidCallLog(limit = 200): Promise<CallRecord[]> {
  const CallLogs = require('react-native-call-log').default;
  const raw = await CallLogs.load(limit);
  return raw.map(mapNativeRecord);
}

export async function loadCallHistory(limit = 200): Promise<LoadCallLogResult> {
  if (Platform.OS === 'android') {
    try {
      const granted = await requestAndroidPermissions();
      if (!granted) {
        return {
          calls: DEMO_CALLS,
          source: 'demo',
          message: 'Call log permission denied. Grant access to read company phone history.',
        };
      }

      const calls = await loadAndroidCallLog(limit);
      return { calls, source: 'device' };
    } catch {
      return {
        calls: DEMO_CALLS,
        source: 'demo',
        message:
          'Native call log module unavailable. Build a development APK with `npx expo run:android`.',
      };
    }
  }

  return {
    calls: DEMO_CALLS,
    source: 'demo',
    message:
      Platform.OS === 'ios'
        ? 'iOS does not allow apps to read system call history. Use Android company phones.'
        : 'Call history is available on Android devices. Showing sample data here.',
  };
}
