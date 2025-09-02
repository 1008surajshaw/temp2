import { Router } from 'express';
import { UsageController } from '../controllers/UsageController';
import { UsageService } from '../services/UsageService';
import { UsageRepository } from '../repositories/UsageRepository';
import { FeatureRepository } from '../repositories/FeatureRepository';

const router = Router();

// Initialize dependencies
const usageRepository = new UsageRepository();
const featureRepository = new FeatureRepository();
const usageService = new UsageService(usageRepository, featureRepository);
const usageController = new UsageController(usageService);

// Usage routes
router.post('/', (req, res) => usageController.createUsage(req, res));
router.get('/:id', (req, res) => usageController.getUsageById(req, res));
router.get('/user/:userId', (req, res) => usageController.getUsageByUser(req, res));
router.get('/user/:userId/feature/:featureId', (req, res) => usageController.getUsageByUserAndFeature(req, res));
router.get('/user/:userId/feature/:featureId/total', (req, res) => usageController.getTotalUsageByUserAndFeature(req, res));
router.put('/:id', (req, res) => usageController.updateUsage(req, res));

export default router;