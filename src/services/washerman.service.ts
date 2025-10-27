import prisma from '../config/database';
import { hashPassword, comparePassword } from '../utils/passwordHash';
import { sanitizeString } from '../utils/validators';
import { BadRequestError, ConflictError } from '../middleware/asyncHandler';

export interface CreateWashermanData {
  username: string;
  password: string;
}

export interface WashermanLoginData {
  username: string;
  password: string;
}

/**
 * Washerman Service - Handles all washerman-related business logic
 */
export class WashermanService {
  /**
   * Create a new washerman
   */
  static async createWasherman(data: CreateWashermanData) {
    // Sanitize username
    const username = sanitizeString(data.username);

    // Check if username already exists
    const existingWasherman = await prisma.washerman.findUnique({
      where: { username }
    });

    if (existingWasherman) {
      throw new ConflictError('Username already exists');
    }

    // Hash password
    const hashedPassword = await hashPassword(data.password);

    // Create washerman
    const washerman = await prisma.washerman.create({
      data: {
        username,
        password: hashedPassword
      },
      select: {
        id: true,
        username: true,
        createdAt: true
      }
    });

    return washerman;
  }

  /**
   * Washerman login
   */
  static async loginWasherman(loginData: WashermanLoginData) {
    const { username, password } = loginData;

    // Find washerman by username
    const washerman = await prisma.washerman.findUnique({
      where: { username: sanitizeString(username) }
    });

    if (!washerman) {
      throw new BadRequestError('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, washerman.password);
    if (!isPasswordValid) {
      throw new BadRequestError('Invalid credentials');
    }

    // Return washerman data (without password)
    const { password: _, ...washermanData } = washerman;
    return washermanData;
  }

  /**
   * Get washerman dashboard data
   */
  static async getWashermanDashboard() {
    // Get all orders with aggregations
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' }
    });

    const totalOrders = orders.length;
    const pendingOrders = orders.filter(o => o.status === 'PENDING').length;
    const inprogressOrders = orders.filter(o => o.status === 'INPROGRESS').length;
    const completeOrders = orders.filter(o => o.status === 'COMPLETE').length;
    const recentOrders = orders.slice(0, 10);

    return {
      totalOrders,
      pendingOrders,
      inprogressOrders,
      completeOrders,
      recentOrders
    };
  }

  /**
   * Get all washermen
   */
  static async getAllWashermen() {
    const washermen = await prisma.washerman.findMany({
      select: {
        id: true,
        username: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' }
    });

    return washermen;
  }

  /**
   * Update washerman
   */
  static async updateWasherman(id: number, updateData: Partial<CreateWashermanData>) {
    // Check if washerman exists
    const existingWasherman = await prisma.washerman.findUnique({
      where: { id }
    });

    if (!existingWasherman) {
      throw new BadRequestError('Washerman not found');
    }

    // Prepare update data
    const dataToUpdate: any = {};

    if (updateData.username) {
      const username = sanitizeString(updateData.username);
      
      // Check if new username is already taken
      const usernameExists = await prisma.washerman.findFirst({
        where: {
          username,
          NOT: { id }
        }
      });

      if (usernameExists) {
        throw new ConflictError('Username already exists');
      }

      dataToUpdate.username = username;
    }

    if (updateData.password) {
      dataToUpdate.password = await hashPassword(updateData.password);
    }

    // Update washerman
    const updatedWasherman = await prisma.washerman.update({
      where: { id },
      data: dataToUpdate,
      select: {
        id: true,
        username: true,
        createdAt: true
      }
    });

    return updatedWasherman;
  }

  /**
   * Delete washerman
   */
  static async deleteWasherman(id: number) {
    // Check if washerman exists
    const existingWasherman = await prisma.washerman.findUnique({
      where: { id }
    });

    if (!existingWasherman) {
      throw new BadRequestError('Washerman not found');
    }

    // Delete washerman
    await prisma.washerman.delete({
      where: { id }
    });

    return { message: 'Washerman deleted successfully' };
  }
}
