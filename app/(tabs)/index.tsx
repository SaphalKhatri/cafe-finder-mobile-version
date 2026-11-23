import React, { useState } from 'react';
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
import { useQuery } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import { SearchBar } from '../../components/SearchBar';
import { CafeCard } from '../../components/CafeCard';
import { useLocation } from '../../hooks/useLocation';
import { searchCafes } from '../../services/cafeService';
import { Cafe } from '../../types/cafe';

export default function DiscoverScreen() {
  const router = useRouter();
  const [query, setQuery] = useState('coffee');
  const { latitude, longitude, loading: locLoading, error: locError, refreshLocation } = useLocation();

  const {
    data: cafes = [],
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = useQuery<Cafe[]>({
    queryKey: ['cafes', query, latitude, longitude],
    queryFn: () =>searchCafes(query,latitude ?? undefined,longitude ?? undefined),
  });

  const handleCafePress = (cafe: Cafe) => {
    router.push({
  pathname: '/cafe/[id]',
  params: {
    id: cafe.id,
    cafeData: JSON.stringify(cafe),
  },
});
  };

  return (
    <View style={styles.container}>
      <SearchBar onSearch={setQuery} initialQuery={query} />

      {/* GPS Location Status Banner */}
      {locError && (
        <View style={styles.warningBanner}>
          <Ionicons name="information-circle-outline" size={16} color="#B45309" />
          <Text style={styles.warningText}>{locError}</Text>
        </View>
      )}

      {/* Loading State */}
      {isLoading ? (
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color="#6F4E37" />
          <Text style={styles.loadingText}>Finding great spots near you...</Text>
        </View>
      ) : isError ? (
        /* Error State */
        <View style={styles.centerBox}>
          <Ionicons name="alert-circle-outline" size={44} color="#EF4444" />
          <Text style={styles.errorTitle}>Could not load cafes</Text>
          <Text style={styles.errorSubtitle}>
            {error instanceof Error ? error.message : 'Please check your connection to Django.'}
          </Text>
          <TouchableOpacity style={styles.retryBtn} onPress={() => refetch()}>
            <Text style={styles.retryBtnText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : cafes.length === 0 ? (
        /* Empty State */
        <View style={styles.centerBox}>
          <Ionicons name="cafe-outline" size={48} color="#C4A482" />
          <Text style={styles.emptyTitle}>No cafes found</Text>
          <Text style={styles.emptySubtitle}>Try searching for another food craving.</Text>
        </View>
      ) : (
        /* Cafe Results List */
        <FlatList
          data={cafes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <CafeCard cafe={item} onPress={() => handleCafePress(item)} />
          )}
          contentContainerStyle={{ paddingVertical: 10 }}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={() => {
                refreshLocation();
                refetch();
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
  warningBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 10,
  },
  warningText: {
    fontSize: 12,
    color: '#92400E',
    flex: 1,
  },
  centerBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
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
    marginBottom: 16,
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
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2C1D11',
    marginTop: 12,
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#8D7B68',
    marginTop: 4,
  },
});