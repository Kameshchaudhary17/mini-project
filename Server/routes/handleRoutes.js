import express from 'express';


import {multer, storage} from "../middleware/multerConfig.js"
import { addResource, checkoutResource, getResources, returnResource } from '../controller/resourceController.js';
import { authenticateUser, authorizeAdmin } from '../middleware/authToken.js';
const upload = multer({storage : storage})

const handleRoutes = express.Router();

handleRoutes.post('/', authenticateUser, authorizeAdmin, upload.single('photo'), addResource);
handleRoutes.post('/:id/checkout', authenticateUser, authorizeAdmin, checkoutResource);
handleRoutes.post('/:id/return', authenticateUser, authorizeAdmin, returnResource);
handleRoutes.get('/', authenticateUser, getResources);

export default handleRoutes;