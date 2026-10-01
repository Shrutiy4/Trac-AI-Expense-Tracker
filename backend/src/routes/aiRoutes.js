import express from 'express';
import { generateAISuggestions } from '../controllers/aiController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/suggestions', authMiddleware, generateAISuggestions);

export default router;
