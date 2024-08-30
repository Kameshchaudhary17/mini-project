import express from 'express';
import {multer, storage} from '../middleware/multerConfig.js';
import {
    addResource,
    checkoutResource,
    returnResource,
    getResources
} from '../controller/resourceController.js';

const upload = multer({storage : storage})

const handleRoutes = express.Router();

handleRoutes.post('/resource', upload.single('photo'), addResource);
handleRoutes.post('/resource/:id/checkout', checkoutResource);
handleRoutes.post('/resource/:id/return', returnResource);
handleRoutes.get('/resources', getResources);

export default handleRoutes;
