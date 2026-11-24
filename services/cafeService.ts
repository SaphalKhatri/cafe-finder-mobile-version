import { API_BASE_URL, PLACEHOLDER_IMAGE } from '../constants/config';
import { Cafe, PlacesSearchResponse } from '../types/cafe';


export const getFullImageUrl = (photoUrl: string | null): string => {
  if (!photoUrl) return PLACEHOLDER_IMAGE;
  if (photoUrl.startsWith('http://127.0.0.1:8000')) {
    return photoUrl.replace('http://127.0.0.1:8000', 'http://10.0.2.2:8000');
  }
  if (photoUrl.startsWith('/')) {
    return `http://10.0.2.2:8000${photoUrl}`;
  }
  return photoUrl;
};


export const searchCafes = async (
  query: string,
  latitude?: number,
  longitude?: number
): Promise<Cafe[]> => {

  let url = `${API_BASE_URL}/places/search/?query=${query}`;

  if (latitude != null && longitude != null) {
    url += `&latitude=${latitude}&longitude=${longitude}`;
  }

  const response = await fetch(url);

  const data: PlacesSearchResponse = await response.json();

  return data.results || [];
};
export const getCafeDetails = async (
  placeId: string,
  latitude?: number | null,
  longitude?: number | null
): Promise<Cafe> => {
  const url = new URL(`${API_BASE_URL}/places/${placeId}/`);
  if (latitude && longitude) {
    url.searchParams.append('latitude', latitude.toString());
    url.searchParams.append('longitude', longitude.toString());
  }

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error(`Failed to load cafe details (HTTP ${response.status})`);
  }

  return response.json();
};