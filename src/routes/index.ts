import { Router } from 'express';
import userRoutes from './userRoutes';
import organizationRoutes from './organizationRoutes';
import featureRoutes from './featureRoutes';

const router = Router();

// Health check
router.get('/', (req, res) => {
  res.json({ message: 'API is running!', timestamp: new Date().toISOString() });
});

// Feature routes
router.use('/users', userRoutes);
router.use('/organizations', organizationRoutes);
router.use('/features', featureRoutes);

export default router;