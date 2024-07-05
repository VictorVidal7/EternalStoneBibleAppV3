import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { getVersesForChapter } from '../data/bibleVerses';
import { useUserPreferences } from '../context/UserPreferencesContext';

const VerseScreen = ({ route }) => {
  const { book, chapter } = route.params;
  const verses = getVersesForChapter(book, chapter);
  const { nightMode, fontSize, fontFamily } = useUserPreferences();

  const getFontSize = () => {
    switch (fontSize) {
      case 'small': return 14;
      case 'medium': return 16;
      case 'large': return 18;
      default: return 16;
    }
  };

  const renderVerse = ({ item }) => (
    <View style={styles.verseContainer}>
      <Text style={[styles.verseNumber, nightMode && styles.textDark, { fontFamily, fontSize: getFontSize() - 2 }]}>
        {item.number}
      </Text>
      <Text style={[styles.verseText, nightMode && styles.textDark, { fontFamily, fontSize: getFontSize() }]}>
        {item.text}
      </Text>
    </View>
  );

  return (
    <View style={[styles.container, nightMode && styles.containerDark]}>
      <Text style={[styles.header, nightMode && styles.textDark, { fontFamily, fontSize: getFontSize() + 4 }]}>
        {book} - Capítulo {chapter}
      </Text>
      <FlatList
        data={verses}
        renderItem={renderVerse}
        keyExtractor={(item) => item.number.toString()}
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
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  verseContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  verseNumber: {
    fontWeight: 'bold',
    marginRight: 10,
    minWidth: 30,
    color: '#333',
  },
  verseText: {
    flex: 1,
    color: '#333',
  },
  textDark: {
    color: '#fff',
  },
});

export default VerseScreen;