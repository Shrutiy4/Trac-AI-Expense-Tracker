// controllers/authController.js
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const JWT_SECRET = process.env.JWT_SECRET


// Register Controller
export const register = async (req, res) => {
  const { username, email, password } = req.body

  try {
    const existingUser = await User.findOne({ $or: [{ username }, { email }] })
    if (existingUser) {
      const conflictField = existingUser.username === username ? 'Username' : 'Email'
      return res.status(400).json({ message: `${conflictField} already in use.` })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    })

    const token = jwt.sign({ id: newUser.id }, JWT_SECRET, { expiresIn: '7d' })

    res.status(201).json({
      user: { username: newUser.username, email: newUser.email },
      token,
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error during registration.' })
  }
}

// Login Controller (by username or email)
export const login = async (req, res) => {
  const { identifier, password } = req.body // `identifier` = username or email

  try {
    const user = await User.findOne({
      $or: [{ username: identifier }, { email: identifier }],
    })

    if (!user) return res.status(400).json({ message: 'User not found' })

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) return res.status(400).json({ message: 'Incorrect password' })

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' })

    res.status(200).json({
      user: { username: user.username, email: user.email },
      token,
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error during login.' })
  }
}
