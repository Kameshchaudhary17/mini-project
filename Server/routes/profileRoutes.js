import express from 'express';
import { getProfile, updateProfile, deleteProfile } from '../controller/profileController.js';
import { authenticateUser } from '../middleware/authToken.js';
import { multer, storage } from '../middleware/multerConfig.js';

const upload = multer({ storage : storage });
const profileRoutes = express.Router();

// Get profile
profileRoutes.get('/profile', authenticateUser, getProfile);

// Update profile
profileRoutes.put('/profile/:id', authenticateUser, upload.single('photo'), updateProfile);

// Delete profile
profileRoutes.delete('/profile/:id', authenticateUser, deleteProfile);

export default profileRoutes;
