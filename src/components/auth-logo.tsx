import { Image } from 'expo-image';
import { Platform, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, ZoomIn } from 'react-native-reanimated';

import { AuthColors } from '@/constants/auth-theme';
import { Spacing } from '@/constants/theme';

const LOGO_SOURCE = require('@/assets/images/logo.webp');

/** CUSTECH logo with a subtle scale-in animation. */
export function AuthLogo() {
  return (
    <View style={styles.container}>
      <Animated.View entering={ZoomIn.duration(500).springify()} style={styles.logoFrame}>
        <Animated.View entering={FadeIn.delay(200).duration(400)}>
          <Image
            source={LOGO_SOURCE}
            style={styles.logo}
            contentFit="contain"
            accessibilityLabel="CUSTECH logo"
          />
        </Animated.View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  logoFrame: {
    backgroundColor: AuthColors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: AuthColors.cardBorder,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: AuthColors.primary,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
      },
      android: { elevation: 4 },
    }),
  },
  logo: {
    width: 260,
    height: 64,
  },
});
