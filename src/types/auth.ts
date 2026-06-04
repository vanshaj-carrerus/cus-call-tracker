export type User = Record<string, unknown>;

export type AuthResponse = {
  success: boolean;
  token: string;
  user: User;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type SignupPayload = {
  name: string;
  email: string;
  password: string;
};

export type ApiError = {
  message: string;
  status?: number;
};
