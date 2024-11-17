import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';

const router = Router();
const authController = new AuthController();

router.post('/users', authController.createOrUpdateUser);
router.get('/users/email/:email', authController.getUserByEmail);



export default router;
