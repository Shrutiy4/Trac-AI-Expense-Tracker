import express from 'express'
import authMiddleware from '../middleware/authMiddleware.js' // your auth middleware
import { getSummary, getCategoryBreakdown } from '../controllers/dashboardController.js'

const router = express.Router()

router.get('/summary', authMiddleware, getSummary);
router.get('/category-breakdown', authMiddleware, getCategoryBreakdown);

export default router
