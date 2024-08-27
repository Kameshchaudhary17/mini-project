// controllers/authController.js
import bcrypt from 'bcrypt'
import jwt from'jsonwebtoken';
import User from '../models/user.js';

export const register = async (req, res) => {
  const { name, email, password, confirmPassword, address, contact, role } = req.body;
  const photo = req.file ? req.file.filename : null; // Handle file upload

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
      photo, // Save the file name in the database
    });

    const token = jwt.sign({ id: newUser.id, role: newUser.role }, 'yourSecretKey', { expiresIn: '1h' });

    return res.status(201).json({ token, user: newUser });
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

    const token = jwt.sign({ id: user.id, role: user.role }, 'yourSecretKey', { expiresIn: '1h' });

    return res.status(200).json({ token, user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};

