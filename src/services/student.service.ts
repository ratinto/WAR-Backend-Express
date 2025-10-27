import prisma from '../config/database';
import { hashPassword, comparePassword } from '../utils/passwordHash';
import {
  validateEmailDomain,
  validateBagNumber,
  validateEmail,
  sanitizeString
} from '../utils/validators';
import { BadRequestError, NotFoundError, ConflictError } from '../middleware/asyncHandler';

export interface CreateStudentData {
  bagNo: string;
  name: string;
  email: string;
  enrollmentNo: string;
  password: string;
  phoneNo: string;
  residencyNo: string;
}

export interface StudentLoginData {
  email: string;
  password: string;
}

/**
 * Student Service - Handles all student-related business logic
 */
export class StudentService {
  /**
   * Create a new student
   */
  static async createStudent(data: CreateStudentData) {
    // Validate email domain
    if (!validateEmailDomain(data.email)) {
      throw new BadRequestError('Please use your Rishihood University email');
    }

    // Validate email format
    if (!validateEmail(data.email)) {
      throw new BadRequestError('Invalid email format');
    }

    // Validate bag number format
    if (!validateBagNumber(data.bagNo)) {
      throw new BadRequestError('Bag number must start with B- or G- followed by numbers');
    }

    // Sanitize inputs
    const sanitizedData = {
      bagNo: sanitizeString(data.bagNo),
      name: sanitizeString(data.name),
      email: data.email.toLowerCase().trim(),
      enrollmentNo: sanitizeString(data.enrollmentNo),
      phoneNo: sanitizeString(data.phoneNo),
      residencyNo: sanitizeString(data.residencyNo),
      password: await hashPassword(data.password)
    };

    // Check for existing student
    const existingStudent = await prisma.student.findFirst({
      where: {
        OR: [
          { email: sanitizedData.email },
          { enrollmentNo: sanitizedData.enrollmentNo },
          { bagNo: sanitizedData.bagNo }
        ]
      }
    });

    if (existingStudent) {
      if (existingStudent.email === sanitizedData.email) {
        throw new ConflictError('Email already exists');
      }
      if (existingStudent.enrollmentNo === sanitizedData.enrollmentNo) {
        throw new ConflictError('Enrollment number already exists');
      }
      if (existingStudent.bagNo === sanitizedData.bagNo) {
        throw new ConflictError('Bag number already exists');
      }
    }

    // Create student
    const student = await prisma.student.create({
      data: sanitizedData,
      select: {
        bagNo: true,
        name: true,
        email: true,
        enrollmentNo: true,
        phoneNo: true,
        residencyNo: true,
        createdAt: true
      }
    });

    return student;
  }

  /**
   * Student login
   */
  static async loginStudent(loginData: StudentLoginData) {
    const { email, password } = loginData;

    // Find student by email
    const student = await prisma.student.findUnique({
      where: { email: email.toLowerCase().trim() }
    });

    if (!student) {
      throw new BadRequestError('Invalid email or password');
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, student.password);
    if (!isPasswordValid) {
      throw new BadRequestError('Invalid email or password');
    }

    // Return student data (without password)
    const { password: _, ...studentData } = student;
    return studentData;
  }

  /**
   * Get student by bag number
   */
  static async getStudentByBagNo(bagNo: string) {
    const student = await prisma.student.findUnique({
      where: { bagNo },
      select: {
        bagNo: true,
        name: true,
        email: true,
        enrollmentNo: true,
        phoneNo: true,
        residencyNo: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!student) {
      throw new NotFoundError('Student not found');
    }

    return student;
  }

  /**
   * Get student dashboard data
   */
  static async getStudentDashboard(bagNo: string) {
    // Get student
    const student = await this.getStudentByBagNo(bagNo);

    // Get orders with aggregations
    const orders = await prisma.order.findMany({
      where: { bagNo },
      orderBy: { createdAt: 'desc' }
    });

    const totalOrders = orders.length;
    const pendingOrders = orders.filter(o => o.status === 'PENDING').length;
    const inprogressOrders = orders.filter(o => o.status === 'INPROGRESS').length;
    const completeOrders = orders.filter(o => o.status === 'COMPLETE').length;
    const recentOrders = orders.slice(0, 5);

    return {
      student,
      totalOrders,
      pendingOrders,
      inprogressOrders,
      completeOrders,
      recentOrders
    };
  }

  /**
   * Check if student exists
   */
  static async studentExists(bagNo: string): Promise<boolean> {
    const count = await prisma.student.count({
      where: { bagNo }
    });
    return count > 0;
  }

  /**
   * Get all students
   */
  static async getAllStudents() {
    const students = await prisma.student.findMany({
      select: {
        bagNo: true,
        name: true,
        email: true,
        enrollmentNo: true,
        phoneNo: true,
        residencyNo: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: { createdAt: 'desc' }
    });

    return students;
  }

  /**
   * Update student
   */
  static async updateStudent(bagNo: string, updateData: Partial<CreateStudentData>) {
    // Check if student exists
    const existingStudent = await prisma.student.findUnique({
      where: { bagNo }
    });

    if (!existingStudent) {
      throw new NotFoundError('Student not found');
    }

    // Prepare update data
    const dataToUpdate: any = {};

    if (updateData.name) {
      dataToUpdate.name = sanitizeString(updateData.name);
    }

    if (updateData.email) {
      if (!validateEmailDomain(updateData.email)) {
        throw new BadRequestError('Please use your Rishihood University email');
      }
      if (!validateEmail(updateData.email)) {
        throw new BadRequestError('Invalid email format');
      }
      dataToUpdate.email = updateData.email.toLowerCase().trim();
    }

    if (updateData.phoneNo) {
      dataToUpdate.phoneNo = sanitizeString(updateData.phoneNo);
    }

    if (updateData.residencyNo) {
      dataToUpdate.residencyNo = sanitizeString(updateData.residencyNo);
    }

    if (updateData.enrollmentNo) {
      dataToUpdate.enrollmentNo = sanitizeString(updateData.enrollmentNo);
    }

    if (updateData.password) {
      dataToUpdate.password = await hashPassword(updateData.password);
    }

    // Update student
    const updatedStudent = await prisma.student.update({
      where: { bagNo },
      data: dataToUpdate,
      select: {
        bagNo: true,
        name: true,
        email: true,
        enrollmentNo: true,
        phoneNo: true,
        residencyNo: true,
        createdAt: true,
        updatedAt: true
      }
    });

    return updatedStudent;
  }

  /**
   * Delete student
   */
  static async deleteStudent(bagNo: string) {
    // Check if student exists
    const existingStudent = await prisma.student.findUnique({
      where: { bagNo }
    });

    if (!existingStudent) {
      throw new NotFoundError('Student not found');
    }

    // Delete associated orders first
    await prisma.order.deleteMany({
      where: { bagNo }
    });

    // Delete student
    await prisma.student.delete({
      where: { bagNo }
    });

    return { message: 'Student deleted successfully' };
  }
}
