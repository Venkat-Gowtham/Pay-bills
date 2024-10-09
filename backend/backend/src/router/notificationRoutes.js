import express from 'express';
import { sendNotification } from '../controllers/notificationcontroller.js';

const router = express.Router();

// POST /api/notifications
router.post('/notifications', sendNotification);

export default router;
