import { config } from '../config/env';

/**
 * Validate email domain (must be rishihood.edu.in)
 * @param email - Email address to validate
 * @returns Boolean indicating if email domain is valid
 */
export function validateEmailDomain(email: string): boolean {
  return email.endsWith(config.emailDomain);
}

/**
 * Validate bag number format (B-XXX or G-XXX)
 * @param bagNo - Bag number to validate
 * @returns Boolean indicating if bag number format is valid
 */
export function validateBagNumber(bagNo: string): boolean {
  const bagNumberPattern = /^[BG]-\d+$/;
  return bagNumberPattern.test(bagNo);
}

/**
 * Validate email format
 * @param email - Email address to validate
 * @returns Boolean indicating if email format is valid
 */
export function validateEmail(email: string): boolean {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
}

/**
 * Validate phone number (basic validation)
 * @param phoneNo - Phone number to validate
 * @returns Boolean indicating if phone number is valid
 */
export function validatePhoneNumber(phoneNo: string): boolean {
  const phonePattern = /^[\d+\-\s()]+$/;
  return phonePattern.test(phoneNo) && phoneNo.length >= 10;
}

/**
 * Validate number of clothes (1-50)
 * @param count - Number of clothes
 * @returns Boolean indicating if count is valid
 */
export function validateClothesCount(count: number): boolean {
  return count >= 1 && count <= 50;
}

/**
 * Validate order status
 * @param status - Order status to validate
 * @returns Boolean indicating if status is valid
 */
export function validateOrderStatus(status: string): boolean {
  const validStatuses = ['pending', 'inprogress', 'complete'];
  return validStatuses.includes(status.toLowerCase());
}

/**
 * Sanitize string input (remove extra spaces, trim)
 * @param input - String to sanitize
 * @returns Sanitized string
 */
export function sanitizeString(input: string): string {
  return input.trim().replace(/\s+/g, ' ');
}

/**
 * Validate enrollment number format
 * @param enrollmentNo - Enrollment number to validate
 * @returns Boolean indicating if enrollment number is valid
 */
export function validateEnrollmentNumber(enrollmentNo: string): boolean {
  // Basic validation - adjust pattern based on your requirements
  return enrollmentNo.length >= 3 && enrollmentNo.length <= 20;
}
