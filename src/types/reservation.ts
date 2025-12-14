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

export type AddressType = 'home' | 'hotel' | 'villa' | 'other';

export interface CreateReservationRequest {
  chef_profile_id: number;
  experience_package_id: number;
  date: string; // date-time format
  time: string;
  guest_count: number;
  address: string;
  address_type: AddressType;
  allergies?: string;
  dietary_notes?: string;
  special_occasion?: string;
}

// Reservation data for passing between screens
export interface ReservationFormData {
  chefId: number;
  chefName: string;
  chefPhoto?: string;
  packageId: number;
  packageName: string;
  packagePrice: number;
  date?: string;
  time?: string;
  guestCount?: number;
  eventType?: string;
  specialRequests?: string;
  dietaryRestrictions?: string[];
  address?: string;
  addressType?: AddressType;
}
