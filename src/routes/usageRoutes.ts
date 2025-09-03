import { Router } from 'express';
import { UsageController } from '../controllers/UsageController';
import { UserFeatureLimitService } from '../services/UserFeatureLimitService';
import { UserFeatureLimitRepository } from '../repositories/UserFeatureLimitRepository';
import { SubscriptionRepository } from '../repositories/SubscriptionRepository';
import { FeatureRepository } from '../repositories/FeatureRepository';

const router = Router();

// Initialize dependencies
const userFeatureLimitRepository = new UserFeatureLimitRepository();
const subscriptionRepository = new SubscriptionRepository();
const featureRepository = new FeatureRepository();

const userFeatureLimitService = new UserFeatureLimitService(
  userFeatureLimitRepository,
  subscriptionRepository,
  featureRepository
);

const usageController = new UsageController(userFeatureLimitService);

// Usage routes
router.post('/', (req, res) => usageController.createUsage(req, res));
router.get('/user/:userId/feature/:featureId', (req, res) => usageController.getUsageByUserAndFeature(req, res));

export default router;