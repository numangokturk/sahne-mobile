/**
 * SAHNE - Reservations Service
 * Reservation-related API calls
 */

import { api } from './api';
import {
  Reservation,
  CreateReservationRequest,
  ReservationStatus,
} from '@/src/types';

export const reservationsService = {
  /**
   * Get all reservations for current user
   */
  async getMyReservations(status?: ReservationStatus): Promise<Reservation[]> {
    const response = await api.get<{ reservations: Reservation[] }>(
      '/reservations',
      {
        params: status ? { status } : undefined,
      }
    );
    return response.data.reservations;
  },

  /**
   * Get reservation by ID
   */
  async getReservationById(id: number): Promise<Reservation> {
    const response = await api.get<{ reservation: Reservation }>(
      `/reservations/${id}`
    );
    return response.data.reservation;
  },

  /**
   * Create new reservation
   */
  async createReservation(
    data: CreateReservationRequest
  ): Promise<{ message: string; data: Reservation }> {
    const response = await api.post<{ message: string; data: Reservation }>(
      '/reservations',
      data
    );
    return response.data;
  },

  /**
   * Cancel reservation (client)
   */
  async cancelReservation(id: number): Promise<void> {
    await api.post(`/reservations/${id}/cancel`);
  },

  /**
   * Confirm reservation (chef)
   */
  async confirmReservation(id: number): Promise<void> {
    await api.post(`/reservations/${id}/confirm`);
  },

  /**
   * Reject reservation (chef)
   */
  async rejectReservation(id: number, reason: string): Promise<void> {
    await api.post(`/reservations/${id}/reject`, { reason });
  },

  /**
   * Complete reservation (chef)
   */
  async completeReservation(id: number): Promise<void> {
    await api.post(`/reservations/${id}/complete`);
  },
};
