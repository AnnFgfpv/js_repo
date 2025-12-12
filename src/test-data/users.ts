export interface TestUser {
  username: string;
  password: string;
  email?: string;
}

export const TestUsers = {
  USER_1: {
    username: 'testuser1',
    password: 'TestPass123!',
    email: 'test1@example.com'
  },
  
  USER_2: {
    username: 'testuser2', 
    password: 'TestPass456!',
    email: 'test2@example.com'
  },
  
  USER_3: {
    username: 'testuser3',
    password: 'TestPass789!',
    email: 'test3@example.com'
  },
  
  SHORT_USERNAME: {
    username: 'usr',
    password: 'Pass123!',
    email: 'short@example.com'
  },

    LONG_USERNAME: {
    username: 'verylongusernametest',
    password: 'LongPass123!',
    email: 'long@example.com'
  },

  NO_EMAIL: {
    username: 'noemailuser',
    password: 'NoEmailPass123!'
  },
  
  ADMIN: {
    username: 'admin',
    password: 'admin123',
    email: 'admin@titanic.com'
  }
} as const;

export function getUserByIndex(index: number): TestUser {
  const users = [
    TestUsers.USER_1,
    TestUsers.USER_2, 
    TestUsers.USER_3,
    TestUsers.SHORT_USERNAME,
    TestUsers.LONG_USERNAME,
    TestUsers.NO_EMAIL
  ];
  
  return users[index % users.length];
}