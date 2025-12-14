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

// Chef Profile Detail (from ChefProfileResource)
export interface ChefProfile {
  id: number;
  user: {
    id: number;
    name: string;
    email: string;
    phone: string;
  };
  title: string;
  biography: string;
  culinary_philosophy: string;
  profile_image: string | null;
  cover_image: string | null;
  specialties: string[];
  max_guests: number;
  is_active: boolean;
  parcours: ChefParcours[];
  media: ChefMedia[];
  packages: ExperiencePackage[];
  regions: Region[];
  created_at: string;
  updated_at: string;
}

// Chef Parcours (education and experience)
export interface ChefParcours {
  id: string;
  type: string; // 'education' or 'experience'
  institution: string;
  position: string;
  location: string;
  start_date: string;
  end_date: string;
  description: string;
  order: string;
}

// Chef Media (photos/videos)
export interface ChefMedia {
  id: number;
  type: string;
  path: string;
  url: string;
  caption: string | null;
  order: number;
}

// Experience Package
export interface ExperiencePackage {
  id: number;
  type: string; // 'essential', 'signature', 'ultimate'
  display_name: string;
  base_price: number;
  price_per_person: number;
  courses_count: number;
  description: string | null;
  includes_wine: boolean;
  crew_members: number | null;
  is_active: boolean;
}

// Region
export interface Region {
  id: number;
  name: string;
  code: string;
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
