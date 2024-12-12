import { createOrganization, getUserOrganizations, updateOrganization, deleteOrganization } from '../organizations/controllers';
import { PrismaClient } from '@prisma/client';
import { prismaMock } from '../../test/setup';
import { Request, Response } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';

describe('Organization API', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockJson: jest.Mock;
  let mockStatus: jest.Mock;

  beforeEach(() => {
    mockJson = jest.fn();
    mockStatus = jest.fn().mockReturnThis();
    mockRes = {
      json: mockJson,
      status: mockStatus
    };
  });

  describe('getUserOrganizations', () => {
    it('should return user organizations', async () => {
      const mockOrgs = [
        { 
          id: '1', 
          name: 'Org 1',
          description: 'Test Org 1',
          category: 'nonprofit',
          focusAreas: '["climate"]',
          engagementTypes: '["online"]',
          locations: '["remote"]',
          contact: null,
          socialMedia: null,
          logo: null,
          joinNowLink: null,
          membersCount: null,
          staff: null,
          supporter: null,
          approved: false,
          createdById: 'user123',
          createdAt: new Date(),
          updatedAt: new Date(),
          website: null
        },
        { 
          id: '2', 
          name: 'Org 2',
          description: 'Test Org 2',
          category: 'nonprofit',
          focusAreas: '["climate"]',
          engagementTypes: '["online"]',
          locations: '["remote"]',
          contact: null,
          socialMedia: null,
          logo: null,
          joinNowLink: null,
          membersCount: null,
          staff: null,
          supporter: null,
          approved: false,
          createdById: 'user123',
          createdAt: new Date(),
          updatedAt: new Date(),
          website: null
        }
      ];

      mockReq = {
        user: { id: 'user123' }
      };

      prismaMock.organization.findMany.mockResolvedValue(mockOrgs);

      await getUserOrganizations(mockReq, mockRes);

      expect(prismaMock.organization.findMany).toHaveBeenCalledWith({
        where: { createdById: 'user123' },
        orderBy: { createdAt: 'desc' }
      });
      expect(mockJson).toHaveBeenCalledWith(mockOrgs);
    });
  });

  describe('createOrganization', () => {
    it('should create new organization', async () => {
      const orgData = {
        name: 'New Org',
        description: 'Test org',
        category: 'nonprofit',
        focusAreas: ['climate', 'justice'],
        engagementTypes: ['online'],
        locations: ['remote'],
        contact: null,
        socialMedia: null,
        logo: null,
        joinNowLink: null,
        membersCount: null,
        staff: null,
        supporter: null,
        approved: false,
        website: null
      };

      mockReq = {
        user: { id: 'user123' },
        body: orgData
      };

      const mockCreatedOrg = {
        id: 'org123',
        name: orgData.name,
        description: orgData.description,
        category: orgData.category,
        focusAreas: JSON.stringify(orgData.focusAreas),
        engagementTypes: JSON.stringify(orgData.engagementTypes),
        locations: JSON.stringify(orgData.locations),
        contact: null,
        socialMedia: null,
        logo: null,
        joinNowLink: null,
        membersCount: null,
        staff: null,
        supporter: null,
        approved: false,
        website: null,
        createdById: 'user123',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      prismaMock.organization.create.mockResolvedValue(mockCreatedOrg);

      await createOrganization(mockReq, mockRes);

      expect(prismaMock.organization.create).toHaveBeenCalledWith({
        data: {
          ...orgData,
          createdById: 'user123',
          focusAreas: JSON.stringify(orgData.focusAreas)
        }
      });
      expect(mockStatus).toHaveBeenCalledWith(201);
      expect(mockJson).toHaveBeenCalledWith(mockCreatedOrg);
    });
  });

  describe('updateOrganization', () => {
    it('should update existing organization', async () => {
      const orgId = 'org123';
      const updateData = {
        name: 'Updated Org',
        description: 'Updated description',
        category: 'nonprofit',
        focusAreas: ['climate', 'justice'],
        engagementTypes: ['online'],
        locations: ['remote']
      };

      mockReq = {
        user: { id: 'user123' },
        params: { id: orgId },
        body: updateData
      };

      const existingOrg = {
        id: orgId,
        createdById: 'user123',
        name: 'Old Name',
        description: 'Old description',
        category: 'nonprofit',
        focusAreas: '["climate"]',
        engagementTypes: '["online"]',
        locations: '["remote"]',
        contact: null,
        socialMedia: null,
        logo: null,
        joinNowLink: null,
        membersCount: null,
        staff: null,
        supporter: null,
        approved: false,
        website: null,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const updatedOrg = {
        ...existingOrg,
        ...updateData,
        focusAreas: JSON.stringify(updateData.focusAreas),
        engagementTypes: JSON.stringify(updateData.engagementTypes),
        locations: JSON.stringify(updateData.locations)
      };

      prismaMock.organization.findFirst.mockResolvedValue(existingOrg);
      prismaMock.organization.update.mockResolvedValue(updatedOrg);

      await updateOrganization(mockReq as Request, mockRes as Response);

      expect(prismaMock.organization.findFirst).toHaveBeenCalledWith({
        where: { id: orgId, createdById: 'user123' }
      });
      expect(prismaMock.organization.update).toHaveBeenCalledWith({
        where: { id: orgId },
        data: {
          ...updateData,
          focusAreas: JSON.stringify(updateData.focusAreas),
          engagementTypes: JSON.stringify(updateData.engagementTypes),
          locations: JSON.stringify(updateData.locations)
        }
      });
      expect(mockJson).toHaveBeenCalledWith(updatedOrg);
    });

    it('should return 404 if organization not found', async () => {
      mockReq = {
        user: { id: 'user123' },
        params: { id: 'nonexistent' },
        body: { name: 'Updated Org' }
      };

      prismaMock.organization.findFirst.mockResolvedValue(null);

      await updateOrganization(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({ error: 'Organization not found' });
    });
  });

  describe('deleteOrganization', () => {
    it('should delete existing organization', async () => {
      const orgId = 'org123';
      mockReq = {
        user: { id: 'user123' },
        params: { id: orgId }
      };

      const existingOrg = {
        id: orgId,
        createdById: 'user123',
        name: 'Org to Delete',
        description: 'To be deleted',
        category: 'nonprofit',
        focusAreas: '["climate"]',
        engagementTypes: '["online"]',
        locations: '["remote"]',
        contact: null,
        socialMedia: null,
        logo: null,
        joinNowLink: null,
        membersCount: null,
        staff: null,
        supporter: null,
        approved: false,
        website: null,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      prismaMock.organization.findFirst.mockResolvedValue(existingOrg);
      prismaMock.organization.delete.mockResolvedValue(existingOrg);

      await deleteOrganization(mockReq as Request, mockRes as Response);

      expect(prismaMock.organization.findFirst).toHaveBeenCalledWith({
        where: { id: orgId, createdById: 'user123' }
      });
      expect(prismaMock.organization.delete).toHaveBeenCalledWith({
        where: { id: orgId }
      });
      expect(mockStatus).toHaveBeenCalledWith(204);
    });

    it('should return 404 if organization not found', async () => {
      mockReq = {
        user: { id: 'user123' },
        params: { id: 'nonexistent' }
      };

      prismaMock.organization.findFirst.mockResolvedValue(null);

      await deleteOrganization(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({ error: 'Organization not found' });
    });
  });
});
