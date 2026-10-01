import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { addCategory, addGroup, deleteGroup, getCategories, getGroups } from '../controllers/metaController.js';

const router = express.Router();

// Get all categories for user
router.get('/categories', authMiddleware, getCategories);

// Get all groups for user
router.get('/groups', authMiddleware, getGroups);

// Delete group
router.delete('/groups/:name', authMiddleware, deleteGroup);

// Add a new category
router.post('/categories', authMiddleware, addCategory);

// Add a new group
router.post('/groups', authMiddleware, addGroup);

export default router;
