import prisma from '../config/database';
import { validateClothesCount } from '../utils/validators';
import { BadRequestError, NotFoundError } from '../middleware/asyncHandler';
import { StudentService } from './student.service';
import { Status } from '@prisma/client';

export interface CreateOrderData {
  bagNo: string;
  numberOfClothes: number;
}

export interface UpdateOrderStatusData {
  orderId: number;
  status: string;
}

export interface UpdateOrderCountData {
  orderId: number;
  numberOfClothes: number;
}

/**
 * Order Service - Handles all order-related business logic
 */
export class OrderService {
  /**
   * Create a new order
   */
  static async createOrder(data: CreateOrderData) {
    const { bagNo, numberOfClothes } = data;

    // Validate clothes count
    if (!validateClothesCount(numberOfClothes)) {
      throw new BadRequestError('Number of clothes must be between 1 and 50');
    }

    // Verify student exists
    const studentExists = await StudentService.studentExists(bagNo);
    if (!studentExists) {
      throw new NotFoundError('Student with this bag number not found');
    }

    // Create order
    const order = await prisma.order.create({
      data: {
        bagNo,
        numberOfClothes,
        status: 'PENDING'
      }
    });

    return order;
  }

  /**
   * Get orders for a specific student
   */
  static async getStudentOrders(bagNo: string) {
    // Verify student exists
    const studentExists = await StudentService.studentExists(bagNo);
    if (!studentExists) {
      throw new NotFoundError('Student not found');
    }

    const orders = await prisma.order.findMany({
      where: { bagNo },
      include: {
        student: {
          select: {
            name: true,
            bagNo: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Transform to include studentName at the top level
    return orders.map(order => ({
      ...order,
      studentName: order.student.name
    }));
  }

  /**
   * Get all orders (for washerman)
   */
  static async getAllOrders() {
    const orders = await prisma.order.findMany({
      include: {
        student: {
          select: {
            name: true,
            bagNo: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Transform to include studentName at the top level
    return orders.map(order => ({
      ...order,
      studentName: order.student.name
    }));
  }

  /**
   * Get pending orders
   */
  static async getPendingOrders() {
    const orders = await prisma.order.findMany({
      where: { status: 'PENDING' },
      include: {
        student: {
          select: {
            name: true,
            bagNo: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Transform to include studentName at the top level
    return orders.map(order => ({
      ...order,
      studentName: order.student.name
    }));
  }

  /**
   * Update order status
   */
  static async updateOrderStatus(orderId: number, newStatus: string) {
    // Validate status
    const validStatuses = ['pending', 'inprogress', 'complete'];
    if (!validStatuses.includes(newStatus.toLowerCase())) {
      throw new BadRequestError('Invalid status');
    }

    // Get current order
    const order = await prisma.order.findUnique({
      where: { id: orderId }
    });

    if (!order) {
      throw new NotFoundError('Order not found');
    }

    // Convert status to uppercase for Prisma enum
    const statusMap: { [key: string]: Status } = {
      'pending': 'PENDING',
      'inprogress': 'INPROGRESS',
      'complete': 'COMPLETE'
    };

    const prismaStatus = statusMap[newStatus.toLowerCase()];

    // Validate status transitions
    if (order.status === 'PENDING' && prismaStatus === 'INPROGRESS') {
      // Washerman clicked "Received" - valid transition
    } else if (order.status === 'INPROGRESS' && prismaStatus === 'COMPLETE') {
      // Washerman clicked "Ready" - valid transition
    } else {
      throw new BadRequestError('Invalid status transition');
    }

    // Update order
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status: prismaStatus }
    });

    return updatedOrder;
  }

  /**
   * Update order clothes count
   */
  static async updateOrderCount(orderId: number, numberOfClothes: number) {
    // Validate clothes count
    if (!validateClothesCount(numberOfClothes)) {
      throw new BadRequestError('Number of clothes must be between 1 and 50');
    }

    // Check if order exists
    const order = await prisma.order.findUnique({
      where: { id: orderId }
    });

    if (!order) {
      throw new NotFoundError('Order not found');
    }

    // Update order
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { numberOfClothes }
    });

    return updatedOrder;
  }

  /**
   * Get order by ID
   */
  static async getOrderById(orderId: number) {
    const order = await prisma.order.findUnique({
      where: { id: orderId }
    });

    if (!order) {
      throw new NotFoundError('Order not found');
    }

    return order;
  }

  /**
   * Delete order (optional - not in Django but useful)
   */
  static async deleteOrder(orderId: number) {
    const order = await prisma.order.findUnique({
      where: { id: orderId }
    });

    if (!order) {
      throw new NotFoundError('Order not found');
    }

    await prisma.order.delete({
      where: { id: orderId }
    });

    return { message: 'Order deleted successfully' };
  }
}
