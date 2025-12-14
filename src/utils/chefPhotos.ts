/**
 * SAHNE - Chef Photo Utilities
 * Maps chef IDs to local placeholder photos
 */

// Import local chef photos
const chefPhotos = {
  chef1: require('@/assets/images/chefs/chef1.jpg'),
  chef2: require('@/assets/images/chefs/chef2.jpg'),
  chef3: require('@/assets/images/chefs/chef3.jpg'),
};

/**
 * Get local chef photo based on chef ID
 * Cycles through available photos (3 total)
 */
export function getChefPhoto(chefId: number): any {
  const photoIndex = ((chefId - 1) % 3) + 1;
  return chefPhotos[`chef${photoIndex}` as keyof typeof chefPhotos];
}

/**
 * Check if we should use local photo instead of API photo
 * For now, always use local photos as they look better than placeholders
 */
export function shouldUseLocalPhoto(apiPhotoUrl: string | null): boolean {
  return !apiPhotoUrl || apiPhotoUrl.includes('placeholder') || apiPhotoUrl.includes('via.placeholder');
}
