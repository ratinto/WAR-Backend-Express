import { Request, Response } from 'express';
import { StudentService, WashermanService } from '../services';
import { asyncHandler } from '../middleware/asyncHandler';
import { successResponse } from '../utils/responseFormatter';

/**
 * Authentication Controllers
 */

/**
 * Student Login Controller
 * POST /api/auth/student/login
 */
export const studentLogin = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const student = await StudentService.loginStudent({ email, password });

  return successResponse(res, student, 'Login successful', 200);
});

/**
 * Student Signup Controller
 * POST /api/auth/student/signup
 */
export const studentSignup = asyncHandler(async (req: Request, res: Response) => {
  const { bagNo, name, email, enrollmentNo, password, phoneNo, residencyNo } = req.body;

  const student = await StudentService.createStudent({
    bagNo,
    name,
    email,
    enrollmentNo,
    password,
    phoneNo,
    residencyNo
  });

  return successResponse(res, student, 'Student registered successfully', 201);
});

/**
 * Washerman Login Controller
 * POST /api/auth/washerman/login
 */
export const washermanLogin = asyncHandler(async (req: Request, res: Response) => {
  const { username, password } = req.body;

  const washerman = await WashermanService.loginWasherman({ username, password });

  return successResponse(res, washerman, 'Login successful', 200);
});

/**
 * Washerman Signup Controller
 * POST /api/auth/washerman/signup
 */
export const washermanSignup = asyncHandler(async (req: Request, res: Response) => {
  const { username, password } = req.body;

  const washerman = await WashermanService.createWasherman({ username, password });

  return successResponse(res, washerman, 'Washerman registered successfully', 201);
});
