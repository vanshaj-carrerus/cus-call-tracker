import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import {
  getDashboardDayOptions,
  isSameCalendarDay,
  type DashboardDayOption,
} from '@/lib/call-utils';

type DayPickerProps = {
  selectedDay: Date;
  onSelectDay: (day: Date) => void;
};

export function DayPicker({ selectedDay, onSelectDay }: DayPickerProps) {
  const theme = useTheme();
  const router = useRouter();
  const options = getDashboardDayOptions();

  const handlePress = (option: DashboardDayOption) => {
    if (option.type === 'more') {
      router.push('/history');
      return;
    }
    onSelectDay(option.date);
  };

  const isSelected = (option: DashboardDayOption) =>
    option.type === 'day' && isSameCalendarDay(option.date, selectedDay);

  return (
    <ThemedView style={styles.wrapper}>
      <ThemedText type="small" themeColor="textSecondary">
        Tap to switch day
      </ThemedText>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}>
        {options.map((option) => {
          const selected = isSelected(option);
          return (
            <Pressable
              key={option.id}
              onPress={() => handlePress(option)}
              style={[
                styles.chip,
                {
                  backgroundColor: selected ? theme.primary : theme.backgroundElement,
                },
              ]}>
              <ThemedText
                type="smallBold"
                style={{ color: selected ? theme.background : theme.text }}>
                {option.label}
              </ThemedText>
            </Pressable>
          );
        })}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: Spacing.one,
    backgroundColor: 'transparent',
  },
  row: {
    flexDirection: 'row',
    gap: Spacing.two,
    paddingVertical: Spacing.one,
  },
  chip: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.three,
  },
});
