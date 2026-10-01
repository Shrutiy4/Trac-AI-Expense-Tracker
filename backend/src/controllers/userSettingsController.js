import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Expense from '../models/Expense.js';
import Group from '../models/Group.js';

// Theme
export const updateTheme = async (req, res) => {
  await User.findByIdAndUpdate(req.user.id, { theme: req.body.theme });
  res.json({ message: 'Theme updated' });
};

// Notifications
export const updateNotification = async (req, res) => {
  await User.findByIdAndUpdate(req.user.id, { notificationsEnabled: req.body.enabled });
  res.json({ message: 'Notifications setting updated' });
};

// Get user's currency
export const getCurrency = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('currency');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ currency: user.currency || 'INR' }); // default fallback if null
  } catch (err) {
    console.error('Error fetching currency:', err);
    res.status(500).json({ message: 'Failed to fetch currency' });
  }
};


// Update Currency
export const updateCurrency = async (req, res) => {
  await User.findByIdAndUpdate(req.user.id, { currency: req.body.currency });
  res.json({ message: 'Currency updated' });
};

// Change password route handler
export const changePassword = async (req, res) => {
  const userId = req.user.id;
  const { oldPassword, newPassword } = req.body;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Old password is incorrect' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Password change error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};


// Verify password
export const verifyOldPassword = async (req, res) => {
  const userId = req.user.id;
  const { oldPassword } = req.body;

  // ✅ Add this guard clause
  if (!oldPassword) {
    return res.status(400).json({ message: 'Old password is required' });
  }

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Old password is incorrect' });
    }

    res.json({ message: 'Password verified' });
  } catch (error) {
    console.error('Password verification error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};


export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('username email');
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id; // Extracted by authMiddleware
    const { username, email } = req.body;

    if (!username && !email) {
      return res.status(400).json({ message: 'Nothing to update' });
    }

    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: 'User not found' });

    // Update fields if provided
    if (username) user.username = username;

    if (email && !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    if (email) user.email = email;

    await user.save();

    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
    });
  } catch (err) {
    console.error('Update profile error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};



export const getUserBudget = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('weeklyBudget monthlyBudget')
    if (!user) return res.status(404).json({ message: 'User not found' })

    res.json({
      weeklyBudget: user.weeklyBudget,
      monthlyBudget: user.monthlyBudget
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}


export const updateUserBudget = async (req, res) => {
  try {
    const { weeklyBudget, monthlyBudget } = req.body

    const user = await User.findById(req.user.id)
    if (!user) return res.status(404).json({ message: 'User not found' })

    if (weeklyBudget !== undefined) user.weeklyBudget = weeklyBudget
    if (monthlyBudget !== undefined) user.monthlyBudget = monthlyBudget

    await user.save()

    res.json({
      message: 'Budgets updated successfully',
      weeklyBudget: user.weeklyBudget,
      monthlyBudget: user.monthlyBudget
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}


export const deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id;

    // Delete user-related data (optional: cascade delete)
    await Expense.deleteMany({ user: userId });
    await Group.deleteMany({ user: userId });

    // Delete user account
    await User.findByIdAndDelete(userId);

    res.status(200).json({ message: 'Account deleted successfully' });
  } catch (err) {
    console.error('Delete account error:', err);
    res.status(500).json({ message: 'Failed to delete account' });
  }
};