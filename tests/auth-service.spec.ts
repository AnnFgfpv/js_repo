import { test, expect } from '@playwright/test';
import { AuthApiService } from '../src/services/auth-api.service';
import { TestUsers } from '../src/test-data/users';

test.describe('Titanic Auth Service', () => {
  let authService: AuthApiService;
  let userTokens: Record<string, any> = {}; 
  test.beforeEach(async () => {
    authService = new AuthApiService();
    userTokens = {}; 
    
    const usersToRegister = [
      TestUsers.USER_1,
      TestUsers.USER_2,
      TestUsers.USER_3,
      TestUsers.SHORT_USERNAME,
      TestUsers.LONG_USERNAME,
      TestUsers.NO_EMAIL
    ];
    
    for (const user of usersToRegister) {
      try {
        const tokens = await authService.register(user);
        userTokens[user.username] = {
          tokens,
          userData: user
        };
      } catch (error) {
    
        const tokens = await authService.login(user);
        userTokens[user.username] = {
          tokens,
          userData: user
        };
      }
    }
  });

  test('All users should be registered and can login', async () => {
    
    for (const user of Object.values(TestUsers)) {

      if (user.username === 'admin') continue;
      
      const loginTokens = await authService.login(user);
      expect(loginTokens.access_token).toBeTruthy();
      expect(loginTokens.token_type).toBe('bearer');
    }
  });

  test('Get current user info for each registered user', async () => {
    for (const [username, data] of Object.entries(userTokens)) {
      const userInfo = await authService.getCurrentUser(data.tokens.access_token);
      
      expect(userInfo.username).toBe(username);
      expect(userInfo.role).toBe('user'); 
      
      if (data.userData.email) {
        expect(userInfo.email).toBe(data.userData.email);
      }
    }
  });

  test('Refresh token works for each user', async () => {
    for (const [username, data] of Object.entries(userTokens)) {
      const refreshedTokens = await authService.refreshToken(data.tokens.refresh_token);
      
      expect(refreshedTokens.access_token).toBeTruthy();
      expect(refreshedTokens.refresh_token).toBeTruthy();
      
      userTokens[username].tokens = refreshedTokens;
    }
  });

  test('Login with wrong password should fail for each user', async () => {
    for (const user of Object.values(TestUsers)) {
      if (user.username === 'admin') continue;
      
      await expect(
        authService.login({
          username: user.username,
          password: 'WRONG_PASSWORD_123'
        })
      ).rejects.toThrow();
    }
  });

  test('Register duplicate username should fail', async () => {
    await expect(
      authService.register(TestUsers.USER_1)
    ).rejects.toThrow();
  });

  test('Different users have different tokens', async () => {
    const user1Tokens = userTokens[TestUsers.USER_1.username].tokens;
    const user2Tokens = userTokens[TestUsers.USER_2.username].tokens;
    
    expect(user1Tokens.access_token).not.toBe(user2Tokens.access_token);
    expect(user1Tokens.refresh_token).not.toBe(user2Tokens.refresh_token);
  });

  test('Logout invalidates refresh token for specific user', async () => {
    const username = TestUsers.USER_1.username;
    const userData = userTokens[username];
    
    await authService.logout(
      userData.tokens.refresh_token,
      userData.tokens.access_token
    );
    
    await expect(
      authService.refreshToken(userData.tokens.refresh_token)
    ).rejects.toThrow();
    
    const user2Data = userTokens[TestUsers.USER_2.username];
    const refreshed = await authService.refreshToken(user2Data.tokens.refresh_token);
    expect(refreshed.access_token).toBeTruthy();
  });

  test('User without email - check registration', async () => {
    const noEmailUser = userTokens[TestUsers.NO_EMAIL.username];
    
    const userInfo = await authService.getCurrentUser(noEmailUser.tokens.access_token);
    
    expect(userInfo.username).toBe(TestUsers.NO_EMAIL.username);
    expect(userInfo.email === null || userInfo.email === undefined).toBe(true);
  });

  test('User with short username works correctly', async () => {
    const shortUser = userTokens[TestUsers.SHORT_USERNAME.username];
    
    const userInfo = await authService.getCurrentUser(shortUser.tokens.access_token);
    expect(userInfo.username).toBe(TestUsers.SHORT_USERNAME.username);
    expect(userInfo.username.length).toBe(3);
  });

  test('User with long username works correctly', async () => {
    const longUser = userTokens[TestUsers.LONG_USERNAME.username];
    
    const userInfo = await authService.getCurrentUser(longUser.tokens.access_token);
    expect(userInfo.username).toBe(TestUsers.LONG_USERNAME.username);
    expect(userInfo.username.length).toBeGreaterThan(10);
  });

  test('Try to login with admin (separate test)', async () => {
    try {
      const tokens = await authService.login(TestUsers.ADMIN);
      expect(tokens.access_token).toBeTruthy();
      
      const userInfo = await authService.getCurrentUser(tokens.access_token);
      expect(userInfo.role).toBe('admin');

    } catch (error) {
      console.log('Admin user does not exist in the system');
    }
  });
});