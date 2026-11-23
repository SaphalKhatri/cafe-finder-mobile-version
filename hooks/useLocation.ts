import { useState, useEffect } from 'react';
import * as Location from 'expo-location';

export interface LocationState {
  latitude: number | null;
  longitude: number | null;
  loading: boolean;
  error: string | null;
  refreshLocation: () => Promise<void>;
}

export const useLocation = (): LocationState => {
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const requestLocation = async () => {
    try {
      setLoading(true);
      setError(null);

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Location permission denied. Showing general recommendations.');
        setLoading(false);
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      setLatitude(currentLocation.coords.latitude);
      setLongitude(currentLocation.coords.longitude);
    } catch {
      setError('Could not retrieve device location.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    requestLocation();
  }, []);

  return { latitude, longitude, loading, error, refreshLocation: requestLocation };
};