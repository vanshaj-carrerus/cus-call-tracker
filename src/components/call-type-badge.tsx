import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { getCallTypeLabel } from '@/lib/call-utils';
import type { CallType } from '@/types/call';

type CallTypeBadgeProps = {
  type: CallType;
};

function getBadgeColor(type: CallType, colors: ReturnType<typeof useTheme>) {
  switch (type) {
    case 'incoming':
      return colors.success;
    case 'outgoing':
      return colors.primary;
    case 'missed':
      return colors.danger;
    case 'rejected':
    case 'blocked':
      return colors.warning;
    default:
      return colors.secondary;
  }
}

export function CallTypeBadge({ type }: CallTypeBadgeProps) {
  const colors = useTheme();
  const badgeColor = getBadgeColor(type, colors);

  return (
    <View style={[styles.badge, { backgroundColor: badgeColor }]}>
      <ThemedText type="small" style={styles.label}>
        {getCallTypeLabel(type)}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.half,
    borderRadius: Spacing.two,
  },
  label: {
    color: '#ffffff',
    fontSize: 12,
  },
});
