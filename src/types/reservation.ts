/**
 * SAHNE - Reservation Types
 */

export type ReservationStatus =
  | 'pending'
  | 'confirmed'
  | 'rejected'
  | 'completed'
  | 'cancelled';

export interface Reservation {
  id: number;
  client_id: number;
  chef_id: number;
  package_id: number;
  reservation_date: string;
  guest_count: number;
  address: string;
  special_requests: string | null;
  status: ReservationStatus;
  total_price: number;
  rejection_reason: string | null;
  created_at: string;
  updated_at: string;

  // Relations
  client?: {
    id: number;
    name: string;
    email: string;
    phone: string;
  };
  chef?: {
    id: number;
    user: {
      name: string;
    };
  };
  package?: {
    id: number;
    name: string;
    price: number;
    duration_hours: number;
  };
}

export interface CreateReservationRequest {
  chef_id: number;
  package_id: number;
  reservation_date: string;
  guest_count: number;
  address: string;
  special_requests?: string;
}
