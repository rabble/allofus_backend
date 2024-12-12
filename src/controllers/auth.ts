import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { Lucia } from 'lucia';

const prisma = new PrismaClient();

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    // Add password validation logic here
    const user = await prisma.user.findUnique({
      where: { username }
    });
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Create session
    const session = await prisma.session.create({
      data: {
        userId: user.id,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
      }
    });

    res.cookie('session', session.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    });

    res.json({ user: { username: user.username, role: user.role } });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const sessionId = req.cookies.session;
    if (sessionId) {
      await prisma.session.delete({
        where: { id: sessionId }
      });
    }
    res.clearCookie('session');
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Logout failed' });
  }
};

export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const sessionId = req.cookies.session;
    if (!sessionId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      include: { user: true }
    });

    if (!session || new Date() > session.expiresAt) {
      res.clearCookie('session');
      return res.status(401).json({ error: 'Session expired' });
    }

    res.json({ 
      username: session.user.username, 
      role: session.user.role 
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get current user' });
  }
};
