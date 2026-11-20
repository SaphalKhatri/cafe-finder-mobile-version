import { View, Text, StyleSheet } from 'react-native';

export default function FavoritesScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>❤️ Saved Cafes</Text>
      <Text style={styles.subtitle}>Your favorite spots will appear here.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDFCF7',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2C1D11',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#6F4E37',
  },
});