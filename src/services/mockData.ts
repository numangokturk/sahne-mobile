/**
 * SAHNE - Mock Data for Development
 * Fallback data when API is unavailable
 */

import { Chef } from '@/src/types';

export const MOCK_CHEFS: Chef[] = [
  {
    id: 1,
    user_id: 101,
    bio: 'Michelin-starred chef specializing in modern Turkish cuisine with 15 years of experience.',
    experience_years: 15,
    specialties: ['Turkish', 'Ottoman', 'Mediterranean'],
    rating: 4.9,
    total_reviews: 127,
    profile_image: null,
    cover_image: null,
    user: {
      id: 101,
      name: 'Mehmet Yılmaz',
      email: 'mehmet@sahne.com',
      phone: '+90 555 123 4567',
      role: 'chef',
    },
    packages: [
      {
        id: 1,
        chef_profile_id: 1,
        title: 'Ottoman Feast',
        description: '7-course traditional Ottoman menu',
        price: 2500,
        min_guests: 2,
        max_guests: 8,
      },
      {
        id: 2,
        chef_profile_id: 1,
        title: 'Modern Turkish',
        description: '5-course contemporary Turkish cuisine',
        price: 1800,
        min_guests: 2,
        max_guests: 6,
      },
    ],
  },
  {
    id: 2,
    user_id: 102,
    bio: 'Italian cuisine master, trained in Rome. Expert in pasta, risotto, and authentic Italian flavors.',
    experience_years: 12,
    specialties: ['Italian', 'Pasta', 'Mediterranean'],
    rating: 4.8,
    total_reviews: 98,
    profile_image: null,
    cover_image: null,
    user: {
      id: 102,
      name: 'Elena Romano',
      email: 'elena@sahne.com',
      phone: '+90 555 234 5678',
      role: 'chef',
    },
    packages: [
      {
        id: 3,
        chef_profile_id: 2,
        title: 'Taste of Italy',
        description: '6-course authentic Italian menu',
        price: 2200,
        min_guests: 2,
        max_guests: 10,
      },
    ],
  },
  {
    id: 3,
    user_id: 103,
    bio: 'Japanese culinary artist with expertise in sushi, kaiseki, and traditional Japanese cooking techniques.',
    experience_years: 18,
    specialties: ['Japanese', 'Sushi', 'Kaiseki'],
    rating: 5.0,
    total_reviews: 156,
    profile_image: null,
    cover_image: null,
    user: {
      id: 103,
      name: 'Takeshi Nakamura',
      email: 'takeshi@sahne.com',
      phone: '+90 555 345 6789',
      role: 'chef',
    },
    packages: [
      {
        id: 4,
        chef_profile_id: 3,
        title: 'Omakase Experience',
        description: '10-course chef\'s choice premium menu',
        price: 3500,
        min_guests: 2,
        max_guests: 6,
      },
      {
        id: 5,
        chef_profile_id: 3,
        title: 'Sushi Masterclass',
        description: 'Interactive sushi-making with dinner',
        price: 2800,
        min_guests: 4,
        max_guests: 8,
      },
    ],
  },
];

export const USE_MOCK_DATA = false; // Set to true to use mock data instead of API
