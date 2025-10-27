import { Router } from 'express';
import { body, param } from 'express-validator';
import { validate } from '../middleware/validateRequest';
import {
  createOrder,
  getStudentOrders,
  getAllOrders,
  getPendingOrders,
  updateOrderStatus,
  updateOrderCount
} from '../controllers/order.controller';

const router = Router();

/**
 * Order Routes
 */

// Create Order
router.post(
  '/create',
  validate([
    body('bagNo').notEmpty().withMessage('Bag number is required'),
    body('numberOfClothes')
      .isInt({ min: 1, max: 50 })
      .withMessage('Number of clothes must be between 1 and 50')
  ]),
  createOrder
);

// Get Student Orders
router.get(
  '/student/:bagNo',
  validate([
    param('bagNo')
      .notEmpty()
      .withMessage('Bag number is required')
      .matches(/^[BG]-\d+$/)
      .withMessage('Invalid bag number format')
  ]),
  getStudentOrders
);

// Get All Orders
router.get('/all', getAllOrders);

// Get Pending Orders
router.get('/pending', getPendingOrders);

// Update Order Status
router.put(
  '/:orderId/status',
  validate([
    param('orderId').isInt().withMessage('Invalid order ID'),
    body('status')
      .isIn(['pending', 'inprogress', 'complete'])
      .withMessage('Status must be pending, inprogress, or complete')
  ]),
  updateOrderStatus
);

// Update Order Count
router.put(
  '/:orderId/count',
  validate([
    param('orderId').isInt().withMessage('Invalid order ID'),
    body('numberOfClothes')
      .isInt({ min: 1, max: 50 })
      .withMessage('Number of clothes must be between 1 and 50')
  ]),
  updateOrderCount
);

export default router;
