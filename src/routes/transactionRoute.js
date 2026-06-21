import express from 'express';
import { createTransaction } from '../controllers/transactionController.js';
import { protect } from '../middlewares/authMiddleware.js';
const router = express.Router();

router.post('/', protect, createTransaction); // Pintu masuk POST /api/transaction
export default router;