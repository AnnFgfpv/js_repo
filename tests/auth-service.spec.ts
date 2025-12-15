import { test, expect } from './fixtures/auth.fixture';
import { UserFactory } from '../src/test-data/user-factory';

test.describe('Titanic Auth Service - Registration and Login', () => {
  test('should register new user with random credentials', async ({ createTestUser }) => {
    const { user, tokens, parsedTokens, userInfo } = await createTestUser();
    
    expect(tokens.access_token).toBeTruthy();
    expect(tokens.token_type).toBe('bearer');
    expect(tokens.refresh_token).toBeTruthy();
    
    expect(parsedTokens.accessTokenPayload).toBeTruthy();
    expect(parsedTokens.refreshTokenPayload).toBeTruthy();
    
    expect(parsedTokens.isAccessTokenExpired).toBe(false);
    expect(parsedTokens.isRefreshTokenExpired).toBe(false);
    
    expect(userInfo.username).toBe(user.username);
    expect(userInfo.role).toBe('user'); 
  });

  test('should login with registered user credentials', async ({ authService, createTestUser }) => {
    const { user } = await createTestUser();
    
    const loginTokens = await authService.login(user);
    const parsedLoginTokens = authService.mapTokensToObject(loginTokens);
    
    expect(loginTokens.access_token).toBeTruthy();
    expect(parsedLoginTokens.isAccessTokenExpired).toBe(false);
  });

  test('should fail to login with wrong password', async ({ authService, createTestUser }) => {
    const { user } = await createTestUser();
    
    await expect(
      authService.login({
        username: user.username,
        password: 'WRONG_PASSWORD_' + Math.random().toString(36)
      })
    ).rejects.toThrow();
  });

  test('should fail to register duplicate username', async ({ authService, createTestUser }) => {
    const { user } = await createTestUser();
    
    await expect(
      authService.register(user)
    ).rejects.toThrow(/already exists/);
  });

  test('different users should have different tokens', async ({ createMultipleUsers }) => {
    const users = await createMultipleUsers(2);
    
    const [user1, user2] = users;
    
    expect(user1.tokens.access_token).not.toBe(user2.tokens.access_token);
    expect(user1.tokens.refresh_token).not.toBe(user2.tokens.refresh_token);
    
    expect(user1.userInfo.username).toBe(user1.user.username);
    expect(user2.userInfo.username).toBe(user2.user.username);
  });
});

test.describe('Titanic Auth Service - User Operations', () => {
  test('should get current user info for registered user', async ({ createTestUser }) => {
    const { user, tokens, userInfo } = await createTestUser();
    
    expect(userInfo.username).toBe(user.username);
    expect(userInfo.role).toBe('user');
    
    if (user.email) {
      expect(userInfo.email).toBe(user.email);
    } else {
      expect(userInfo.email === null || userInfo.email === undefined).toBe(true);
    }
  });

  test('should work with user without email', async ({ authService }) => {
    const user = UserFactory.createUserWithoutEmail();
    const tokens = await authService.register(user);
    const userInfo = await authService.getCurrentUser(tokens.access_token);
    
    expect(userInfo.username).toBe(user.username);
    expect(userInfo.email === null || userInfo.email === undefined).toBe(true);
  });

  test('should work with valid username lengths', async ({ authService }) => {
    
    const shortUser = UserFactory.createUser({
      username: 'usr'
    });
    const shortTokens = await authService.register(shortUser);
    expect(shortTokens.access_token).toBeTruthy();
    
    
    const mediumUser = UserFactory.createUser({
      username: 'username123'
    });
    const mediumTokens = await authService.register(mediumUser);
    expect(mediumTokens.access_token).toBeTruthy();
    
    
    const longUsername = 'a'.repeat(50);
    const longUser = UserFactory.createUser({
      username: longUsername
    });
    const longTokens = await authService.register(longUser);
    expect(longTokens.access_token).toBeTruthy();
  });
});

test.describe('Titanic Auth Service - Token Operations', () => {
  test('should refresh token successfully', async ({ createTestUser, authService }) => {
    const { tokens } = await createTestUser();
    
    const refreshedTokens = await authService.refreshToken(tokens.refresh_token);
    
    expect(refreshedTokens.access_token).toBeTruthy();
    expect(refreshedTokens.refresh_token).toBeTruthy();
    
    
    expect(refreshedTokens.access_token).not.toBe(tokens.access_token);
    
    
    const parsedRefreshedTokens = authService.mapTokensToObject(refreshedTokens);
    expect(parsedRefreshedTokens.isAccessTokenExpired).toBe(false);
  });

  test('should fail to refresh with invalid token', async ({ authService }) => {
    const invalidToken = 'invalid_refresh_token_' + Math.random().toString(36);
    
    await expect(
      authService.refreshToken(invalidToken)
    ).rejects.toThrow(/401|invalid|failed/i);
  });

  test('should validate active token', async ({ createTestUser, authService }) => {
    const { tokens } = await createTestUser();
    
    const isValid = await authService.validateToken(tokens.access_token);
    expect(isValid).toBe(true);
  });

  test('should parse JWT payload correctly', async ({ createTestUser, authService }) => {
    const { tokens } = await createTestUser();
    
    const payload = authService.parseJwtToken(tokens.access_token);
    
    
    expect(payload).toBeTruthy();
    expect(payload?.sub || payload?.user_id).toBeTruthy(); 
    expect(payload?.role).toBeTruthy();
    expect(payload?.exp).toBeTruthy(); 
    
    
    console.log('Access token payload:', payload);
  });

  test('should check user role from token', async ({ createTestUser, authService }) => {
    const { tokens } = await createTestUser();
    
    const role = authService.getUserRoleFromToken(tokens.access_token);
    expect(role).toBe('user'); 
  });
});

