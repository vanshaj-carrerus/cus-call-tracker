import { ComponentProps, ReactNode, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  FadeIn,
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { AuthColors } from '@/constants/auth-theme';

type EnteringAnimation = NonNullable<ComponentProps<typeof Animated.View>['entering']>;

/** Staggered entrance presets for auth screen sections. */
export const AuthEnter = {
  logo: FadeInDown.duration(650).springify().damping(16).stiffness(120),
  header: FadeInDown.delay(100).duration(550).springify().damping(18),
  form: FadeInDown.delay(220).duration(550).springify().damping(18),
  footer: FadeIn.delay(380).duration(450),
  field: (index: number) =>
    FadeInDown.delay(280 + index * 70)
      .duration(420)
      .springify()
      .damping(20),
  error: FadeIn.duration(250),
  button: FadeInDown.delay(100).duration(400).springify(),
} satisfies Record<string, EnteringAnimation | ((index: number) => EnteringAnimation)>;

type AuthAnimatedSectionProps = {
  children: ReactNode;
  entering: EnteringAnimation;
};

export function AuthAnimatedSection({ children, entering }: AuthAnimatedSectionProps) {
  return <Animated.View entering={entering}>{children}</Animated.View>;
}

/** Soft floating shapes behind the auth content. */
export function AuthBackgroundDecor() {
  const pulse = useSharedValue(1);

  useEffect(() => {
    pulse.value = withRepeat(
      withSequence(
        withTiming(1.06, { duration: 3200, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 3200, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      false,
    );
  }, [pulse]);

  const blobStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Animated.View entering={FadeIn.duration(900)} style={[styles.blobTop, blobStyle]} />
      <Animated.View
        entering={FadeIn.delay(200).duration(900)}
        style={[styles.blobBottom, blobStyle]}
      />
      <Animated.View entering={FadeIn.delay(400).duration(700)} style={styles.blobAccent} />
    </View>
  );
}

const styles = StyleSheet.create({
  blobTop: {
    position: 'absolute',
    top: -80,
    right: -60,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: AuthColors.accentBlob,
    opacity: 0.55,
  },
  blobBottom: {
    position: 'absolute',
    bottom: 40,
    left: -70,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: AuthColors.accentBlobSecondary,
    opacity: 0.45,
  },
  blobAccent: {
    position: 'absolute',
    top: '38%',
    right: 24,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: AuthColors.primary,
    opacity: 0.2,
  },
});
