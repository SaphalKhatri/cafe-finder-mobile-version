import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Cafe } from '../types/cafe';
import { getFullImageUrl } from '../services/cafeService';
import { PLACEHOLDER_IMAGE } from '../constants/config';

interface CafeCardProps {
  cafe: Cafe;
  onPress: () => void;
}

export const CafeCard: React.FC<CafeCardProps> = ({ cafe, onPress }) => {
  const [imgSrc, setImgSrc] = useState({ uri: getFullImageUrl(cafe.photo_url) });

  return (
    <TouchableOpacity activeOpacity={0.85} style={styles.card} onPress={onPress}>
      <View style={styles.imageContainer}>
        <Image
          source={imgSrc}
          style={styles.image}
          onError={() => setImgSrc({ uri: PLACEHOLDER_IMAGE })}
        />
        {cafe.is_open !== null && (
          <View style={[styles.badge, cafe.is_open ? styles.openBadge : styles.closedBadge]}>
            <Text style={styles.badgeText}>{cafe.is_open ? 'Open' : 'Closed'}</Text>
          </View>
        )}
      </View>

      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Text style={styles.name} numberOfLines={1}>
            {cafe.name}
          </Text>
          {cafe.distance_km !== null && (
            <View style={styles.distanceBadge}>
              <Ionicons name="navigate-outline" size={11} color="#6F4E37" />
              <Text style={styles.distanceText}>{cafe.distance_km} km</Text>
            </View>
          )}
        </View>

        <View style={styles.ratingRow}>
          {cafe.rating !== null ? (
            <>
              <Ionicons name="star" size={14} color="#F59E0B" />
              <Text style={styles.ratingText}>{cafe.rating.toFixed(1)}</Text>
              <Text style={styles.reviewCount}>({cafe.user_ratings_total})</Text>
            </>
          ) : (
            <Text style={styles.noRating}>No reviews yet</Text>
          )}
          <Text style={styles.dot}>•</Text>
          <Text style={styles.category} numberOfLines={1}>
            {cafe.category}
          </Text>
        </View>

        <View style={styles.addressRow}>
          <Ionicons name="location-outline" size={13} color="#8D7B68" style={{ marginTop: 1 }} />
          <Text style={styles.addressText} numberOfLines={1}>
            {cafe.address}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#EADECA',
    overflow: 'hidden',
    elevation: 2, // Android drop shadow
  },
  imageContainer: {
    width: '100%',
    height: 150,
    backgroundColor: '#F5EBE0',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  badge: {
    position: 'absolute',
    top: 10,
    right: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  openBadge: {
    backgroundColor: '#10B981',
  },
  closedBadge: {
    backgroundColor: '#EF4444',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  content: {
    padding: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  name: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: '#2C1D11',
    marginRight: 8,
  },
  distanceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F5EE',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    gap: 3,
  },
  distanceText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6F4E37',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 4,
  },
  ratingText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2C1D11',
  },
  reviewCount: {
    fontSize: 11,
    color: '#8D7B68',
  },
  noRating: {
    fontSize: 12,
    color: '#8D7B68',
    fontStyle: 'italic',
  },
  dot: {
    color: '#C4A482',
    marginHorizontal: 2,
  },
  category: {
    fontSize: 12,
    color: '#6F4E37',
    flex: 1,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  addressText: {
    fontSize: 12,
    color: '#8D7B68',
    flex: 1,
  },
});