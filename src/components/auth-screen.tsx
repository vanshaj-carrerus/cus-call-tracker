import { StatusBar } from 'expo-status-bar';
import { ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AuthAnimatedSection, AuthBackgroundDecor, AuthEnter } from '@/components/auth-animated';
import { AuthLogo } from '@/components/auth-logo';
import { AuthColors, AuthLayout } from '@/constants/auth-theme';
import { Spacing } from '@/constants/theme';

type AuthScreenProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
};

/** Full-page light layout with staggered entrance animations. */
export function AuthScreen({ title, subtitle, children, footer }: AuthScreenProps) {
  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <AuthBackgroundDecor />

      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}>
            <View style={styles.content}>
              <AuthAnimatedSection entering={AuthEnter.logo}>
                <AuthLogo />
              </AuthAnimatedSection>

              <AuthAnimatedSection entering={AuthEnter.header}>
                <View style={styles.header}>
                  <View style={styles.accentLine} />
                  <Text style={styles.title}>{title}</Text>
                  <Text style={styles.subtitle}>{subtitle}</Text>
                </View>
              </AuthAnimatedSection>

              <AuthAnimatedSection entering={AuthEnter.form}>
                <View style={styles.formCard}>{children}</View>
              </AuthAnimatedSection>

              <AuthAnimatedSection entering={AuthEnter.footer}>
                <View style={styles.footer}>{footer}</View>
              </AuthAnimatedSection>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: AuthColors.pageBackground,
    overflow: 'hidden',
  },
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.five,
  },
  content: {
    width: '100%',
    maxWidth: AuthLayout.contentMaxWidth,
    alignSelf: 'center',
  },
  header: {
    marginTop: Spacing.four,
    marginBottom: Spacing.four,
    alignItems: 'center',
  },
  accentLine: {
    width: 48,
    height: 4,
    borderRadius: 2,
    backgroundColor: AuthColors.accentLine,
    marginBottom: Spacing.three,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: AuthColors.textPrimary,
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  subtitle: {
    marginTop: Spacing.two,
    fontSize: 15,
    lineHeight: 22,
    color: AuthColors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: Spacing.two,
  },
  formCard: {
    backgroundColor: AuthColors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: AuthColors.cardBorder,
    padding: Spacing.four,
    ...Platform.select({
      ios: {
        shadowColor: AuthColors.cardShadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.06,
        shadowRadius: 16,
      },
      android: { elevation: 3 },
      web: { boxShadow: '0 4px 24px rgba(15, 23, 42, 0.06)' },
    }),
  },
  footer: {
    marginTop: Spacing.five,
    alignItems: 'center',
    paddingHorizontal: Spacing.two,
  },
});
