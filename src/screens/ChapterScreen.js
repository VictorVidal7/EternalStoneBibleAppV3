import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { bibleBooks } from '../data/bibleVerses';
import { useUserPreferences } from '../context/UserPreferencesContext';

const ChapterScreen = ({ route, navigation }) => {
  const { book } = route.params;
  const { nightMode, fontSize, fontFamily } = useUserPreferences();

  const getFontSize = () => {
    switch (fontSize) {
      case 'small': return 14;
      case 'medium': return 16;
      case 'large': return 18;
      default: return 16;
    }
  };

  const renderChapter = ({ item }) => (
    <TouchableOpacity
      style={[styles.chapterItem, nightMode && styles.chapterItemDark]}
      onPress={() => navigation.navigate('Verse', { book, chapter: item })}
    >
      <Text style={[styles.chapterText, nightMode && styles.textDark, { fontFamily, fontSize: getFontSize() }]}>
        {item}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, nightMode && styles.containerDark]}>
      <Text style={[styles.bookTitle, nightMode && styles.textDark, { fontFamily, fontSize: getFontSize() + 4 }]}>
        {book}
      </Text>
      <FlatList
        data={[...Array(bibleBooks[book]).keys()].map(i => i + 1)}
        renderItem={renderChapter}
        keyExtractor={(item) => item.toString()}
        numColumns={3}
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
  bookTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  chapterItem: {
    flex: 1,
    margin: 5,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chapterItemDark: {
    backgroundColor: '#1e1e1e',
  },
  chapterText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  textDark: {
    color: '#fff',
  },
});

export default ChapterScreen;