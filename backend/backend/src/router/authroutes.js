// const express = require('express');
// const { login } = require('../controllers/authController');
// const router = express.Router();

// router.post('/login', login);

// module.exports = router;

import express from 'express';
import { login } from '../controllers/authcontroller.js';

const router = express.Router();

router.post('/login', login);

export default router;
