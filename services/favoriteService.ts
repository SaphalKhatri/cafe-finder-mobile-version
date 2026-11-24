import { API_BASE_URL } from '../constants/config';
import { Cafe } from '../types/cafe';

// Fetch all saved favorites
export const getFavorites = async (): Promise<Cafe[]> => {
  const response = await fetch(`${API_BASE_URL}/favorites/`);
  if (!response.ok) {
    throw new Error('Failed to fetch saved favorites');
  }
  return response.json();
};

// Check if a specific cafe is already in favorites
export const checkIsFavorite = async (placeId: string): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/favorites/${placeId}/`);
    if (!response.ok) return false;
    const data = await response.json();
    return !!data.is_favorite;
  } catch {
    return false;
  }
};

// Add a cafe to favorites
export const addFavorite = async (cafe: Cafe): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/favorites/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      place_id: cafe.id,
      name: cafe.name,
      address: cafe.address,
      rating: cafe.rating,
      user_ratings_total: cafe.user_ratings_total,
      photo_url: cafe.photo_url,
      category: cafe.category,
      latitude: cafe.latitude,
      longitude: cafe.longitude,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to save favorite');
  }
};

// Remove a cafe from favorites
export const removeFavorite = async (placeId: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/favorites/${placeId}/`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to remove favorite');
  }
};