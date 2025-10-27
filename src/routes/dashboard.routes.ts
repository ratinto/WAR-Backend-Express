import { Router } from 'express';
import { param } from 'express-validator';
import { validate } from '../middleware/validateRequest';
import { getStudentDashboard } from '../controllers/dashboard.controller';

const router = Router();

/**
 * Dashboard Routes
 */

// Student Dashboard - note: this will be mounted at /api/student/dashboard/:bagNo
router.get(
  '/:bagNo',
  validate([
    param('bagNo')
      .notEmpty()
      .withMessage('Bag number is required')
      .matches(/^[BG]-\d+$/)
      .withMessage('Invalid bag number format')
  ]),
  getStudentDashboard
);

export default router;
