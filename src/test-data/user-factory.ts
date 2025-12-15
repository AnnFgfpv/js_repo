import * as faker  from 'faker';

export interface TestUser {
  username: string;
  password: string;
  email?: string;
}

export class UserFactory {
  static createUser(overrides: Partial<TestUser> = {}): TestUser {
    
    const baseUsername = faker.internet.userName().toLowerCase().replace(/[^a-z0-9_-]/g, '');
    const username = baseUsername.length >= 3 ? baseUsername : baseUsername + '123';
    
    
    const password = faker.internet.password(10, true); 
    
    return {
      username: username.substring(0, 50), 
      password,
      email: faker.internet.email().toLowerCase(),
      ...overrides
    };
  }

  static createUsers(count: number, overrides: Partial<TestUser> = {}): TestUser[] {
    return Array.from({ length: count }, () => this.createUser(overrides));
  }

  static createUserWithoutEmail(): TestUser {
    const user = this.createUser();
    delete user.email;
    return user;
  }

  static createUserWithShortUsername(): TestUser {
    return this.createUser({
      username: 'usr' 
    });
  }

  static createUserWithLongUsername(): TestUser {
    return this.createUser({
      username: 'username-' + faker.random.alphaNumeric(30) 
    });
  }

  static createAdminUser(): TestUser {
    return {
      username: 'admin',
      password: 'admin123',
      email: 'admin@titanic.com'
    };
  }

  static createInvalidUser(): TestUser {
    return {
      username: 'ab', 
      password: '123', 
      email: 'invalid@example.com'
    };
  }
}