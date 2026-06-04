import { Stack, useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CallTypeBadge } from '@/components/call-type-badge';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useCallLog } from '@/hooks/use-call-log';
import {
  formatCallTimestamp,
  formatDuration,
  formatPhoneNumber,
  getCallTypeLabel,
} from '@/lib/call-utils';

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <ThemedView type="backgroundElement" style={styles.detailRow}>
      <ThemedText type="small" themeColor="textSecondary">
        {label}
      </ThemedText>
      <ThemedText type="smallBold">{value}</ThemedText>
    </ThemedView>
  );
}

export default function CallDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { callById, loading } = useCallLog();
  const call = id ? callById.get(id) : undefined;

  if (loading) {
    return <ActivityIndicator size="large" style={styles.loader} />;
  }

  if (!call) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText type="default">Call not found.</ThemedText>
      </ThemedView>
    );
  }

  const displayName = call.contactName || formatPhoneNumber(call.phoneNumber);

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ title: displayName }} />
      <SafeAreaView style={styles.safeArea}>
        <ThemedView style={styles.hero}>
          <ThemedText type="subtitle">{displayName}</ThemedText>
          <CallTypeBadge type={call.type} />
        </ThemedView>

        <ThemedView style={styles.details}>
          <DetailRow label="Phone number" value={formatPhoneNumber(call.phoneNumber)} />
          <DetailRow label="Call type" value={getCallTypeLabel(call.type)} />
          <DetailRow label="Duration" value={formatDuration(call.durationSeconds)} />
          <DetailRow label="Date & time" value={formatCallTimestamp(call.timestamp)} />
          {call.contactName ? <DetailRow label="Contact" value={call.contactName} /> : null}
          {call.simLabel ? <DetailRow label="SIM / line" value={call.simLabel} /> : null}
          <DetailRow label="Call ID" value={call.id} />
        </ThemedView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.four,
  },
  safeArea: {
    flex: 1,
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    width: '100%',
    gap: Spacing.four,
  },
  hero: {
    gap: Spacing.two,
    alignItems: 'flex-start',
    backgroundColor: 'transparent',
  },
  details: {
    gap: Spacing.two,
    backgroundColor: 'transparent',
  },
  detailRow: {
    padding: Spacing.three,
    borderRadius: Spacing.three,
    gap: Spacing.one,
  },
  loader: {
    marginTop: Spacing.six,
  },
});
