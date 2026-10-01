import express from 'express'
import {
  updateTheme,
  updateNotification,
  getCurrency,
  updateCurrency,
  changePassword,
  verifyOldPassword,
  getProfile,
  updateProfile,
  getUserBudget,
  updateUserBudget,
  deleteAccount
} from '../controllers/userSettingsController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.put('/settings/theme', authMiddleware, updateTheme);
router.put('/settings/notifications', authMiddleware, updateNotification);
router.put('/settings/currency', authMiddleware, updateCurrency);
router.get('/settings/currency', authMiddleware, getCurrency);
router.put('/change-password', authMiddleware, changePassword);
router.post('/verify-password', authMiddleware, verifyOldPassword);
router.get('/profile', authMiddleware, getProfile);
router.put('/profile', authMiddleware, updateProfile);
router.get('/budget', authMiddleware, getUserBudget);
router.put('/budget', authMiddleware, updateUserBudget);

router.delete('/delete', authMiddleware, deleteAccount);

export default router;
