import { Router } from 'express';
import { SubscriptionController } from '../controllers/SubscriptionController';
import { SubscriptionService } from '../services/SubscriptionService';
import { SubscriptionRepository } from '../repositories/SubscriptionRepository';
import { PlanRepository } from '../repositories/PlanRepository';
import { UserFeatureLimitService } from '../services/UserFeatureLimitService';
import { UserFeatureLimitRepository } from '../repositories/UserFeatureLimitRepository';
import { FeatureRepository } from '../repositories/FeatureRepository';

const router = Router();

// Initialize dependencies
const subscriptionRepository = new SubscriptionRepository();
const planRepository = new PlanRepository();
const userFeatureLimitRepository = new UserFeatureLimitRepository();
const featureRepository = new FeatureRepository();

const userFeatureLimitService = new UserFeatureLimitService(
  userFeatureLimitRepository,
  subscriptionRepository,
  featureRepository
);

const subscriptionService = new SubscriptionService(
  subscriptionRepository, 
  planRepository, 
  userFeatureLimitService
);
const subscriptionController = new SubscriptionController(subscriptionService);

// Subscription routes
router.post('/', (req, res) => subscriptionController.createSubscription(req, res));
router.get('/:id', (req, res) => subscriptionController.getSubscriptionById(req, res));
router.get('/user/:userId', (req, res) => subscriptionController.getSubscriptionsByUser(req, res));
router.get('/user/:userId/active', (req, res) => subscriptionController.getActiveSubscriptionsByUser(req, res));
router.put('/:id', (req, res) => subscriptionController.updateSubscription(req, res));
router.patch('/:id/cancel', (req, res) => subscriptionController.cancelSubscription(req, res));

export default router;