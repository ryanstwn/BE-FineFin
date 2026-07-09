import express from 'express';
// 👇 UPDATE: Jangan lupa import getTransactions
import { createTransaction, getTransactions, deleteTransaction, updateTransaction } from '../controllers/transactionController.js'; 
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createTransaction); 
// 👇 TAMBAHAN BARU: Pintu masuk untuk GET /api/transaction
router.get('/', protect, getTransactions); 

//pintu masuk untuk delete transaksi DELETE/api/transaction/id transaksinya
router.delete('/:id', protect, deleteTransaction);

// pintu masuk untuk update transaksi
router.put('/:id', protect, updateTransaction);

export default router;