import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

export const getUserOrganizations = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const organizations = await prisma.organization.findMany({
      where: { createdById: userId },
      orderBy: { createdAt: 'desc' }
    });
    res.json(organizations);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch organizations' });
  }
};

export const createOrganization = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const organization = await prisma.organization.create({
      data: {
        ...req.body,
        createdById: userId,
        focusAreas: JSON.stringify(req.body.focusAreas),
        engagementTypes: JSON.stringify(req.body.engagementTypes),
        locations: JSON.stringify(req.body.locations),
        contact: req.body.contact ? JSON.stringify(req.body.contact) : null,
        socialMedia: req.body.socialMedia ? JSON.stringify(req.body.socialMedia) : null,
        staff: req.body.staff ? JSON.stringify(req.body.staff) : null,
        supporter: req.body.supporter ? JSON.stringify(req.body.supporter) : null
      }
    });
    res.status(201).json(organization);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create organization' });
  }
};

export const updateOrganization = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    
    const organization = await prisma.organization.findFirst({
      where: { id, createdById: userId }
    });
    
    if (!organization) {
      return res.status(404).json({ error: 'Organization not found' });
    }
    
    const updated = await prisma.organization.update({
      where: { id },
      data: {
        ...req.body,
        focusAreas: JSON.stringify(req.body.focusAreas),
        engagementTypes: JSON.stringify(req.body.engagementTypes),
        locations: JSON.stringify(req.body.locations),
        contact: req.body.contact ? JSON.stringify(req.body.contact) : null,
        socialMedia: req.body.socialMedia ? JSON.stringify(req.body.socialMedia) : null,
        staff: req.body.staff ? JSON.stringify(req.body.staff) : null,
        supporter: req.body.supporter ? JSON.stringify(req.body.supporter) : null
      }
    });
    
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update organization' });
  }
};

export const deleteOrganization = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    
    const organization = await prisma.organization.findFirst({
      where: { id, createdById: userId }
    });
    
    if (!organization) {
      return res.status(404).json({ error: 'Organization not found' });
    }
    
    await prisma.organization.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete organization' });
  }
};
