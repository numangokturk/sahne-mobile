/**
 * SAHNE - Review Types
 */

export interface Review {
  id: number;
  reservation_id: number;
  ratings: {
    cuisine: number;
    presentation: number;
    service: number;
    overall: number;
    average: number;
  };
  comment: string;
  chef_response: string | null;
  chef_response_at: string | null;
  customer: {
    id: number;
    name: string;
  };
  chef: {
    id: number;
    name: string;
  };
  is_reported: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateReviewRequest {
  reservation_id: number;
  cuisine: number;
  presentation: number;
  service: number;
  overall: number;
  comment?: string;
}
