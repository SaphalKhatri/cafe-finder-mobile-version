export interface Cafe {
  id: string;
  name: string;
  address: string;
  rating: number | null;
  user_ratings_total: number;
  is_open: boolean | null;
  distance_km: number | null;
  latitude: number | null;
  longitude: number | null;
  photo_url: string | null;
  maps_url: string | null;
  category: string;
}

export interface PlacesSearchResponse {
  count: number;
  results: Cafe[];
}