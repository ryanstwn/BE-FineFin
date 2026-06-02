// routes/financialRoutes.js
import express from 'express';
import { createOnboarding } from '../controllers/onboardingController.js'; // KUNCI: Jangan lupa pakai .js di akhir kalau ES Modules!
import { protect } from '../middlewares/authMiddleware.js'; // Sesuaikan nama file middleware JWT kalian

const router = express.Router();

// Mengunci endpoint agar hanya user login yang bisa isi
router.post('/', protect, createOnboarding);

export default router; // Pakai export default