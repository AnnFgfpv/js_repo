import {
  LoginRequest,
  RegisterRequest,
  TokenResponse,
  User,
  RefreshRequest
} from '../types/auth.types';

export class AuthApiService {
  private baseUrl: string;

  constructor(baseUrl: string = 'http://localhost:8003') {
    this.baseUrl = baseUrl;
  }

 async register(data: RegisterRequest): Promise<TokenResponse> {
  const response = await fetch(`${this.baseUrl}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Registration failed: ${response.status} - ${errorText}`);
  }

  return response.json();
}

async login(data: LoginRequest): Promise<TokenResponse> {
  const response = await fetch(`${this.baseUrl}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Login failed: ${response.status} - ${errorText}`);
  }

  return response.json();
}

  async refreshToken(refreshToken: string): Promise<TokenResponse> {
    const data: RefreshRequest = { refresh_token: refreshToken };
    
    const response = await fetch(`${this.baseUrl}/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error(`Token refresh failed: ${response.status}`);
    }

    return response.json();
  }

  async getCurrentUser(accessToken: string): Promise<User> {
    const response = await fetch(`${this.baseUrl}/me`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to get user: ${response.status}`);
    }

    return response.json();
  }

  async logout(refreshToken: string, accessToken?: string): Promise<void> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };

    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }

    const data: RefreshRequest = { refresh_token: refreshToken };

    const response = await fetch(`${this.baseUrl}/logout`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data)
    });

    if (!response.ok && response.status !== 204) {
      throw new Error(`Logout failed: ${response.status}`);
    }
  }

  async createAdmin(): Promise<TokenResponse> {
    return this.register({
      username: 'admin',
      password: 'admin123',
      email: 'admin@titanic.com'
    });
  }

  async createUser(username: string, password: string, email?: string): Promise<TokenResponse> {
    return this.register({
      username,
      password,
      email
    });
  }

  async validateToken(accessToken: string): Promise<boolean> {
    try {
      await this.getCurrentUser(accessToken);
      return true;
    } catch {
      return false;
    }
  }
}