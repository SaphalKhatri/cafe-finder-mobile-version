import { Stack } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60 * 5, // 5 minutes cache
    },
  },
});

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        {/* The 3 main tabs */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        {/* Cafe Details Screen (opens on top as a subscreen) */}
        <Stack.Screen
          name="cafe/[id]"
          options={{
            headerShown: true,
            title: 'Cafe Details',
            headerTintColor: '#4A3525',
            headerStyle: { backgroundColor: '#FDFCF7' },
          }}
        />
      </Stack>
    </QueryClientProvider>
  );
}