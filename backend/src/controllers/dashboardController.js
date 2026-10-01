import express from 'express'
import Expense from '../models/Expense.js'

export const getSummary = async (req, res) => {
  try {
    const userId = req.user.id
    const today = new Date()
    const startOfDay = new Date(today.setHours(0, 0, 0, 0))
    const endOfDay = new Date(today.setHours(23, 59, 59, 999))

    const startOfWeek = new Date()
    startOfWeek.setDate(today.getDate() - today.getDay())
    startOfWeek.setHours(0, 0, 0, 0)

    const endOfWeek = new Date(startOfWeek)
    endOfWeek.setDate(startOfWeek.getDate() + 6)
    endOfWeek.setHours(23, 59, 59, 999)

    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999)

    const [todayExpenses, weeklyExpenses, monthlyExpenses, recentExpenses] = await Promise.all([
      Expense.find({
        user: userId,
        date: { $gte: startOfDay, $lte: endOfDay },
      }),
      Expense.find({
        user: userId,
        date: { $gte: startOfWeek, $lte: endOfWeek },
      }),
      Expense.find({
        user: userId,
        date: { $gte: startOfMonth, $lte: endOfMonth },
      }),
      Expense.find({ user: userId }).sort({ date: -1 }).limit(5),
    ])

    res.json({
      today: todayExpenses.reduce((sum, e) => sum + e.amount, 0),
      thisWeek: weeklyExpenses.reduce((sum, e) => sum + e.amount, 0),
      thisMonth: monthlyExpenses.reduce((sum, e) => sum + e.amount, 0),
      recent: recentExpenses.map(e => ({
        id: e._id,
        title: e.title,
        amount: e.amount,
        date: e.date.toLocaleDateString('en-GB'),
      })),
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch dashboard summary' })
  }
}



export const getCategoryBreakdown = async (req, res) => {
  try {
    const userId = req.user.id

    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999)

    const breakdown = await Expense.aggregate([
      {
        $match: {
          user: userId,
          date: { $gte: startOfMonth, $lte: endOfMonth },
        },
      },
      {
        $group: {
          _id: '$category',
          value: { $sum: '$amount' },
        },
      },
      {
        $project: {
          _id: 0,
          name: '$_id',
          value: 1,
        },
      },
      { $sort: { value: -1 } }
    ])

    res.json(breakdown)
  } catch (err) {
    console.error('Error in category breakdown:', err)
    res.status(500).json({ message: 'Failed to fetch category breakdown' })
  }
}
