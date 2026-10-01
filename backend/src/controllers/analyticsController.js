// analyticsController.js
import Expense from "../models/Expense.js";

// PIE CHART – /category-this-year
export const getCategoryThisYear = async (req, res) => {
  try {
    const userId = req.user.id;
    const year = parseInt(req.query.year) || new Date().getFullYear();

    const expenses = await Expense.find({ user: userId });

    const filtered = expenses.filter(
      (e) => new Date(e.date).getFullYear() === year
    );

    const data = filtered.reduce((acc, curr) => {
      const existing = acc.find((item) => item.category === curr.category);
      if (existing) {
        existing.amount += curr.amount;
      } else {
        acc.push({ category: curr.category, amount: curr.amount });
      }
      return acc;
    }, []);

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch category data" });
  }
};

// LINE CHART – /daily-this-month
export const getDailyThisMonth = async (req, res) => {
  try {
    const userId = req.user.id;

    const year = parseInt(req.query.year) || new Date().getFullYear();
    const month = parseInt(req.query.month) || new Date().getMonth() + 1;
    const startOfMonth = new Date(year, month - 1, 1);
    const endOfMonth = new Date(year, month, 0);


    const dailyExpenses = await Expense.aggregate([
      {
        $match: {
          user: userId,
          date: { $gte: startOfMonth, $lte: endOfMonth },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%d-%m-%Y", date: "$date" }
          },
          amount: { $sum: "$amount" },
        },
      },
      {
        $sort: { _id: 1 }, // Sort by date ascending
      },
      {
        $project: {
          date: "$_id",
          amount: 1,
          _id: 0,
        },
      },
    ]);

    res.json(dailyExpenses);
  } catch (error) {
    console.error('Error in getDailyThisMonth:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// BAR CHART – /monthly-this-year
export const getMonthlyThisYear = async (req, res) => {
  try {
    const userId = req.user.id;
    const currentYear = parseInt(req.query.year) || new Date().getFullYear();

    const expenses = await Expense.find({ user: userId });

    const filtered = expenses.filter(
      (e) => new Date(e.date).getFullYear() === currentYear
    );

    const data = filtered.reduce((acc, curr) => {
      const dateObj = new Date(curr.date);
      const key = `${dateObj.toLocaleString("default", {
        month: "short",
      })} ${dateObj.getFullYear()}`;

      const existing = acc.find((item) => item.month === key);
      if (existing) {
        existing.total += curr.amount;
      } else {
        acc.push({ month: key, total: curr.amount });
      }
      return acc;
    }, []);

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch monthly data" });
  }
};
