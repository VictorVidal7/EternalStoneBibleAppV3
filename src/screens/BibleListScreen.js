import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { bibleBooks } from '../data/bibleVerses';
import { useUserPreferences } from '../context/UserPreferencesContext';

const BibleListScreen = ({ navigation }) => {
  const { nightMode, fontSize, fontFamily } = useUserPreferences();

  const getFontSize = () => {
    switch (fontSize) {
      case 'small': return 14;
      case 'medium': return 16;
      case 'large': return 18;
      default: return 16;
    }
  };

  const renderBookItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.bookItem, nightMode && styles.bookItemDark]}
      onPress={() => navigation.navigate('Chapter', { book: item })}
    >
      <Text style={[styles.bookName, nightMode && styles.textDark, { fontFamily, fontSize: getFontSize() }]}>
        {item}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, nightMode && styles.containerDark]}>
      <FlatList
        data={Object.keys(bibleBooks)}
        renderItem={renderBookItem}
        keyExtractor={(item) => item}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  containerDark: {
    backgroundColor: '#121212',
  },
  bookItem: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  bookItemDark: {
    backgroundColor: '#1e1e1e',
  },
  bookName: {
    color: '#333',
  },
  textDark: {
    color: '#fff',
  },
});

export default BibleListScreen;