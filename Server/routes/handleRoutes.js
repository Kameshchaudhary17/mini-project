import express from 'express';
import{authenticateUser, authorizeAdmin} from '../middleware/authToken.js';
import {addResource, checkoutResource, getResources, returnResource} from '../controller/resourceController.js';


const handleRoutes = express.Router();

// Public route (e.g., to get all resources)
handleRoutes.get('/', authenticateUser, getResources);

// Admin routes
handleRoutes.post('/resource', authenticateUser, authorizeAdmin, addResource);
handleRoutes.post('/:id/checkout', authenticateUser, authorizeAdmin, checkoutResource);
handleRoutes.post('/:id/return', authenticateUser, authorizeAdmin, returnResource);

export default handleRoutes;
