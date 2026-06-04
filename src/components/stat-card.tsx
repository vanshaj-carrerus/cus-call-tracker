import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import type { ThemeColor } from '@/constants/theme';

type StatCardProps = {
  label: string;
  value: string;
  accent?: ThemeColor;
};

export function StatCard({ label, value, accent = 'text' }: StatCardProps) {
  return (
    <ThemedView type="backgroundElement" style={styles.card}>
      <ThemedText type="small" themeColor="textSecondary">
        {label}
      </ThemedText>
      <ThemedText type="subtitle" themeColor={accent} style={styles.value}>
        {value}
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: 140,
    padding: Spacing.three,
    borderRadius: Spacing.three,
    gap: Spacing.one,
  },
  value: {
    fontSize: 28,
    lineHeight: 34,
  },
});
