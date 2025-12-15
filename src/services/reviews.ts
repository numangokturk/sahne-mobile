/**
 * SAHNE - Reviews Service
 * Review-related API calls
 */

import { api } from './api';
import { Review, CreateReviewRequest } from '@/src/types';

export const reviewsService = {
  /**
   * Get reviews for a chef
   */
  async getChefReviews(chefId: number): Promise<Review[]> {
    const response = await api.get<{ reviews: Review[] }>(
      `/chefs/${chefId}/reviews`
    );
    return response.data.reviews;
  },

  /**
   * Create a review for a reservation
   */
  async createReview(data: CreateReviewRequest): Promise<Review> {
    const response = await api.post<{ review: Review }>(
      `/reservations/${data.reservation_id}/review`,
      data
    );
    return response.data.review;
  },

  /**
   * Reply to a review (chef only)
   */
  async replyToReview(reviewId: number, reply: string): Promise<Review> {
    const response = await api.post<{ review: Review }>(
      `/reviews/${reviewId}/reply`,
      { reply }
    );
    return response.data.review;
  },
};
