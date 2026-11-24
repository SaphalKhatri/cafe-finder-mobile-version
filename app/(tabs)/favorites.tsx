import React from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import { getFavorites, removeFavorite } from '../../services/favoriteService';
import { CafeCard } from '../../components/CafeCard';
import { Cafe } from '../../types/cafe';

export default function FavoritesScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();

  // Fetch saved favorites from backend
  const {
    data: favorites = [],
    isLoading,
    isError,
    refetch,
    isRefetching,
  } = useQuery<Cafe[]>({
    queryKey: ['favorites'],
    queryFn: getFavorites,
  });

  // Delete mutation with optimistic cache refresh
  const deleteMutation = useMutation({
    mutationFn: (placeId: string) => removeFavorite(placeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
  });

  const handleCafePress = (cafe: Cafe) => {
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
      {/* Loading State */}
      {isLoading ? (
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color="#6F4E37" />
          <Text style={styles.loadingText}>Loading your favorites...</Text>
        </View>
      ) : isError ? (
        /* Error State */
        <View style={styles.centerBox}>
          <Ionicons name="alert-circle-outline" size={44} color="#EF4444" />
          <Text style={styles.errorTitle}>Could not load favorites</Text>
          <Text style={styles.errorSubtitle}>Please check your connection to Django.</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={() => refetch()}>
            <Text style={styles.retryBtnText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : favorites.length === 0 ? (
        /* Empty State */
        <View style={styles.centerBox}>
          <View style={styles.emptyIconBg}>
            <Ionicons name="heart-outline" size={36} color="#8D7B68" />
          </View>
          <Text style={styles.emptyTitle}>No saved cafes yet</Text>
          <Text style={styles.emptySubtitle}>
            Tap the heart icon on any cafe details screen to save it for quick access here.
          </Text>
        </View>
      ) : (
        /* Favorites List */
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingVertical: 14 }}
          renderItem={({ item }) => (
            <View style={styles.itemWrapper}>
              <CafeCard cafe={item} onPress={() => handleCafePress(item)} />
              {/* Quick Remove Button */}
              <TouchableOpacity
                style={styles.quickRemoveBtn}
                onPress={() => deleteMutation.mutate(item.id)}
                activeOpacity={0.7}
              >
                <Ionicons name="trash-outline" size={16} color="#EF4444" />
                <Text style={styles.quickRemoveText}>Remove</Text>
              </TouchableOpacity>
            </View>
          )}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={async () => {
               await refetch();
              }}
              colors={['#6F4E37']}
            />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDFCF7',
  },
  centerBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 13,
    color: '#6F4E37',
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2C1D11',
    marginTop: 10,
  },
  errorSubtitle: {
    fontSize: 13,
    color: '#8D7B68',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 14,
  },
  retryBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#6F4E37',
    borderRadius: 10,
  },
  retryBtnText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 13,
  },
  emptyIconBg: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#EADECA',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2C1D11',
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#8D7B68',
    textAlign: 'center',
    maxWidth: 280,
    lineHeight: 18,
  },
  itemWrapper: {
    position: 'relative',
    marginBottom: 6,
  },
  quickRemoveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-end',
    marginRight: 24,
    marginTop: -8,
    marginBottom: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: '#FEE2E2',
    borderRadius: 8,
  },
  quickRemoveText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#EF4444',
  },
});