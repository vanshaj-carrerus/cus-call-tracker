import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { AuthAnimatedSection, AuthEnter } from '@/components/auth-animated';
import { AuthColors, AuthLayout } from '@/constants/auth-theme';
import { Spacing } from '@/constants/theme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type AuthTextInputProps = TextInputProps & {
  label: string;
  /** Stagger index for entrance animation */
  index?: number;
};

/** Labeled input with focus border animation. */
export function AuthTextInput({
  label,
  index = 0,
  style,
  onFocus,
  onBlur,
  ...props
}: AuthTextInputProps) {
  const focused = useSharedValue(0);

  const inputWrapperStyle = useAnimatedStyle(() => ({
    borderColor: interpolateColor(
      focused.value,
      [0, 1],
      [AuthColors.inputBorder, AuthColors.inputBorderFocus],
    ),
  }));

  return (
    <AuthAnimatedSection entering={AuthEnter.field(index)}>
      <View style={styles.field}>
        <Text style={styles.label}>{label}</Text>
        <Animated.View style={[styles.inputWrapper, inputWrapperStyle]}>
          <TextInput
            placeholderTextColor={AuthColors.inputPlaceholder}
            style={[styles.input, style]}
            onFocus={(e) => {
              focused.value = withSpring(1, { damping: 14 });
              onFocus?.(e);
            }}
            onBlur={(e) => {
              focused.value = withSpring(0, { damping: 14 });
              onBlur?.(e);
            }}
            {...props}
          />
        </Animated.View>
      </View>
    </AuthAnimatedSection>
  );
}

type AuthFormProps = {
  children: React.ReactNode;
};

export function AuthForm({ children }: AuthFormProps) {
  return <View style={styles.form}>{children}</View>;
}

type AuthSubmitButtonProps = {
  label: string;
  loading: boolean;
  onPress: () => void;
};

/** Primary CTA with press scale animation. */
export function AuthSubmitButton({ label, loading, onPress }: AuthSubmitButtonProps) {
  const scale = useSharedValue(1);

  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AuthAnimatedSection entering={AuthEnter.button}>
      <AnimatedPressable
        onPress={onPress}
        disabled={loading}
        onPressIn={() => {
          if (!loading) scale.value = withSpring(0.97, { damping: 15, stiffness: 300 });
        }}
        onPressOut={() => {
          scale.value = withSpring(1, { damping: 15, stiffness: 300 });
        }}
        style={[styles.button, buttonStyle, loading && styles.buttonDisabled]}>
        {loading ? (
          <ActivityIndicator color={AuthColors.primaryText} />
        ) : (
          <Text style={styles.buttonText}>{label}</Text>
        )}
      </AnimatedPressable>
    </AuthAnimatedSection>
  );
}

type AuthErrorMessageProps = {
  message: string;
};

export function AuthErrorMessage({ message }: AuthErrorMessageProps) {
  return (
    <Animated.View entering={AuthEnter.error} style={styles.errorBox}>
      <Text style={styles.errorText}>{message}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: Spacing.three,
  },
  field: {
    gap: Spacing.one,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: AuthColors.textPrimary,
    letterSpacing: 0.2,
  },
  inputWrapper: {
    borderWidth: 1.5,
    borderRadius: AuthLayout.inputRadius,
    backgroundColor: AuthColors.inputBackground,
    overflow: 'hidden',
  },
  input: {
    paddingHorizontal: Spacing.three,
    paddingVertical: 14,
    fontSize: 16,
    color: AuthColors.textPrimary,
  },
  button: {
    backgroundColor: AuthColors.primary,
    borderRadius: AuthLayout.buttonRadius,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.two,
    minHeight: 50,
  },
  buttonDisabled: {
    opacity: 0.65,
  },
  buttonText: {
    color: AuthColors.primaryText,
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  errorBox: {
    backgroundColor: 'rgba(220, 38, 38, 0.08)',
    borderRadius: 8,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderWidth: 1,
    borderColor: 'rgba(220, 38, 38, 0.2)',
  },
  errorText: {
    fontSize: 13,
    color: AuthColors.error,
    fontWeight: '500',
  },
});
