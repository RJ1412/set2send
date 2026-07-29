import express from 'express';
import { requireAuth } from '../middleware/auth.middleware.js';
import * as flowsController from '../controllers/flows.controller.js';

const router = express.Router();

router.use(requireAuth);

router.post('/', flowsController.createFlow);
router.get('/', flowsController.getFlows);
router.get('/:id', flowsController.getFlowById);
router.put('/:id', flowsController.updateFlow);
router.delete('/:id', flowsController.deleteFlow);
router.post('/:id/publish', flowsController.publishFlow);
router.post('/:id/duplicate', flowsController.duplicateFlow);

export default router;
