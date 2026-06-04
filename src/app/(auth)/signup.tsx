import { router } from 'expo-router';
import { useState } from 'react';
import { Alert } from 'react-native';

import { AuthFooterLink } from '@/components/auth-footer-link';
import { AuthErrorMessage, AuthForm, AuthSubmitButton, AuthTextInput } from '@/components/auth-form';
import { AuthScreen } from '@/components/auth-screen';
import { useAuth } from '@/context/auth-context';
import { validateSignupFields } from '@/lib/validation';
import type { ApiError } from '@/types/auth';

export default function SignupScreen() {
  const { signup, isSubmitting } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldError, setFieldError] = useState<string | null>(null);

  async function handleSubmit() {
    const validationError = validateSignupFields(name, email, password);
    if (validationError) {
      setFieldError(validationError);
      return;
    }

    setFieldError(null);

    try {
      await signup({ name, email, password });
      router.replace('/index');
    } catch (error) {
      const message = (error as ApiError).message ?? 'Signup failed. Please try again.';
      Alert.alert('Signup failed', message);
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
        />
        <AuthTextInput
          index={2}
          label="Password"
          placeholder="At least 6 characters"
          secureTextEntry
          autoComplete="new-password"
          value={password}
          onChangeText={setPassword}
        />

        {fieldError ? <AuthErrorMessage message={fieldError} /> : null}

        <AuthSubmitButton label="Create account" loading={isSubmitting} onPress={handleSubmit} />
      </AuthForm>
    </AuthScreen>
  );
}
