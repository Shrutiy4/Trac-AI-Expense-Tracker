import express from 'express';
import {
    getExpenses,
    getExpense,
    addExpense,
    updateExpense,
    deleteExpense,
    getAllGroups,
    createGroup
} from '../controllers/expenseController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

router.route('/')
.get(getExpenses)
.post(addExpense);

router.route('/:id')
.get(getExpense)
.put(updateExpense)
.delete(deleteExpense);

router.get('/groups', getAllGroups);
router.post('/groups', createGroup);


export default router;