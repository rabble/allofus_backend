import { PrismaClient } from '@prisma/client';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';

export type MockContext = {
  prisma: DeepMockProxy<PrismaClient>
}

export const prismaMock = mockDeep<PrismaClient>();

// Mock the prisma client
jest.mock('../lib/prisma', () => ({
  prisma: prismaMock
}));

beforeEach(() => {
  jest.clearAllMocks();
});
