import express from 'express';
import { requireAuth } from '../middleware/auth.middleware.js';
import { requireFeature } from '../services/entitlement.service.js';
import * as analyticsController from '../controllers/analytics.controller.js';

const router = express.Router();

router.use(requireAuth);
router.use(requireFeature("an"));

router.get('/dashboard', analyticsController.dashboardMetrics);
router.get('/timeseries', analyticsController.timeseries);
router.get('/funnel', analyticsController.funnel);
router.get('/flows', analyticsController.flows);
router.get('/posts', analyticsController.posts);
router.get('/sources', analyticsController.sources);
router.get('/projection', analyticsController.projection);
router.get('/suggestions', requireFeature('ai'), analyticsController.suggestions);
router.get('/hourly', analyticsController.hourly);
router.get('/weekday', analyticsController.weekday);
router.get('/cohort', analyticsController.cohort);

export default router;
