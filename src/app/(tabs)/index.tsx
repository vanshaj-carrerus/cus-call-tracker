import { useMemo, useState } from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CallListItem } from '@/components/call-list-item';
import { DayPicker } from '@/components/day-picker';
import { StatCard } from '@/components/stat-card';
import { StatusBanner } from '@/components/status-banner';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useCallLog } from '@/hooks/use-call-log';
import {
  computeCallStats,
  filterCallsByDay,
  formatDuration,
  getDaySectionTitle,
  startOfDayMs,
} from '@/lib/call-utils';

function todayAtMidnight(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

export default function DashboardScreen() {
  const { calls, source, message, loading, refreshing, error, refresh } = useCallLog(50);
  const [selectedDay, setSelectedDay] = useState(todayAtMidnight);

  const dayCalls = useMemo(
    () => filterCallsByDay(calls, selectedDay).sort((a, b) => b.timestamp - a.timestamp),
    [calls, selectedDay],
  );
  const stats = useMemo(() => computeCallStats(dayCalls), [dayCalls]);
  const sectionTitle = useMemo(() => getDaySectionTitle(selectedDay), [selectedDay]);

  const handleSelectDay = (day: Date) => {
    const normalized = new Date(day);
    normalized.setHours(0, 0, 0, 0);
    if (startOfDayMs(normalized) !== startOfDayMs(selectedDay)) {
      setSelectedDay(normalized);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />}>
          <ThemedView style={styles.header}>
            <ThemedText type="subtitle">Call Tracker</ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              Daily call stats and history for the selected day
            </ThemedText>
          </ThemedView>

          <DayPicker selectedDay={selectedDay} onSelectDay={handleSelectDay} />

          {message ? <StatusBanner message={message} variant={source === 'demo' ? 'warning' : 'info'} /> : null}
          {error ? <StatusBanner message={error} variant="warning" /> : null}

          {loading ? (
            <ActivityIndicator size="large" style={styles.loader} />
          ) : (
            <>
              <ThemedView style={styles.statsRow}>
                <StatCard label="Total calls" value={String(stats.totalCalls)} accent="primary" />
                <StatCard
                  label="Talk time"
                  value={formatDuration(stats.totalDurationSeconds)}
                  accent="secondary"
                />
              </ThemedView>

              <ThemedView style={styles.statsRow}>
                <StatCard label="Incoming" value={String(stats.incoming)} accent="success" />
                <StatCard label="Outgoing" value={String(stats.outgoing)} accent="primary" />
                <StatCard label="Missed" value={String(stats.missed)} accent="danger" />
              </ThemedView>

              <ThemedView style={styles.section}>
                <ThemedText type="smallBold">{sectionTitle}</ThemedText>
                <ThemedView style={styles.list}>
                  {dayCalls.length === 0 ? (
                    <ThemedText type="small" themeColor="textSecondary">
                      No calls on this day.
                    </ThemedText>
                  ) : (
                    dayCalls.map((call) => <CallListItem key={call.id} call={call} />)
                  )}
                </ThemedView>
              </ThemedView>
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.four,
    paddingBottom: BottomTabInset + Spacing.four,
    gap: Spacing.three,
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    width: '100%',
  },
  header: {
    gap: Spacing.one,
    paddingTop: Spacing.three,
    backgroundColor: 'transparent',
  },
  statsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
    backgroundColor: 'transparent',
  },
  section: {
    gap: Spacing.two,
    backgroundColor: 'transparent',
  },
  list: {
    gap: Spacing.two,
    backgroundColor: 'transparent',
  },
  loader: {
    marginTop: Spacing.six,
  },
});
