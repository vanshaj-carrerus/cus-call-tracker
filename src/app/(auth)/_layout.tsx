import { Stack } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { AuthColors } from '@/constants/auth-theme';

/** Auth stack — full-page white light theme only. */
export default function AuthLayout() {
  return (
    <View style={styles.root}>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: styles.screen,
          animation: 'slide_from_right',
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: AuthColors.pageBackground,
  },
  screen: {
    backgroundColor: AuthColors.pageBackground,
  },
});