test.describe('Titanic Auth Service - Logout', () => {
  test('should logout successfully with access token', async ({ createTestUser, authService }) => {
    const { tokens } = await createTestUser();
    
    await authService.logout(tokens.refresh_token, tokens.access_token);
    
    await expect(
      authService.refreshToken(tokens.refresh_token)
    ).rejects.toThrow(/401|invalid|failed/i);
  });

  test('logout should invalidate only specific user token', async ({ createMultipleUsers, authService }) => {
    const users = await createMultipleUsers(2);
    
    const [userToLogout, userToStay] = [users[0], users[1]];
    
    await authService.logout(
      userToLogout.tokens.refresh_token,
      userToLogout.tokens.access_token
    );
    
    await expect(
      authService.refreshToken(userToLogout.tokens.refresh_token)
    ).rejects.toThrow();
    
    const refreshedTokens = await authService.refreshToken(userToStay.tokens.refresh_token);
    expect(refreshedTokens.access_token).toBeTruthy();
  });
});

test.describe('Titanic Auth Service - Admin Features', () => {
  test('first registered user should be admin', async ({ authService }) => {
    const timestamp = Date.now();
    const firstUser = {
      username: `first_admin_${timestamp}`,
      password: 'AdminPass123!',
      email: `first_admin_${timestamp}@example.com`
    };
    
    const tokens = await authService.register(firstUser);
    const userInfo = await authService.getCurrentUser(tokens.access_token);
    
    expect(userInfo.role).toBe('admin');
    
    const roleFromToken = authService.getUserRoleFromToken(tokens.access_token);
    expect(roleFromToken).toBe('admin');
  });
  
  test.describe('Titanic Auth Service - Validation', () => {
  test('should reject too short username (< 3)', async ({ authService }) => {
    const invalidUser = {
      username: 'ab', 
      password: 'ValidPass123!',
      email: 'test@example.com'
    };
    
    await expect(
      authService.register(invalidUser)
    ).rejects.toThrow(/422|validation|failed/i);
  });

  test('should reject too short password (< 6)', async ({ authService }) => {
    const invalidUser = {
      username: 'validuser',
      password: '12345', 
      email: 'test@example.com'
    };
    
    await expect(
      authService.register(invalidUser)
    ).rejects.toThrow(/422|validation|failed/i);
  });

  test('should accept valid usernames with allowed characters', async ({ authService }) => {
  
  const validUsernames = [
    'user_name',
    'user-name', 
    'user123',
    'user_name-123'
  ];
  
  for (const username of validUsernames) {
    
    const uniqueUsername = `${username}_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    const user = {
      username: uniqueUsername,
      password: 'ValidPass123!',
      email: `${uniqueUsername}@example.com`
    };
    
    const tokens = await authService.register(user);
    expect(tokens.access_token).toBeTruthy();
    
    const userInfo = await authService.getCurrentUser(tokens.access_token);
    expect(userInfo.username).toBe(uniqueUsername);
    
    await authService.logout(tokens.refresh_token, tokens.access_token);
    
    await expect(
      authService.refreshToken(tokens.refresh_token)
    ).rejects.toThrow();
  }
});

test.describe('Titanic Auth Service - Token Parsing', () => {
  test('should correctly parse JWT token structure', async ({ createTestUser }) => {
    const { tokens, parsedTokens } = await createTestUser();
    
    expect(tokens).toHaveProperty('access_token');
    expect(tokens).toHaveProperty('refresh_token');
    expect(tokens).toHaveProperty('token_type', 'bearer');
    
    expect(parsedTokens.raw).toEqual(tokens);
    expect(parsedTokens.accessTokenPayload).toBeTruthy();
    
    expect(parsedTokens.accessTokenPayload?.role).toBeTruthy();
    expect(parsedTokens.accessTokenPayload?.exp).toBeTruthy();
    expect(parsedTokens.accessTokenPayload?.sub || parsedTokens.accessTokenPayload?.user_id).toBeTruthy();
    
   
    expect(parsedTokens.refreshTokenPayload).toBeTruthy();
  });

  test('should detect token expiration', async ({ authService }) => {
    
    const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwidXNlcl9pZCI6MTEsInJvbGUiOiJ1c2VyIiwiZXhwIjoxNTE2MjM5MDIyLCJ0eXBlIjoiYWNjZXNzIn0.kL0HrY5qR7hKq7q7q7q7q7q7q7q7q7q7q7q7q7q7q7';
    
    const isExpired = authService.isTokenExpired(expiredToken);
    expect(isExpired).toBe(true);
    
    const payload = authService.parseJwtToken(expiredToken);
    expect(payload?.exp).toBe(1516239022); 
  });
});