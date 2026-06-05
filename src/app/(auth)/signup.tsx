import { router } from 'expo-router';
import { useState } from 'react';
import { Alert } from 'react-native';

import { AuthFooterLink } from '@/components/auth-footer-link';
import { AuthErrorMessage, AuthForm, AuthSubmitButton, AuthTextInput } from '@/components/auth-form';
import { AuthScreen } from '@/components/auth-screen';
import { useAuth } from '@/context/auth-context';
import { submitAuth } from '@/lib/auth-api';
import { validateSignupFields } from '@/lib/validation';
import type { ApiError } from '@/types/auth';

export default function SignupScreen() {
  const { establishSession } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit() {
    if (isSubmitting) return;

    const validationError = validateSignupFields(name, email, password);
    if (validationError) {
      setFieldError(validationError);
      return;
    }

    setFieldError(null);
    setIsSubmitting(true);

    try {
      const { token, user } = await submitAuth('signup', { name, email, password });
      await establishSession(token, user);
      router.replace('/(tabs)');
    } catch (error) {
      const message = (error as ApiError).message ?? 'Signup failed. Please try again.';
      setFieldError(message);
      Alert.alert('Signup failed', message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthScreen
      title="Create your account"
      subtitle="Get started with CUSTECH in a few steps"
      footer={
        <AuthFooterLink
          message="Already have an account?"
          linkText="Sign in"
          href="/login"
        />
      }>
      <AuthForm>
        <AuthTextInput
          index={0}
          label="Full name"
          placeholder="John Smith"
          autoCapitalize="words"
          autoComplete="name"
          value={name}
          onChangeText={setName}
          editable={!isSubmitting}
        />
        <AuthTextInput
          index={1}
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
          index={2}
          label="Password"
          placeholder="At least 6 characters"
          secureTextEntry
          autoComplete="new-password"
          value={password}
          onChangeText={setPassword}
          editable={!isSubmitting}
          returnKeyType="go"
          onSubmitEditing={handleSubmit}
        />

        {fieldError ? <AuthErrorMessage message={fieldError} /> : null}

        <AuthSubmitButton label="Create account" loading={isSubmitting} onPress={handleSubmit} />
      </AuthForm>
    </AuthScreen>
  );
}
