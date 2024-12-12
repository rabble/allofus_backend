import request from 'supertest';
import { app } from '../../app';
import { prisma } from '../../lib/prisma';
import { createTestUser, createTestOrganization } from '../helpers';

describe('API Integration Tests', () => {
  let authToken: string;
  let testUser: any;

  beforeAll(async () => {
    testUser = await createTestUser();
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'testuser',
        password: 'password123'
      });
    authToken = loginResponse.body.token;
  });

  afterAll(async () => {
    await prisma.organization.deleteMany();
    await prisma.user.deleteMany();
  });

  describe('Organizations API', () => {
    it('should create and retrieve organization', async () => {
      const orgData = {
        name: 'Test Organization',
        description: 'Test Description',
        focusAreas: ['climate'],
        engagementTypes: ['online']
      };

      // Create organization
      const createResponse = await request(app)
        .post('/api/organizations')
        .set('Authorization', `Bearer ${authToken}`)
        .send(orgData);

      expect(createResponse.status).toBe(201);
      expect(createResponse.body.name).toBe(orgData.name);

      // Retrieve organizations
      const getResponse = await request(app)
        .get('/api/organizations/user')
        .set('Authorization', `Bearer ${authToken}`);

      expect(getResponse.status).toBe(200);
      expect(getResponse.body).toHaveLength(1);
      expect(getResponse.body[0].name).toBe(orgData.name);
    });
  });
});
