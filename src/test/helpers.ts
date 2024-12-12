import { prisma } from '../lib/prisma';
import { hash } from 'bcrypt';

export async function createTestUser() {
  const hashedPassword = await hash('password123', 10);
  return prisma.user.create({
    data: {
      username: 'testuser',
      email: 'test@example.com',
      key: {
        create: {
          hashedPassword
        }
      }
    }
  });
}

export async function createTestOrganization(userId: string) {
  return prisma.organization.create({
    data: {
      name: 'Test Org',
      description: 'Test Description',
      focusAreas: JSON.stringify(['climate']),
      createdById: userId
    }
  });
}
