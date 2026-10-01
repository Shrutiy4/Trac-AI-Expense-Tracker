// backend/models/User.js
import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  theme: { type: String, default: 'autumn' },
  notificationsEnabled: { type: Boolean, default: false },
  currency: { type: String, default: 'INR' },
  weeklyBudget: { 
    type: Number, 
    default: null, 
    set: v => Math.round(v * 100) / 100  // Ensures 2 decimal places
  },
  monthlyBudget: { 
    type: Number, 
    default: null, 
    set: v => Math.round(v * 100) / 100  // Ensures 2 decimal places
  }
})

export default mongoose.model('User', userSchema)
