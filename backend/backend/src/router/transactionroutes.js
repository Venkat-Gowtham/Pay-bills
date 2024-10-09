import express from 'express';
import multer from 'multer';
import { submitTransaction, getTableData, getTokensById, downloadExcel , BankDetails} from '../controllers/transactioncontroller.js';
import { authenticateJWT } from '../../layer.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/submitform1', upload.none(), authenticateJWT, submitTransaction);
router.get('/getClientData/:email', authenticateJWT, getTableData);
router.get('/tokens/:email', authenticateJWT, getTokensById);
router.get('/download', authenticateJWT, downloadExcel);
router.get('/getBankData/:id', authenticateJWT, BankDetails);
export default router;
