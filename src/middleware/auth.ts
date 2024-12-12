import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        username?: string;
        email?: string;
        role?: string;
      }
    }
  }
}

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // For testing purposes, simulate an authenticated user
    if (process.env.NODE_ENV === 'test') {
      req.user = { id: 'user123', username: 'testuser' };
      return next();
    }

    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'No authorization header' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    // TODO: Implement proper token verification with Lucia
    // For now, set a mock user
    req.user = { 
      id: 'user123',
      username: 'mockuser',
      email: 'mock@example.com',
      role: 'user'
    };
    
    next();
  } catch (error) {
    res.status(401).json({ error: 'Authentication failed' });
  }
};
