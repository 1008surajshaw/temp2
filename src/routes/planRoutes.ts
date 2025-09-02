import { Router } from 'express';
import { PlanController } from '../controllers/PlanController';
import { PlanService } from '../services/PlanService';
import { PlanRepository } from '../repositories/PlanRepository';
import { FeatureRepository } from '../repositories/FeatureRepository';

const router = Router();

// Initialize dependencies
const planRepository = new PlanRepository();
const featureRepository = new FeatureRepository();
const planService = new PlanService(planRepository, featureRepository);
const planController = new PlanController(planService);

// Plan routes
router.post('/', (req, res) => planController.createPlan(req, res));
router.get('/:id', (req, res) => planController.getPlanById(req, res));
router.get('/organization/:organizationId', (req, res) => planController.getPlansByOrganization(req, res));
router.put('/:id', (req, res) => planController.updatePlan(req, res));
router.delete('/:id', (req, res) => planController.deletePlan(req, res));

export default router;