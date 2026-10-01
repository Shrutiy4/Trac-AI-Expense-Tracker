import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: { type: String, required: true },
  amount: { type: Number,
    required: true,
    set: v => Math.round(v * 100) / 100  // Ensures 2 decimal places 
  },
  category: { type: String },
  date: { type: Date, default: Date.now },
  merchant: { type: String },
  paymentMethod: { type: String }, // e.g., "Credit Card", "Cash"
  inputMode: {
    type: String,
    enum: ["Manual Entry", "Image Upload"],
    default: "Manual Entry",
  },
  group: { type: String },
});

const Expense = mongoose.model("Expense", expenseSchema);

export default Expense;
