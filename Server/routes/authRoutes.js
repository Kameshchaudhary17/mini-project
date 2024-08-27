import express from 'express';
import {login, register } from '../controller/authController.js';
import {multer, storage } from '../middleware/multerConfig.js';



const upload = multer({storage : storage})

const authRoutes = express.Router();

authRoutes.post('/login', login)
authRoutes.post('/register', upload.single('photo'), register)


export default authRoutes;