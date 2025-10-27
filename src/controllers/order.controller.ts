import { Request, Response } from 'express';
import { OrderService } from '../services';
import { asyncHandler } from '../middleware/asyncHandler';
import { successResponse } from '../utils/responseFormatter';

/**
 * Order Controllers
 */

/**
 * Create Order Controller
 * POST /api/orders/create
 */
export const createOrder = asyncHandler(async (req: Request, res: Response) => {
  const { bagNo, numberOfClothes } = req.body;

  const order = await OrderService.createOrder({ bagNo, numberOfClothes });

  return successResponse(res, order, 'Order created successfully', 201);
});

/**
 * Get Student Orders Controller
 * GET /api/orders/student/:bagNo
 */
export const getStudentOrders = asyncHandler(async (req: Request, res: Response) => {
  const { bagNo } = req.params;

  const orders = await OrderService.getStudentOrders(bagNo);

  return successResponse(res, orders, undefined, 200);
});

/**
 * Get All Orders Controller
 * GET /api/orders/all
 */
export const getAllOrders = asyncHandler(async (_req: Request, res: Response) => {
  const orders = await OrderService.getAllOrders();

  return successResponse(res, orders, undefined, 200);
});

/**
 * Get Pending Orders Controller
 * GET /api/orders/pending
 */
export const getPendingOrders = asyncHandler(async (_req: Request, res: Response) => {
  const orders = await OrderService.getPendingOrders();

  return successResponse(res, orders, undefined, 200);
});

/**
 * Update Order Status Controller
 * PUT /api/orders/:orderId/status
 */
export const updateOrderStatus = asyncHandler(async (req: Request, res: Response) => {
  const { orderId } = req.params;
  const { status } = req.body;

  const order = await OrderService.updateOrderStatus(parseInt(orderId), status);

  return successResponse(res, order, 'Order status updated successfully', 200);
});

/**
 * Update Order Count Controller
 * PUT /api/orders/:orderId/count
 */
export const updateOrderCount = asyncHandler(async (req: Request, res: Response) => {
  const { orderId } = req.params;
  const { numberOfClothes } = req.body;

  const order = await OrderService.updateOrderCount(parseInt(orderId), numberOfClothes);

  return successResponse(res, order, 'Order count updated successfully', 200);
});
