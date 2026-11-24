import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Linking,
  ActivityIndicator,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import { useLocation } from '../../hooks/useLocation';
import { searchCafes, getFullImageUrl } from '../../services/cafeService';
import { Cafe } from '../../types/cafe';

// Fallback coordinate if GPS is pending (Kathmandu coordinates)
const DEFAULT_COORDS = {
  latitude: 27.7172,
  longitude: 85.3240,
  latitudeDelta: 0.04,
  longitudeDelta: 0.04,
};

export default function MapScreen() {
  const router = useRouter();
  const mapRef = useRef<MapView>(null);
  const { latitude, longitude, loading: locLoading } = useLocation();
  const [selectedCafe, setSelectedCafe] = useState<Cafe | null>(null);
  const hasValidUserLocation =
  typeof latitude === 'number' &&
  typeof longitude === 'number' &&
  Number.isFinite(latitude) &&
  Number.isFinite(longitude) &&
  latitude >= -90 &&
  latitude <= 90 &&
  longitude >= -180 &&
  longitude <= 180;
  // Fetch nearby cafes based on user's location
  const {
  data: cafes = [],
  isLoading,
  error,
  isError,
  isSuccess,
} = useQuery<Cafe[]>({
  queryKey: ['mapCafes', latitude, longitude],
  queryFn: () =>
    searchCafes(
      'coffee',
      latitude ?? undefined,
      longitude ?? undefined
    ),
});
useEffect(() => {
  console.log('========== MAP DEBUG ==========');
  console.log('User latitude:', latitude);
  console.log('User longitude:', longitude);
  console.log('Location loading:', locLoading);
  console.log('Cafe API loading:', isLoading);
  console.log('API error:', error);
  console.log('API successful:', isSuccess);
  console.log('Total cafes returned:', cafes.length);
  console.log('Valid cafes:', validCafes.length);
  console.log('Cafe data:', cafes);
  console.log('================================');
}, [latitude, longitude, locLoading, isLoading, isSuccess, error, cafes]);

  // Filter cafes that have valid latitude & longitude
const validCafes = cafes.filter((cafe) => {
  const lat = Number(cafe.latitude);
  const lng = Number(cafe.longitude);

  return (
    cafe.latitude !== null &&
    cafe.longitude !== null &&
    cafe.latitude !== undefined &&
    cafe.longitude !== undefined &&
    Number.isFinite(lat) &&
    Number.isFinite(lng) &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180
  );
});

  // Animate map to user's location when GPS is acquired
  useEffect(() => {
  if (hasValidUserLocation && mapRef.current) {
    mapRef.current.animateToRegion(
      {
        latitude,
        longitude,
        latitudeDelta: 0.03,
        longitudeDelta: 0.03,
      },
      1000
    );
  }
}, [latitude, longitude, hasValidUserLocation]);

  // Open external directions in Google Maps
  const handleOpenDirections = (cafe: Cafe) => {
    if (cafe.maps_url) {
      Linking.openURL(cafe.maps_url);
    } else if (cafe.latitude && cafe.longitude) {
      Linking.openURL(
        `https://www.google.com/maps/dir/?api=1&destination=${cafe.latitude},${cafe.longitude}`
      );
    }
  };

 const handleOpenDetails = (cafe: Cafe) => {
  router.push({
    pathname: '/cafe/[id]',
    params: {
      id: String(cafe.id),
      cafeData: JSON.stringify(cafe),
    },
  });
};

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={
  hasValidUserLocation
    ? {
        latitude,
        longitude,
        latitudeDelta: 0.03,
        longitudeDelta: 0.03,
      }
    : DEFAULT_COORDS
}
        showsUserLocation
        showsMyLocationButton
        onPress={() => setSelectedCafe(null)} // Dismiss card on background tap
      >
        {validCafes.map((cafe) => (
          <Marker
            key={cafe.id}
            coordinate={{
              latitude: Number(cafe.latitude),
              longitude: Number(cafe.longitude),
            }}
            title={cafe.name}
            pinColor="#6F4E37" // Coffee-colored marker
            onPress={() => setSelectedCafe(cafe)}
          />
        ))}
      </MapView>
      <View style={{
  position: 'absolute',
  top: 60,
  alignSelf: 'center',
  backgroundColor: 'white',
  padding: 12,
  borderRadius: 10,
  elevation: 5,
}}>
  <Text style={{ color: '#6F4E37', fontWeight: 'bold' }}>
    Cafes received: {cafes.length} | Pins: {validCafes.length}
  </Text>
</View>

      {/* Loading Overlay */}
      {(locLoading || isLoading) && (
        <View style={styles.loadingBubble}>
          <ActivityIndicator size="small" color="#6F4E37" />
          <Text style={styles.loadingText}>Locating nearby spots...</Text>
        </View>
      )}

      {/* Floating Selected Cafe Preview Card */}
      {selectedCafe && (
        <View style={styles.cardContainer}>
          <View style={styles.card}>
            {/* Close Button */}
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setSelectedCafe(null)}
              hitSlop={10}
            >
              <Ionicons name="close" size={18} color="#8D7B68" />
            </TouchableOpacity>

            <View style={styles.cardBody}>
              <Image
                source={{ uri: getFullImageUrl(selectedCafe.photo_url) }}
                style={styles.thumbnail}
              />

              <View style={styles.cardInfo}>
                <Text style={styles.cardTitle} numberOfLines={1}>
                  {selectedCafe.name}
                </Text>

                <View style={styles.ratingRow}>
                  {selectedCafe.rating !== null ? (
                    <>
                      <Ionicons name="star" size={13} color="#F59E0B" />
                      <Text style={styles.ratingText}>
                        {selectedCafe.rating.toFixed(1)}
                      </Text>
                      <Text style={styles.reviewCount}>
                        ({selectedCafe.user_ratings_total})
                      </Text>
                    </>
                  ) : (
                    <Text style={styles.noRating}>No reviews</Text>
                  )}
                  {selectedCafe.distance_km !== null && (
                    <>
                      <Text style={styles.dot}>•</Text>
                      <Text style={styles.distanceText}>
                        {selectedCafe.distance_km} km away
                      </Text>
                    </>
                  )}
                </View>

                <Text style={styles.addressText} numberOfLines={1}>
                  {selectedCafe.address}
                </Text>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionRow}>
              <TouchableOpacity
                style={styles.directionsBtn}
                onPress={() => handleOpenDirections(selectedCafe)}
              >
                <Ionicons name="navigate" size={14} color="#6F4E37" />
                <Text style={styles.directionsBtnText}>Directions</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.detailsBtn}
                onPress={() => handleOpenDetails(selectedCafe)}
              >
                <Text style={styles.detailsBtnText}>View Details</Text>
                <Ionicons name="arrow-forward" size={14} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDFCF7',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  loadingBubble: {
    position: 'absolute',
    top: 16,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#EADECA',
    elevation: 3,
  },
  loadingText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6F4E37',
  },
  cardContainer: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#EADECA',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
  },
  closeBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 10,
    backgroundColor: '#F8F5EE',
    borderRadius: 12,
    padding: 4,
  },
  cardBody: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  thumbnail: {
    width: 64,
    height: 64,
    borderRadius: 12,
    backgroundColor: '#F5EBE0',
  },
  cardInfo: {
    flex: 1,
    paddingRight: 20,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2C1D11',
    marginBottom: 2,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginBottom: 2,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2C1D11',
  },
  reviewCount: {
    fontSize: 10,
    color: '#8D7B68',
  },
  noRating: {
    fontSize: 11,
    color: '#8D7B68',
  },
  dot: {
    color: '#C4A482',
    marginHorizontal: 2,
  },
  distanceText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6F4E37',
  },
  addressText: {
    fontSize: 11,
    color: '#8D7B68',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F5EBE0',
  },
  directionsBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    backgroundColor: '#F8F5EE',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#EADECA',
  },
  directionsBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6F4E37',
  },
  detailsBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    backgroundColor: '#6F4E37',
    borderRadius: 10,
  },
  detailsBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});