import { router } from 'expo-router';
import { useState } from 'react';
import { Alert } from 'react-native';

import { AuthFooterLink } from '@/components/auth-footer-link';
import { AuthErrorMessage, AuthForm, AuthSubmitButton, AuthTextInput } from '@/components/auth-form';
import { AuthScreen } from '@/components/auth-screen';
import { useAuth } from '@/context/auth-context';
import { submitAuth } from '@/lib/auth-api';
import { validateLoginFields } from '@/lib/validation';
import type { ApiError } from '@/types/auth';

export default function LoginScreen() {
  const { establishSession } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit() {
    if (isSubmitting) return;

    const validationError = validateLoginFields(email, password);
    if (validationError) {
      setFieldError(validationError);
      return;
    }

    setFieldError(null);
    setIsSubmitting(true);

    try {
      const { token, user } = await submitAuth('login', { email, password });
      await establishSession(token, user);
      router.replace('/(tabs)');
    } catch (error) {
      const message = (error as ApiError).message ?? 'Login failed. Please try again.';
      setFieldError(message);
      Alert.alert('Login failed', message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthScreen
      title="Welcome back"
      subtitle="Sign in to continue to your account"
      footer={
        <AuthFooterLink
          message="Don't have an account?"
          linkText="Create one"
          href="/signup"
        />
      }>
      <AuthForm>
        <AuthTextInput
          index={0}
          label="Email address"
          placeholder="you@company.com"
          autoCapitalize="none"
          keyboardType="email-address"
          autoComplete="email"
          value={email}
          onChangeText={setEmail}
          editable={!isSubmitting}
        />
        <AuthTextInput
          index={1}
          label="Password"
          placeholder="Enter your password"
          secureTextEntry
          autoComplete="password"
          value={password}
          onChangeText={setPassword}
          editable={!isSubmitting}
          returnKeyType="go"
          onSubmitEditing={handleSubmit}
        />

        {fieldError ? <AuthErrorMessage message={fieldError} /> : null}

        <AuthSubmitButton label="Sign in" loading={isSubmitting} onPress={handleSubmit} />
      </AuthForm>
    </AuthScreen>
  );
}
