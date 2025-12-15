import { test as base, expect } from '@playwright/test';
import { AuthApiService } from '../../src/services/auth-api.service.ts';
import { UserFactory, TestUser } from '../../src/test-data/user-factory.ts';

export interface AuthFixture {
  authService: AuthApiService;
  createTestUser: (overrides?: Partial<TestUser>) => Promise<{
    user: TestUser;
    tokens: any;
    parsedTokens: any;
    userInfo: any;
  }>;
  createMultipleUsers: (count: number) => Promise<Array<{
    user: TestUser;
    tokens: any;
    parsedTokens: any;
    userInfo: any;
  }>>;
}

export const test = base.extend<AuthFixture>({
  authService: async ({ }, use) => {
    const authService = new AuthApiService();
    await use(authService);
  },

  createTestUser: async ({ authService }, use) => {
    const createTestUser = async (overrides: Partial<TestUser> = {}) => {
      const user = UserFactory.createUser(overrides);
      const tokens = await authService.register(user);
      const parsedTokens = authService.mapTokensToObject(tokens);
      const userInfo = await authService.getCurrentUser(tokens.access_token);
      
      return { user, tokens, parsedTokens, userInfo };
    };
    
    await use(createTestUser);
  },

  createMultipleUsers: async ({ authService }, use) => {
    const createMultipleUsers = async (count: number) => {
      const users = UserFactory.createUsers(count);
      const results = [];
      
      for (const user of users) {
        const tokens = await authService.register(user);
        const parsedTokens = authService.mapTokensToObject(tokens);
        const userInfo = await authService.getCurrentUser(tokens.access_token);
        results.push({ user, tokens, parsedTokens, userInfo });
      }
      
      return results;
    };
    
    await use(createMultipleUsers);
  }
});

export { expect };