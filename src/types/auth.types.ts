export type UserRole = 'admin' | 'user';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  email?: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in?: number;
}

export interface User {
  username: string;
  role: UserRole;
  email?: string;
}

export interface RefreshRequest {
  refresh_token: string;
}