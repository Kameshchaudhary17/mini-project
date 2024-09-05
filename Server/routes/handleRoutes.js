import express from 'express';
import{authenticateUser, authorizeAdmin} from '../middleware/authToken.js';
import {addResource, checkoutResource, deleteResource, getResources, returnResource, updateResource} from '../controller/resourceController.js';
import {multer, storage } from '../middleware/multerConfig.js';



const upload = multer({storage : storage})


const handleRoutes = express.Router();

// Public route (e.g., to get all resources)
handleRoutes.get('/resources', authenticateUser, getResources);

// Admin routes
handleRoutes.post('/resource', authenticateUser, upload.single('photo'), authorizeAdmin, addResource);
handleRoutes.post('/:id/checkout', authenticateUser, authorizeAdmin, checkoutResource);
handleRoutes.post('/:id/return', authenticateUser, authorizeAdmin, returnResource);

handleRoutes.delete('/resource/:id', authenticateUser, authorizeAdmin, deleteResource);
handleRoutes.put('/resource/:id', authenticateUser, authorizeAdmin, upload.single('photo'), updateResource);


export default handleRoutes;
