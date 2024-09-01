import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/user.js';

dotenv.config();

// Provide a fallback secret key if the environment variable is not set
const secretKey = process.env.JWT_SECRET_KEY || 'fallback_secret_key_12345';

if (process.env.JWT_SECRET_KEY) {
  console.log("Using JWT_SECRET_KEY from environment variables");
} else {
  console.warn("WARNING: JWT_SECRET_KEY is not set in the environment variables. Using fallback secret key. This is not recommended for production use.");
}

export const register = async (req, res) => {
  const { name, email, password, confirmPassword, address, contact, role } = req.body;
  const photo = req.file ? req.file.filename : null;

  if (password !== confirmPassword) {
    return res.status(400).json({ error: "Passwords do not match" });
  }

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      address,
      contact,
      role,
      photo,
    });

    const token = jwt.sign(
      { id: newUser.id, role: newUser.role },
      secretKey,
      { expiresIn: '1h' }
    );

    const userWithoutPassword = { ...newUser.toJSON() };
    delete userWithoutPassword.password;

    let message = role === "admin" ? "Admin registered successfully" : "User registered successfully";

    return res.status(201).json({
      message,
      token,
      user: userWithoutPassword
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      secretKey,
      { expiresIn: '1h' }
    );

    const userWithoutPassword = { ...user.toJSON() };
    delete userWithoutPassword.password;

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 3600000, // 1 hour
    });

    // Make role comparison case-insensitive
    let message = user.role.toLowerCase() === "admin" 
      ? "Admin login successful: Welcome, administrator!" 
      : "User login successful: Welcome back!";

    return res.status(200).json({
      message,
      user: userWithoutPassword
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};
