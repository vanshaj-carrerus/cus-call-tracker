import {
  ActivityIndicator,
  RefreshControl,
  SectionList,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CallListItem } from '@/components/call-list-item';
import { StatusBanner } from '@/components/status-banner';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useCallLog } from '@/hooks/use-call-log';
import { formatDuration, groupCallsByDate } from '@/lib/call-utils';

export default function HistoryScreen() {
  const { calls, stats, source, message, loading, refreshing, error, refresh } = useCallLog();
  const sections = groupCallsByDate(calls);

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedView style={styles.header}>
          <ThemedText type="subtitle">Call history</ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            {stats.totalCalls} calls · {formatDuration(stats.totalDurationSeconds)} total
          </ThemedText>
        </ThemedView>

        {loading ? (
          <ActivityIndicator size="large" style={styles.loader} />
        ) : (
          <SectionList
            sections={sections}
            keyExtractor={(item) => item.id}
            ListHeaderComponent={
              <>
                {message ? (
                  <StatusBanner message={message} variant={source === 'demo' ? 'warning' : 'info'} />
                ) : null}
                {error ? <StatusBanner message={error} variant="warning" /> : null}
              </>
            }
            renderSectionHeader={({ section }) => (
              <ThemedText type="smallBold" style={styles.sectionTitle}>
                {section.title}
              </ThemedText>
            )}
            renderItem={({ item }) => <CallListItem call={item} />}
            ItemSeparatorComponent={() => <ThemedView style={styles.separator} />}
            SectionSeparatorComponent={() => <ThemedView style={styles.sectionGap} />}
            contentContainerStyle={styles.listContent}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />}
            ListEmptyComponent={
              <ThemedText type="small" themeColor="textSecondary" style={styles.empty}>
                No call history available.
              </ThemedText>
            }
          />
        )}
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
    paddingHorizontal: Spacing.four,
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    width: '100%',
  },
  header: {
    gap: Spacing.one,
    paddingTop: Spacing.three,
    paddingBottom: Spacing.two,
    backgroundColor: 'transparent',
  },
  listContent: {
    paddingBottom: BottomTabInset + Spacing.four,
    gap: Spacing.two,
  },
  sectionTitle: {
    marginTop: Spacing.two,
    marginBottom: Spacing.one,
  },
  separator: {
    height: Spacing.two,
    backgroundColor: 'transparent',
  },
  sectionGap: {
    height: Spacing.three,
    backgroundColor: 'transparent',
  },
  loader: {
    marginTop: Spacing.six,
  },
  empty: {
    marginTop: Spacing.four,
  },
});
