import Expense from "../models/Expense.js";
import Group from '../models/Group.js';

export const getExpenses = async (req, res) => {
    try {
        // console.log("Authenticated user:", req.user); // ✅ Confirm user is attached
        // console.log("req.user.id:", req.user.id);
        const expenses = await Expense.find({ user: req.user.id }).sort({ date: -1, _id: -1 }); // Sort by date descending, then by creation time;
        res.json(expenses);
    } catch (error) {
        console.log("Error in getExpenses:",error);
        res.status(500).json({ message: "Failed to fetch expenses" });
        return res.status(500).json({ message: "Internal Server Error" });
    }
    
};

export const getExpense = async (req, res) => {
    try {
        const expense = await Expense.findById(req.params.id);
        if (!expense || expense.user.toString() !== req.user.id.toString()) {
            return res.status(404).json({ message: 'Expense not found' });
        }
        res.json(expense);
    } catch (error) {
        console.log("Error in getExpense:",error);
    }
};

export const addExpense = async (req, res) => {
  try {
    const {
      title,
      amount,
      date,
      merchant,
      paymentMethod,
      category,
      group,
      inputMode
    } = req.body;

    const newExpense = new Expense({
      user: req.user.id, // ← `req.user` was set by authMiddleware
      title,
      amount,
      date,
      merchant,
      paymentMethod,
      category,
      group,
      inputMode,
    });

    await newExpense.save();
    res.status(201).json({ message: 'Expense added', expense: newExpense });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error adding expense' });
  }
};

export const updateExpense = async (req, res) => {
    try {
        const expense = await Expense.findById(req.params.id);
        if (!expense || expense.user.toString() !== req.user.id.toString()) {
            return res.status(404).json({ message: 'Expense not found' });
        }
        const updated = await Expense.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updated);
    } catch (error) {
        console.log("Error in updateExpense:",error);
    }
};

// DELETE an expense
export const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense || expense.user.toString() !== req.user.id.toString()) {
      return res.status(404).json({ message: "Expense not found" });
    }

    await expense.deleteOne(); // ✅ recommended when you already have the document
    // await Expense.findByIdAndDelete(req.params.id); // ✅ if you're fine refetching the document

    console.log("Expense deleted");
    res.json({ message: "Expense deleted" });
  } catch (error) {
    console.error("Error in deleteExpense:", error);
    res.status(500).json({ message: "Error deleting expense" });
  }
};


export const createGroup = async (req, res) => {
  const { name } = req.body;
  const userId = req.user.id;

  if (!name || name.trim() === '')
    return res.status(400).json({ message: 'Group name is required' });

  try {
    const group = await Group.findOne({ user: userId, name });
    if (group) return res.status(400).json({ message: 'Group already exists' });

    const newGroup = new Group({ user: userId, name });
    await newGroup.save();

    res.status(201).json(newGroup);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create group' });
  }
};


export const getAllGroups = async (req, res) => {
  try {
    const userId = req.user.id;

    const usedGroups = await Expense.distinct('group', { user: userId, group: { $ne: null } });

    const allGroups = await Group.find({ user: userId });
    const usedGroupSet = new Set(usedGroups);

    // Filter out groups not in use
    const filtered = allGroups.filter((g) => usedGroupSet.has(g.name));

    // Optional: Delete unused groups
    const unused = allGroups.filter((g) => !usedGroupSet.has(g.name));
    const unusedIds = unused.map((g) => g._id);
    if (unusedIds.length > 0) {
      await Group.deleteMany({ _id: { $in: unusedIds } });
    }

    res.json(filtered.map((g) => g.name));
  } catch (err) {
    console.error("Error fetching groups:", err);
    res.status(500).json({ message: "Failed to fetch groups" });
  }
};


export const getAllCategories = async (req, res) => {
  try {
    const userId = req.user.id;
    const usedCategories = await Expense.distinct('category', { user: userId });

    res.json(usedCategories.sort());
  } catch (err) {
    console.error("Error fetching categories:", err);
    res.status(500).json({ message: "Failed to fetch categories" });
  }
};
