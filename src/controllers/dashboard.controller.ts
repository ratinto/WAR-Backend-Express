import { Request, Response } from 'express';
import { StudentService, WashermanService } from '../services';
import { asyncHandler } from '../middleware/asyncHandler';
import { successResponse } from '../utils/responseFormatter';

/**
 * Dashboard Controllers
 */

/**
 * Student Dashboard Controller
 * GET /api/student/dashboard/:bagNo
 */
export const getStudentDashboard = asyncHandler(async (req: Request, res: Response) => {
  const { bagNo } = req.params;

  const dashboardData = await StudentService.getStudentDashboard(bagNo);

  return successResponse(res, dashboardData, undefined, 200);
});

/**
 * Washerman Dashboard Controller
 * GET /api/washerman/dashboard
 */
export const getWashermanDashboard = asyncHandler(async (_req: Request, res: Response) => {
  const dashboardData = await WashermanService.getWashermanDashboard();

  return successResponse(res, dashboardData, undefined, 200);
});
