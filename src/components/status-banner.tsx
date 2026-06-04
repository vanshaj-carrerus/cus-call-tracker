import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';

type StatusBannerProps = {
  message: string;
  variant?: 'info' | 'warning';
};

export function StatusBanner({ message, variant = 'info' }: StatusBannerProps) {
  return (
    <ThemedView
      type="backgroundElement"
      style={[styles.banner, variant === 'warning' && styles.warning]}>
      <ThemedText type="small" themeColor="textSecondary">
        {message}
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  banner: {
    padding: Spacing.three,
    borderRadius: Spacing.three,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  warning: {
    borderColor: '#C47A0044',
  },
});
