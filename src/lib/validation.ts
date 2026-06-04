const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEmail(email: string): string | null {
  const trimmed = email.trim();
  if (!trimmed) return 'Email is required.';
  if (!EMAIL_REGEX.test(trimmed)) return 'Enter a valid email address.';
  return null;
}

export function validatePassword(password: string): string | null {
  if (!password) return 'Password is required.';
  if (password.length < 6) return 'Password must be at least 6 characters.';
  return null;
}

export function validateName(name: string): string | null {
  const trimmed = name.trim();
  if (!trimmed) return 'Name is required.';
  return null;
}

/** Returns the first validation error, or null when all fields are valid. */
export function validateLoginFields(email: string, password: string): string | null {
  return validateEmail(email) ?? validatePassword(password);
}

export function validateSignupFields(
  name: string,
  email: string,
  password: string,
): string | null {
  return validateName(name) ?? validateEmail(email) ?? validatePassword(password);
}
