import { Router } from 'express';
import { UserFeatureLimitController } from '../controllers/UserFeatureLimitController';
import { UserFeatureLimitService } from '../services/UserFeatureLimitService';
import { UserFeatureLimitRepository } from '../repositories/UserFeatureLimitRepository';
import { SubscriptionRepository } from '../repositories/SubscriptionRepository';
import { UsageRepository } from '../repositories/UsageRepository';
import { FeatureRepository } from '../repositories/FeatureRepository';

const router = Router();

// Initialize dependencies
const userFeatureLimitRepository = new UserFeatureLimitRepository();
const subscriptionRepository = new SubscriptionRepository();
const usageRepository = new UsageRepository();
const featureRepository = new FeatureRepository();

const userFeatureLimitService = new UserFeatureLimitService(
  userFeatureLimitRepository,
  subscriptionRepository,
  usageRepository,
  featureRepository
);

const userFeatureLimitController = new UserFeatureLimitController(userFeatureLimitService);

// User feature limit routes
router.get('/user/:userId', (req, res) => userFeatureLimitController.getUserFeatureLimits(req, res));
router.post('/user/:userId/feature/:featureId/check', (req, res) => userFeatureLimitController.checkFeatureUsage(req, res));
router.post('/user/:userId/recalculate', (req, res) => userFeatureLimitController.recalculateUserLimits(req, res));

export default router;