/**
 * SAHNE - Validation Utilities
 */

export const validation = {
  /**
   * Validate email format
   */
  email: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  /**
   * Validate phone format (Turkish format)
   */
  phone: (phone: string): boolean => {
    const phoneRegex = /^(\+90|0)?[0-9]{10}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  },

  /**
   * Validate password strength
   * At least 8 characters
   */
  password: (password: string): boolean => {
    return password.length >= 8;
  },

  /**
   * Check if passwords match
   */
  passwordMatch: (password: string, confirmation: string): boolean => {
    return password === confirmation;
  },

  /**
   * Validate required field
   */
  required: (value: string): boolean => {
    return value.trim().length > 0;
  },
};
