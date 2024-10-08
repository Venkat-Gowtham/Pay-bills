const express = require("express");
const multer = require("multer");
const {
  submitTransaction,
  getTableData,
  getTokensById,
  downloadExcel,
} = require("../controllers/transactionController");
const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });
const { authenticateJWT } = require("../../layer.js");

router.post("/submitform1", upload.none(), authenticateJWT, submitTransaction);
router.get("/getClientData/:email", authenticateJWT, getTableData);
router.get("/tokens/:email", authenticateJWT, getTokensById);
router.get("/download", authenticateJWT, downloadExcel);

module.exports = router;
