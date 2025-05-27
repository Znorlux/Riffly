export type UserRole =
  | 'AFICIONADO'
  | 'PROFESIONAL'
  | 'PRODUCTOR'
  | 'COMPOSITOR';

export interface User {
  id: string;
  email: string;
  username: string;
  createdAt: string;
  role: UserRole;
  profileImage: string | null;
  bio: string | null;
}

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
  profileImage?: string;
  bio?: string;
  role?: UserRole;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  access_token: string;
}

export interface ApiError {
  message: string;
  error: string;
  statusCode: number;
}

export interface RegisterFormData {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  profileImage: string;
  bio: string;
  role: UserRole;
  acceptTerms: boolean;
}
