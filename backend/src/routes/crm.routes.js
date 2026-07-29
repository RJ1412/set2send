import express from 'express';
import { requireAuth } from '../middleware/auth.middleware.js';
import * as crmController from '../controllers/crm.controller.js';

const router = express.Router();

router.use(requireAuth);

router.get('/leads', crmController.getLeads);
router.get('/leads/export', crmController.exportLeads);
router.get('/leads/:id', crmController.getLeadById);
router.patch('/leads/:id', crmController.updateLead);
router.post('/leads/:id/notes', crmController.addNote);
router.delete('/leads/:id/notes/:noteId', crmController.deleteNote);
router.post('/leads/:id/tags', crmController.addTag);
router.delete('/leads/:id/tags/:tagId', crmController.deleteTag);
router.post('/leads/bulk', crmController.bulkAction);

export default router;
