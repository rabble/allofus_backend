import express from 'express';
import { authMiddleware } from '../../middleware/auth';
import { 
  getUserOrganizations, 
  createOrganization, 
  updateOrganization, 
  deleteOrganization 
} from './controllers';

const router = express.Router();

router.get('/user', authMiddleware, getUserOrganizations);
router.post('/', authMiddleware, createOrganization);
router.put('/:id', authMiddleware, updateOrganization);
router.delete('/:id', authMiddleware, deleteOrganization);

export const organizationRoutes = router;
