import { Router } from 'express';
import { OrganizationController } from '../controllers/OrganizationController';
import { OrganizationService } from '../services/OrganizationService';
import { OrganizationRepository } from '../repositories/OrganizationRepository';

const router = Router();

// Dependency injection
const organizationRepository = new OrganizationRepository();
const organizationService = new OrganizationService(organizationRepository);
const organizationController = new OrganizationController(organizationService);

// Routes - Only update allowed
router.put('/:id', (req, res) => organizationController.updateOrganization(req, res));
router.get('/:id', (req, res) => organizationController.getOrganizationById(req, res));

export default router;