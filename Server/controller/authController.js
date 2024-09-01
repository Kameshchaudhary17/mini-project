import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/user.js';

dotenv.config();

const secretKey = process.env.JWT_SECRET_KEY;

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

    if (!secretKey) {
      console.error("JWT_SECRET_KEY is not set in the environment variables");
      return res.status(500).json({ error: "Server configuration error" });
    }

    const token = jwt.sign(
      { id: newUser.id, role: newUser.role }, 
      secretKey, 
      { expiresIn: '1h' }
    );

    // Remove password from the user object before sending it in the response
    const userWithoutPassword = { ...newUser.toJSON() };
    delete userWithoutPassword.password;

    return res.status(201).json({ 
      message: "User registered successfully",
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

    if (!secretKey) {
      console.error("JWT_SECRET_KEY is not set in the environment variables");
      return res.status(500).json({ error: "Server configuration error" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role }, 
      secretKey, 
      { expiresIn: '1h' }
    );

    // Remove password from the user object before sending it in the response
    const userWithoutPassword = { ...user.toJSON() };
    delete userWithoutPassword.password;

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 3600000, // 1 hour
    });

    return res.status(200).json({ 
      message: "Logged in successfully",
      user: userWithoutPassword 
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};