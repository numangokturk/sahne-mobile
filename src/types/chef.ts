/**
 * SAHNE - Chef Types
 */

export interface Chef {
  id: number;
  user_id: number;
  bio: string;
  experience_years: number;
  specialties: string[];
  rating: number;
  total_reviews: number;
  profile_image: string | null;
  cover_image: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;

  // Relations
  user?: {
    id: number;
    name: string;
    email: string;
    phone: string;
  };
  packages?: ChefPackage[];
  photos?: ChefPhoto[];
}

export interface ChefPackage {
  id: number;
  chef_id: number;
  name: string;
  description: string;
  price: number;
  duration_hours: number;
  max_guests: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ChefPhoto {
  id: number;
  chef_id: number;
  photo_url: string;
  order: number;
  created_at: string;
  updated_at: string;
}
