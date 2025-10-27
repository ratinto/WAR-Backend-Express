import { Router } from 'express';
import { body } from 'express-validator';
import { validate } from '../middleware/validateRequest';
import {
  studentLogin,
  studentSignup,
  washermanLogin,
  washermanSignup
} from '../controllers/auth.controller';

const router = Router();

/**
 * Student Authentication Routes
 */

// Student Login
router.post(
  '/student/login',
  validate([
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required')
  ]),
  studentLogin
);

// Student Signup
router.post(
  '/student/signup',
  validate([
    body('bagNo')
      .notEmpty()
      .withMessage('Bag number is required')
      .matches(/^[BG]-\d+$/)
      .withMessage('Bag number must start with B- or G- followed by numbers'),
    body('name').notEmpty().trim().withMessage('Name is required'),
    body('email')
      .isEmail()
      .withMessage('Valid email is required')
      .custom((value) => {
        if (!value.endsWith('rishihood.edu.in')) {
          throw new Error('Please use your Rishihood University email');
        }
        return true;
      }),
    body('enrollmentNo').notEmpty().trim().withMessage('Enrollment number is required'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long'),
    body('phoneNo').notEmpty().trim().withMessage('Phone number is required'),
    body('residencyNo').notEmpty().trim().withMessage('Residency number is required')
  ]),
  studentSignup
);

/**
 * Washerman Authentication Routes
 */

// Washerman Login
router.post(
  '/washerman/login',
  validate([
    body('username').notEmpty().trim().withMessage('Username is required'),
    body('password').notEmpty().withMessage('Password is required')
  ]),
  washermanLogin
);

// Washerman Signup
router.post(
  '/washerman/signup',
  validate([
    body('username').notEmpty().trim().withMessage('Username is required'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long')
  ]),
  washermanSignup
);

export default router;
