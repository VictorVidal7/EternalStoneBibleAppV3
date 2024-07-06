import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useUserPreferences } from '../context/UserPreferencesContext';
import { bibleBooks } from '../data/bibleVerses';

const BibleListScreen = ({ navigation }) => {
  const { nightMode, fontSize, fontFamily } = useUserPreferences();

  const renderBookItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.bookItem, nightMode && styles.bookItemDark]}
      onPress={() => navigation.navigate('Chapter', { book: item })}
    >
      <Text style={[
        styles.bookName, 
        nightMode && styles.textDark,
        { fontFamily, fontSize: fontSize === 'small' ? 14 : fontSize === 'large' ? 18 : 16 }
      ]}>
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
    backgroundColor: '#f5f5f5',
  },
  containerDark: {
    backgroundColor: '#121212',
  },
  bookItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  bookItemDark: {
    borderBottomColor: '#333',
  },
  bookName: {
    color: '#333',
  },
  textDark: {
    color: '#fff',
  },
});

export default BibleListScreen;