import Category from '../models/Category.js';
import Group from '../models/Group.js';
import Expense from '../models/Expense.js';
import User from '../models/User.js';


export const getCategories = async (req, res) => {
  const defaultCategories = [
    'bills',
    'entertainment',
    'food',
    'groceries',
    'medical',
    'shopping',
    'subscriptions',
    'transport',
    'utilities',
  ];

  try {
    const userId = req.user.id;

    // ✅ FIXED: Correct field name is `user`
    const usedCategories = await Expense.distinct('category', { user: userId });

    const customCategories = await Category.find({ createdBy: userId });
    const customCategoryNames = customCategories.map(c => c.name);

    // Cleanup: remove unused categories
    const unusedCustoms = customCategoryNames.filter(name => !usedCategories.includes(name));
    if (unusedCustoms.length > 0) {
      await Category.deleteMany({ createdBy: userId, name: { $in: unusedCustoms } });
    }

    const finalCategories = [...defaultCategories, ...usedCategories];
    const uniqueSorted = [...new Set(finalCategories.filter(Boolean))].sort((a, b) => a.localeCompare(b));

    res.json(uniqueSorted);
  } catch (err) {
    console.error('Error fetching categories', err);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
};




export const deleteGroup = async (req, res) => {
  if (!req.user || !req.user.id) {
    return res.status(401).json({ message: 'Unauthorized: user not found' });
  }

  const { name } = req.params;
  const { action } = req.query;
  const userId = req.user.id;

  if (!name) return res.status(400).json({ message: 'Group name required' });

  try {
    if (action === 'ungroup') {
      await Expense.updateMany({ group: name, createdBy: userId }, { $set: { group: 'Ungrouped' } });
    } else if (action === 'delete') {
      await Expense.deleteMany({ group: name, createdBy: userId });
    }

    // ❗️ Remove from Group collection (you missed this)
    await Group.deleteOne({ name, createdBy: userId });

    // Optional: If you're also storing group names in User model
    await User.updateOne({ _id: userId }, { $pull: { groups: name } });

    return res.json({ message: 'Group deleted successfully' });
  } catch (err) {
    console.error('Delete group error:', err);
    return res.status(500).json({ message: 'Server error deleting group' });
  }
};



export const getGroups = async (req, res) => {
  const defaultGroups = [
    'Essentials',
    'Trip',
    'Work',
    'Family',
    'Subscriptions',
    'Health',
  ];

  try {
    const userId = req.user.id;

    // ✅ 1. Custom groups from Group collection
    const customGroups = await Group.find({ createdBy: userId });
    const customGroupNames = customGroups.map(g => g.name);

    // ✅ 2. Used group names from Expense collection
    const usedGroups = await Expense.distinct('group', { user: userId });

    // Remove unused groups from DB (optional cleanup)
    const unusedCustomGroups = customGroupNames.filter(name => !usedGroups.includes(name));
    if (unusedCustomGroups.length > 0) {
      await Group.deleteMany({ createdBy: userId, name: { $in: unusedCustomGroups } });
    }


    // ✅ 3. Merge: default + used (includes any custom ones used) + saved
    const finalGroups = [...defaultGroups, ...customGroupNames, ...usedGroups];

    // ✅ 4. Filter out null/undefined + dedupe + sort
    const uniqueSorted = [...new Set(finalGroups.filter(Boolean))].sort((a, b) => a.localeCompare(b));

    res.json(uniqueSorted);
  } catch (err) {
    console.error('Error fetching groups:', err);
    res.status(500).json({ error: 'Failed to fetch groups' });
  }
};




export const addCategory = async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'Name required' });

  try {
    const exists = await Category.findOne({ name, createdBy: req.user.id });
    if (exists) return res.status(400).json({ error: 'Category already exists' });

    const category = new Category({ name, createdBy: req.user.id });
    await category.save();
    res.status(201).json(category);
  } catch (err) {
    console.error('Error adding category:', err);
    res.status(500).json({ error: 'Failed to add category' });
  }
};


export const addGroup = async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'Name required' });

  const exists = await Group.findOne({ name, createdBy: req.user.id });
  if (exists) return res.status(400).json({ error: 'Group already exists' });

  const group = new Group({ name, createdBy: req.user.id });
  await group.save();
  res.status(201).json(group);
}