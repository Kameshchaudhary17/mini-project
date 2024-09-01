import express from 'express';
import {
  addResource,
  checkoutResource,
  returnResource,
  getResources,
} from '../controller/resourceController';

const resourceRoutes = express.Router();

router.post('/resources', addResource);
router.post('/resources/:id/checkout', checkoutResource);
router.post('/resources/:id/return', returnResource);
router.get('/resources', getResources);

export default resourceRoutes;
