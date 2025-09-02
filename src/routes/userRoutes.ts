import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { UserService } from '../services/UserService';
import { UserRepository } from '../repositories/UserRepository';
import { authMiddleware, adminMiddleware } from '../middleware/authMiddleware';

const router = Router();

// Dependency injection
const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const userController = new UserController(userService);

// Protected routes
router.get('/', authMiddleware, adminMiddleware, (req, res) => userController.getAllUsers(req, res));
router.get('/:id', authMiddleware, (req, res) => userController.getUserById(req, res));
router.post('/', authMiddleware, adminMiddleware, (req, res) => userController.createUser(req, res));
router.put('/:id', authMiddleware, (req, res) => userController.updateUser(req, res));
router.delete('/:id', authMiddleware, adminMiddleware, (req, res) => userController.deleteUser(req, res));

export default router;