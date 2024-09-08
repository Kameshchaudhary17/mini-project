import User from '../models/user.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const secretKey = process.env.JWT_SECRET_KEY || 'fallback_secret_key_12345';

// Get Profile
export const getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const userWithoutPassword = { ...user.toJSON() };
    delete userWithoutPassword.password;

    return res.status(200).json(userWithoutPassword);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
};

// Update Profile
export const updateProfile = async (req, res) => {
  try {
    const { name, email, password, address, contact, role } = req.body;
    const photo = req.file ? req.file.filename : null;

    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (password) {
      if (password.length < 8) {
        return res.status(400).json({ error: 'Password must be at least 8 characters long' });
      }
      user.password = await bcrypt.hash(password, 10);
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.address = address || user.address;
    user.contact = contact || user.contact;
    user.role = role || user.role;
    if (photo) user.photo = photo;

    await user.save();
    
    const updatedUser = { ...user.toJSON() };
    delete updatedUser.password;

    return res.status(200).json(updatedUser);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
};

// Delete Profile
export const deleteProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    await user.destroy();
    return res.status(200).json({ message: 'User profile deleted successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
};
