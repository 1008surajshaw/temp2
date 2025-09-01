import { Router } from 'express';
import { FeatureController } from '../controllers/FeatureController';
import { FeatureService } from '../services/FeatureService';
import { FeatureRepository } from '../repositories/FeatureRepository';
import { OrganizationRepository } from '../repositories/OrganizationRepository';

const router = Router();

// Dependency injection
const featureRepository = new FeatureRepository();
const organizationRepository = new OrganizationRepository();
const featureService = new FeatureService(featureRepository, organizationRepository);
const featureController = new FeatureController(featureService);

// Routes
router.post('/', (req, res) => featureController.createFeature(req, res));
router.put('/:id', (req, res) => featureController.updateFeature(req, res));
router.delete('/:id', (req, res) => featureController.deleteFeature(req, res));
router.get('/:id', (req, res) => featureController.getFeatureById(req, res));
router.get('/organization/:organizationId', (req, res) => featureController.getFeaturesByOrganization(req, res));
router.patch('/:id/toggle', (req, res) => featureController.toggleFeatureStatus(req, res));

export default router;