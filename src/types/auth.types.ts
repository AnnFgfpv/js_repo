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

export interface JwtPayload {
  sub?: string;
  username?: string;
  email?: string;
  exp?: number;
  iat?: number;
  role?: UserRole;
  [key: string]: any;
}

export interface ParsedTokens {
  raw: TokenResponse;
  accessTokenPayload: JwtPayload | null;
  refreshTokenPayload: JwtPayload | null;
  isAccessTokenExpired: boolean;
  isRefreshTokenExpired: boolean;
  userInfo: {
    id?: string;
    username?: string;
    email?: string;
    role?: UserRole;
  };
}

export interface User {
  username: string;
  role: UserRole;
  email?: string;
}

export interface RefreshRequest {
  refresh_token: string;
}