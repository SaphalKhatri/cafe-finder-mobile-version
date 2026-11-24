import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Linking,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import { Cafe } from '../../types/cafe';
import { getCafeDetails, getFullImageUrl } from '../../services/cafeService';
import { PLACEHOLDER_IMAGE } from '../../constants/config';
import { useLocation } from '../../hooks/useLocation';

export default function CafeDetailsScreen() {
  const { id, cafeData } = useLocalSearchParams<{ id: string; cafeData?: string }>();
  const { latitude, longitude } = useLocation();

  // Instant display if passed from Home or Map screen
  const initialCafe: Cafe | null = cafeData ? JSON.parse(cafeData) : null;
  const [isFavorite, setIsFavorite] = useState(false);
  const [imgError, setImgError] = useState(false);

  // Fetch fresh details from backend (cached by TanStack Query)
  const {
    data: cafe = initialCafe,
    isLoading,
    isError,
  } = useQuery<Cafe | null>({
    queryKey: ['cafeDetail', id],
    queryFn: () => getCafeDetails(id, latitude, longitude),
    initialData: initialCafe,
  });

  if (isLoading && !cafe) {
    return (
      <View style={styles.centerBox}>
        <ActivityIndicator size="large" color="#6F4E37" />
        <Text style={styles.loadingText}>Loading details...</Text>
      </View>
    );
  }

  if (isError || !cafe) {
    return (
      <View style={styles.centerBox}>
        <Ionicons name="alert-circle-outline" size={48} color="#EF4444" />
        <Text style={styles.errorTitle}>Cafe Not Found</Text>
        <Text style={styles.errorSubtitle}>Unable to retrieve information for this venue.</Text>
      </View>
    );
  }

  const handleOpenDirections = () => {
    if (cafe.maps_url) {
      Linking.openURL(cafe.maps_url);
    } else if (cafe.latitude && cafe.longitude) {
      Linking.openURL(
        `https://www.google.com/maps/dir/?api=1&destination=${cafe.latitude},${cafe.longitude}`
      );
    }
  };

  const handleToggleFavorite = () => {
    // Local toggle for now; connected to PostgreSQL in Step 8!
    setIsFavorite((prev) => !prev);
  };

  const imageUri =
    cafe.photo_url && !imgError
      ? getFullImageUrl(cafe.photo_url)
      : PLACEHOLDER_IMAGE;

  return (
    <View style={styles.screen}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Cover Photo */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: imageUri }}
            style={styles.image}
            onError={() => setImgError(true)}
          />

          {/* Open / Closed Status Badge */}
          {cafe.is_open !== null && (
            <View
              style={[
                styles.statusBadge,
                cafe.is_open ? styles.openBadge : styles.closedBadge,
              ]}
            >
              <Text style={styles.statusText}>
                {cafe.is_open ? 'Open Now' : 'Closed'}
              </Text>
            </View>
          )}

          {/* Favorite Floating Button */}
          <TouchableOpacity
            style={styles.favoriteBtn}
            onPress={handleToggleFavorite}
            activeOpacity={0.8}
          >
            <Ionicons
              name={isFavorite ? 'heart' : 'heart-outline'}
              size={22}
              color={isFavorite ? '#EF4444' : '#6F4E37'}
            />
          </TouchableOpacity>
        </View>

        {/* Content Container */}
        <View style={styles.content}>
          {/* Category Chip */}
          <View style={styles.categoryChip}>
            <Text style={styles.categoryText}>{cafe.category}</Text>
          </View>

          {/* Cafe Name */}
          <Text style={styles.title}>{cafe.name}</Text>

          {/* Stats Bar (Rating & Distance) */}
          <View style={styles.statsCard}>
            <View style={styles.statItem}>
              <View style={styles.statIconRow}>
                <Ionicons name="star" size={18} color="#F59E0B" />
                <Text style={styles.statMainText}>
                  {cafe.rating !== null ? cafe.rating.toFixed(1) : 'N/A'}
                </Text>
              </View>
              <Text style={styles.statSubText}>
                {cafe.user_ratings_total > 0
                  ? `${cafe.user_ratings_total} reviews`
                  : 'No reviews yet'}
              </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.statItem}>
              <View style={styles.statIconRow}>
                <Ionicons name="navigate-outline" size={18} color="#6F4E37" />
                <Text style={styles.statMainText}>
                  {cafe.distance_km !== null ? `${cafe.distance_km} km` : '--'}
                </Text>
              </View>
              <Text style={styles.statSubText}>from your location</Text>
            </View>
          </View>

          {/* Location & Address Section */}
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>Location & Address</Text>
            <View style={styles.addressBox}>
              <Ionicons name="location-sharp" size={20} color="#6F4E37" style={{ marginTop: 2 }} />
              <Text style={styles.addressText}>{cafe.address}</Text>
            </View>
          </View>

          {/* About / Note */}
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>About This Spot</Text>
            <Text style={styles.aboutText}>
              Discovered via CafeFinder. Live data, status, and reviews are powered dynamically by Google Places.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Sticky Action Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.directionsActionBtn}
          onPress={handleOpenDirections}
          activeOpacity={0.85}
        >
          <Ionicons name="navigate" size={18} color="#FFFFFF" />
          <Text style={styles.directionsActionText}>Open in Google Maps</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FDFCF7',
  },
  scroll: {
    paddingBottom: 90,
  },
  centerBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FDFCF7',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: '#6F4E37',
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C1D11',
    marginTop: 10,
  },
  errorSubtitle: {
    fontSize: 13,
    color: '#8D7B68',
    marginTop: 4,
  },
  imageContainer: {
    width: '100%',
    height: 240,
    position: 'relative',
    backgroundColor: '#F5EBE0',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  statusBadge: {
    position: 'absolute',
    top: 14,
    left: 14,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  openBadge: {
    backgroundColor: '#10B981',
  },
  closedBadge: {
    backgroundColor: '#EF4444',
  },
  statusText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 12,
  },
  favoriteBtn: {
    position: 'absolute',
    top: 14,
    right: 14,
    backgroundColor: '#FFFFFF',
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },
  content: {
    padding: 20,
  },
  categoryChip: {
    alignSelf: 'flex-start',
    backgroundColor: '#EADECA',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6F4E37',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C1D11',
    lineHeight: 30,
    marginBottom: 16,
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#EADECA',
    marginBottom: 20,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statMainText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#2C1D11',
  },
  statSubText: {
    fontSize: 11,
    color: '#8D7B68',
    marginTop: 2,
  },
  divider: {
    width: 1,
    height: '80%',
    backgroundColor: '#EADECA',
    alignSelf: 'center',
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2C1D11',
    marginBottom: 8,
  },
  addressBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EADECA',
  },
  addressText: {
    flex: 1,
    fontSize: 13,
    color: '#4A3525',
    lineHeight: 20,
  },
  aboutText: {
    fontSize: 13,
    color: '#8D7B68',
    lineHeight: 20,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#EADECA',
  },
  directionsActionBtn: {
    backgroundColor: '#6F4E37',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
  },
  directionsActionText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});