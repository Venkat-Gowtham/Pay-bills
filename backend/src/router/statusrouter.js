const express = require("express");
const { authenticateJWT } = require("../../layer.js");
const router = express.Router();
const {
  StatusController,
  SuspendController,
} = require("../controllers/statusController.js");

router.post("/statusControll", authenticateJWT, StatusController);
router.post("/suspendControll", authenticateJWT, SuspendController);

module.exports = router;
