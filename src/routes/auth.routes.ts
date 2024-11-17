import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';

const router = Router();
const authController = new AuthController();

router.post('/users', (req, res) => authController.createOrUpdateUser(req, res));
router.get('/users/email/:email', (req, res) => authController.getUserByEmail(req, res));



export default router;
