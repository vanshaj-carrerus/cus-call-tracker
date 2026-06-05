import { Platform, PermissionsAndroid } from 'react-native';

import { mapNativeCallType } from '@/lib/call-utils';
import type { CallRecord } from '@/types/call';
import CusCallHandler from '../../modules/cus-call-handler/src/CusCallHandlerModule';
import type { NativeCallLogEntry } from '../../modules/cus-call-handler/src/CusCallHandler.types';

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

function mapNativeRecord(entry: NativeCallLogEntry): CallRecord {
  return {
    id: `${entry.dateTime}-${entry.phoneNumber}`,
    phoneNumber: entry.phoneNumber,
    contactName: entry.name || undefined,
    type: mapNativeCallType(entry.type),
    durationSeconds: Math.max(0, Math.floor(entry.duration)),
    timestamp: entry.dateTime,
    simLabel: entry.phoneAccountId || undefined,
  };
}

async function loadAndroidCallLog(limit = 200): Promise<CallRecord[]> {
  const raw = await CusCallHandler.load(limit);
  return raw.map(mapNativeRecord);
}

/**
 * Load real device call logs for server sync (no demo fallback).
 * Returns an empty array when permissions are missing or the platform is unsupported.
 */
export async function fetchCallLogsForSync(limit = 200): Promise<CallRecord[]> {
  if (Platform.OS !== 'android') return [];

  try {
    const granted = await requestAndroidPermissions();
    if (!granted) return [];

    return await loadAndroidCallLog(limit);
  } catch {
    return [];
  }
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
          'Call log native module unavailable. Rebuild the app with EAS or `npx expo run:android`.',
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
