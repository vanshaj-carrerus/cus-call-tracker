import { Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

import { CallTypeBadge } from '@/components/call-type-badge';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { formatCallTimestamp, formatDuration, formatPhoneNumber } from '@/lib/call-utils';
import type { CallRecord } from '@/types/call';

type CallListItemProps = {
  call: CallRecord;
};

export function CallListItem({ call }: CallListItemProps) {
  const router = useRouter();
  const displayName = call.contactName || formatPhoneNumber(call.phoneNumber);

  return (
    <Pressable
      onPress={() => router.push({ pathname: '/call/[id]', params: { id: call.id } })}
      style={({ pressed }) => [pressed && styles.pressed]}>
      <ThemedView type="backgroundElement" style={styles.row}>
        <ThemedView style={styles.main}>
          <ThemedText type="smallBold">{displayName}</ThemedText>
          {call.contactName ? (
            <ThemedText type="small" themeColor="textSecondary">
              {formatPhoneNumber(call.phoneNumber)}
            </ThemedText>
          ) : null}
          <ThemedText type="small" themeColor="textSecondary">
            {formatCallTimestamp(call.timestamp)}
          </ThemedText>
        </ThemedView>
        <ThemedView style={styles.meta}>
          <CallTypeBadge type={call.type} />
          <ThemedText type="smallBold" themeColor="primary">
            {formatDuration(call.durationSeconds)}
          </ThemedText>
        </ThemedView>
      </ThemedView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.three,
    borderRadius: Spacing.three,
    gap: Spacing.two,
  },
  main: {
    flex: 1,
    gap: Spacing.half,
    backgroundColor: 'transparent',
  },
  meta: {
    alignItems: 'flex-end',
    gap: Spacing.two,
    backgroundColor: 'transparent',
  },
  pressed: {
    opacity: 0.85,
  },
});
