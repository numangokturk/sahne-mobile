/**
 * SAHNE - Review Types
 */

export interface Review {
  id: number;
  reservation_id: number;
  client_id: number;
  chef_id: number;
  food_quality: number; // 1-5
  presentation: number; // 1-5
  professionalism: number; // 1-5
  value_for_money: number; // 1-5
  overall_rating: number; // Calculated average
  comment: string | null;
  chef_reply: string | null;
  created_at: string;
  updated_at: string;

  // Relations
  client?: {
    id: number;
    name: string;
  };
}

export interface CreateReviewRequest {
  reservation_id: number;
  food_quality: number;
  presentation: number;
  professionalism: number;
  value_for_money: number;
  comment?: string;
}
