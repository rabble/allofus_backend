import express from 'express';
import cors from 'cors';
import { organizationRoutes } from './api/organizations';
import { authMiddleware } from './middleware/auth';

const app = express();

app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());

// Auth middleware for protected routes
app.use('/api/organizations', authMiddleware);

// Routes
app.use('/api/organizations', organizationRoutes);

export { app };
