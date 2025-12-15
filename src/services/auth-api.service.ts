import {
  LoginRequest,
  RegisterRequest,
  TokenResponse,
  User,
  RefreshRequest,
  JwtPayload,
  ParsedTokens
} from '../types/auth.types';

export class TokenResponseDTO {
  constructor(
    public access_token: string,
    public refresh_token: string,
    public token_type: string = 'bearer',
    public expires_in?: number
  ) {}

  static fromResponse(data: any): TokenResponseDTO {
    return new TokenResponseDTO(
      data.access_token,
      data.refresh_token,
      data.token_type || 'bearer',
      data.expires_in
    );
  }
}

export class UserDTO {
  constructor(
    public id: string,
    public username: string,
    public role: 'admin' | 'user',
    public email?: string,
    public created_at?: string,
    public updated_at?: string
  ) {}

  static fromResponse(data: any): UserDTO {
  return new UserDTO(
    data.id,
    data.username,
    data.role,
    data.email === null ? undefined : data.email, // Преобразуем null в undefined
    data.created_at,
    data.updated_at
  );
}
}

export class AuthApiService {
  private baseUrl: string;

  constructor(baseUrl: string = 'http://localhost:8003') {
    this.baseUrl = baseUrl;
  }

  async register(data: RegisterRequest): Promise<TokenResponseDTO> {
    const response = await fetch(`${this.baseUrl}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const responseText = await response.text();
    
    if (!response.ok) {
      throw new Error(`Registration failed: ${response.status} - ${responseText}`);
    }

    return TokenResponseDTO.fromResponse(JSON.parse(responseText));
  }

  async login(data: LoginRequest): Promise<TokenResponseDTO> {
    const response = await fetch(`${this.baseUrl}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const responseText = await response.text();
    
    if (!response.ok) {
      throw new Error(`Login failed: ${response.status} - ${responseText}`);
    }

    return TokenResponseDTO.fromResponse(JSON.parse(responseText));
  }

  async refreshToken(refreshToken: string): Promise<TokenResponseDTO> {
    const data: RefreshRequest = { refresh_token: refreshToken };
    
    const response = await fetch(`${this.baseUrl}/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const responseText = await response.text();
    
    if (!response.ok) {
      throw new Error(`Token refresh failed: ${response.status} - ${responseText}`);
    }

    return TokenResponseDTO.fromResponse(JSON.parse(responseText));
  }

  async getCurrentUser(accessToken: string): Promise<UserDTO> {
    const response = await fetch(`${this.baseUrl}/me`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    const responseText = await response.text();
    
    if (!response.ok) {
      throw new Error(`Failed to get user: ${response.status} - ${responseText}`);
    }

    return UserDTO.fromResponse(JSON.parse(responseText));
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
      const errorText = await response.text();
      throw new Error(`Logout failed: ${response.status} - ${errorText}`);
    }
  }

  async createAdmin(): Promise<TokenResponseDTO> {
    return this.register({
      username: 'admin',
      password: 'admin123',
      email: 'admin@titanic.com'
    });
  }

  async createUser(username: string, password: string, email?: string): Promise<TokenResponseDTO> {
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

  parseJwtToken(token: string): JwtPayload | null {
  try {
    const base64Url = token.split('.')[1];
    
    if (!base64Url) {
      console.log('No payload in token');
      return null;
    }

    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    const payload = JSON.parse(jsonPayload);
    console.log('JWT Payload:', payload); // Для отладки
    return payload;
  } catch (error) {
    console.error('Failed to parse JWT token:', error);
    return null;
  }
}

  isTokenExpired(token: string): boolean {
    const payload = this.parseJwtToken(token);
    const expirationTime = payload?.exp ? payload.exp * 1000 : 0;
    return Date.now() >= expirationTime;
  }

  mapTokensToObject(tokens: TokenResponseDTO): ParsedTokens {
  const accessTokenPayload = this.parseJwtToken(tokens.access_token);
  const refreshTokenPayload = this.parseJwtToken(tokens.refresh_token);

  console.log('Access Token Payload:', accessTokenPayload);
  console.log('Refresh Token Payload:', refreshTokenPayload);

  return {
    raw: tokens,
    accessTokenPayload,
    refreshTokenPayload,
    isAccessTokenExpired: this.isTokenExpired(tokens.access_token),
    isRefreshTokenExpired: this.isTokenExpired(tokens.refresh_token),
    userInfo: {
      id: accessTokenPayload?.sub || accessTokenPayload?.user_id,
      username: accessTokenPayload?.username, // Может быть undefined
      email: accessTokenPayload?.email, // Может быть undefined
      role: accessTokenPayload?.role
    }
  };
}
  getUserInfoFromToken(accessToken: string) {
    const payload = this.parseJwtToken(accessToken);
    return {
      id: payload?.sub,
      username: payload?.username,
      email: payload?.email,
      role: payload?.role
    };
  }

  getUserRoleFromToken(accessToken: string): string | null {
    const payload = this.parseJwtToken(accessToken);
    return payload?.role || null;
  }

  hasRoleInToken(accessToken: string, role: string): boolean {
    const userRole = this.getUserRoleFromToken(accessToken);
    return userRole === role;
  }
}