import express from 'express';
import { authenticateJWT } from '../../layer.js';
import { StatusController, SuspendController } from '../controllers/statusController.js';

const router = express.Router();

router.post('/statusControll', authenticateJWT, StatusController);
router.post('/suspendControll', authenticateJWT, SuspendController);

export default router;
