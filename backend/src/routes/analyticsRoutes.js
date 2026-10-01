import express from "express";
import {
  getCategoryThisYear,
  getDailyThisMonth,
  getMonthlyThisYear,
} from "../controllers/analyticsController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/category-this-year", authMiddleware, getCategoryThisYear);
router.get("/daily-this-month", authMiddleware, getDailyThisMonth);
router.get("/monthly-this-year", authMiddleware, getMonthlyThisYear);

export default router;
