import { Router } from 'express';
import { FeatureController } from '../controllers/FeatureController';
import { FeatureService } from '../services/FeatureService';
import { FeatureRepository } from '../repositories/FeatureRepository';
import { OrganizationRepository } from '../repositories/OrganizationRepository';
import { authMiddleware, adminMiddleware } from '../middleware/authMiddleware';

const router = Router();

// Dependency injection
const featureRepository = new FeatureRepository();
const organizationRepository = new OrganizationRepository();
const featureService = new FeatureService(featureRepository, organizationRepository);
const featureController = new FeatureController(featureService);

// Protected routes
router.post('/', authMiddleware, adminMiddleware, (req, res) => featureController.createFeature(req, res));
router.put('/:id', authMiddleware, adminMiddleware, (req, res) => featureController.updateFeature(req, res));
router.delete('/:id', authMiddleware, adminMiddleware, (req, res) => featureController.deleteFeature(req, res));
router.get('/:id', authMiddleware, (req, res) => featureController.getFeatureById(req, res));
router.get('/organization/:organizationId', authMiddleware, (req, res) => featureController.getFeaturesByOrganization(req, res));
router.patch('/:id/toggle', authMiddleware, adminMiddleware, (req, res) => featureController.toggleFeatureStatus(req, res));

export default router;