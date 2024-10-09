import express from 'express';
import { getUserData } from '../controllers/usercontroller.js';

const router = express.Router();

router.get('/userdata/:email', getUserData);

export default router;
