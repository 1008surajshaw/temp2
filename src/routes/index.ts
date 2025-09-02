import { Router } from 'express';
import userRoutes from './userRoutes';
import organizationRoutes from './organizationRoutes';
import featureRoutes from './featureRoutes';
import planRoutes from './planRoutes';
import subscriptionRoutes from './subscriptionRoutes';
import usageRoutes from './usageRoutes';
import authRoutes from './authRoutes';

const router = Router();

// Health check
router.get('/', (req, res) => {
  res.json({ message: 'API is running!', timestamp: new Date().toISOString() });
});

// API routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/organizations', organizationRoutes);
router.use('/features', featureRoutes);
router.use('/plans', planRoutes);
router.use('/subscriptions', subscriptionRoutes);
router.use('/usage', usageRoutes);

export default router;