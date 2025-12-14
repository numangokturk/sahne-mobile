/**
 * SAHNE - Auth Service
 * Authentication API calls
 */

import { api } from './api';
import { AuthTokens, LoginRequest, RegisterRequest, User } from '@/src/types';

export const authService = {
  /**
   * Login user
   */
  async login(credentials: LoginRequest): Promise<AuthTokens> {
    const response = await api.post<AuthTokens>('/auth/login', credentials);
    return response.data;
  },

  /**
   * Register new user
   */
  async register(data: RegisterRequest): Promise<AuthTokens> {
    const response = await api.post<AuthTokens>('/auth/register', data);
    return response.data;
  },

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    await api.post('/auth/logout');
  },

  /**
   * Get current authenticated user
   */
  async getCurrentUser(): Promise<User> {
    const response = await api.get<{ user: User }>('/auth/user');
    return response.data.user;
  },

  /**
   * Send password reset email
   */
  async forgotPassword(email: string): Promise<{ message: string }> {
    const response = await api.post<{ message: string }>('/auth/forgot-password', {
      email,
    });
    return response.data;
  },
};
