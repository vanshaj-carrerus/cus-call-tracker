export type User = {
  id: string;
  email: string;
  name?: string;
};

export type AuthResponse = {
  success: boolean;
  token?: string;
  user?: User;
  message?: string;
};

export type MeResponse = {
  success: boolean;
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
