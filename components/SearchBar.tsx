import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Text,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SearchBarProps {
  onSearch: (text: string) => void;
  initialQuery?: string;
}

const CHIPS = ['Coffee', 'Bakery', 'Pizza', 'Momos', 'Dessert'];

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch, initialQuery = 'coffee' }) => {
  const [text, setText] = useState(initialQuery);

  const handleSearch = () => {
    if (text.trim()) {
      onSearch(text.trim());
    }
  };

  const handleChipPress = (chip: string) => {
    setText(chip);
    onSearch(chip);
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchBox}>
        <Ionicons name="search" size={20} color="#8D7B68" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="What are you craving? (e.g. Coffee, Pizza)"
          placeholderTextColor="#A89F91"
          value={text}
          onChangeText={setText}
          returnKeyType="search"
          onSubmitEditing={handleSearch}
        />
        {text.length > 0 && (
          <TouchableOpacity onPress={() => setText('')} hitSlop={10}>
            <Ionicons name="close-circle" size={18} color="#A89F91" />
          </TouchableOpacity>
        )}
      </View>

      {/* Quick Suggestion Chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipsContainer}
      >
        {CHIPS.map((chip) => (
          <TouchableOpacity
            key={chip}
            style={[styles.chip, text.toLowerCase() === chip.toLowerCase() && styles.activeChip]}
            onPress={() => handleChipPress(chip)}
          >
            <Text
              style={[
                styles.chipText,
                text.toLowerCase() === chip.toLowerCase() && styles.activeChipText,
              ]}
            >
              {chip}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
    backgroundColor: '#FDFCF7',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 12,
    height: 48,
    borderWidth: 1,
    borderColor: '#EADECA',
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#2C1D11',
  },
  chipsContainer: {
    paddingVertical: 10,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#EADECA',
    marginRight: 6,
  },
  activeChip: {
    backgroundColor: '#6F4E37',
    borderColor: '#6F4E37',
  },
  chipText: {
    fontSize: 13,
    color: '#6F4E37',
    fontWeight: '600',
  },
  activeChipText: {
    color: '#FFFFFF',
  },
});