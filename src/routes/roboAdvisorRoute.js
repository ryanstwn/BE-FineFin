import express from 'express';
import { getRoboAdvisor } from '../controllers/roboAdvisorController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Endpoint: GET /api/robo-advisor/projection
router.get('/projection', protect, getRoboAdvisor);

export default router;