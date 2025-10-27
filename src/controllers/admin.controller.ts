import type { Request, Response } from 'express';
import { StudentService } from '../services/student.service';
import { WashermanService } from '../services/washerman.service';
import { asyncHandler } from '../middleware/asyncHandler';
import { successResponse } from '../utils/responseFormatter';

/**
 * Get All Students
 * GET /api/admin/students
 */
export const getAllStudents = asyncHandler(async (_req: Request, res: Response) => {
  const students = await StudentService.getAllStudents();
  return successResponse(res, students, 'Students retrieved successfully', 200);
});

/**
 * Update Student
 * PUT /api/admin/students/:bagNo
 */
export const updateStudent = asyncHandler(async (req: Request, res: Response) => {
  const { bagNo } = req.params;
  const updateData = req.body;

  const student = await StudentService.updateStudent(bagNo, updateData);
  return successResponse(res, student, 'Student updated successfully', 200);
});

/**
 * Delete Student
 * DELETE /api/admin/students/:bagNo
 */
export const deleteStudent = asyncHandler(async (req: Request, res: Response) => {
  const { bagNo } = req.params;

  await StudentService.deleteStudent(bagNo);
  return successResponse(res, null, 'Student deleted successfully', 200);
});

/**
 * Get All Washermen
 * GET /api/admin/washermen
 */
export const getAllWashermen = asyncHandler(async (_req: Request, res: Response) => {
  const washermen = await WashermanService.getAllWashermen();
  return successResponse(res, washermen, 'Washermen retrieved successfully', 200);
});

/**
 * Update Washerman
 * PUT /api/admin/washermen/:id
 */
export const updateWasherman = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updateData = req.body;

  const washerman = await WashermanService.updateWasherman(parseInt(id), updateData);
  return successResponse(res, washerman, 'Washerman updated successfully', 200);
});

/**
 * Delete Washerman
 * DELETE /api/admin/washermen/:id
 */
export const deleteWasherman = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  await WashermanService.deleteWasherman(parseInt(id));
  return successResponse(res, null, 'Washerman deleted successfully', 200);
});
