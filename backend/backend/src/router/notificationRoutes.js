// routes/notificationRoutes.js
const express = require('express');
const router = express.Router();
const {sendNotification}= require('../controllers/notificationcontroller');

// POST /api/notifications
router.post('/notifications', sendNotification);

module.exports = router;
