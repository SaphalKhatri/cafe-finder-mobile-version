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