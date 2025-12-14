/**
 * SAHNE - Chefs Service
 * Chef-related API calls
 */

import { api } from './api';
import { Chef, PaginatedResponse } from '@/src/types';

export interface ChefFilters {
  search?: string;
  min_price?: number;
  max_price?: number;
  specialties?: string[];
  min_rating?: number;
  page?: number;
}

export const chefsService = {
  /**
   * Get paginated list of chefs
   */
  async getChefs(filters?: ChefFilters): Promise<PaginatedResponse<Chef>> {
    const response = await api.get<PaginatedResponse<Chef>>('/chefs', {
      params: filters,
    });
    return response.data;
  },

  /**
   * Get chef by ID with details
   */
  async getChefById(id: number): Promise<Chef> {
    const response = await api.get<{ chef: Chef }>(`/chefs/${id}`);
    return response.data.chef;
  },

  /**
   * Search chefs
   */
  async searchChefs(query: string): Promise<Chef[]> {
    const response = await api.get<{ chefs: Chef[] }>('/chefs/search', {
      params: { query },
    });
    return response.data.chefs;
  },
};
