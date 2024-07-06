import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useUserPreferences } from '../context/UserPreferencesContext';
import { useBookmarks } from '../context/BookmarksContext';
import { getVersesForChapter } from '../data/bibleVerses';
import Icon from 'react-native-vector-icons/MaterialIcons';

const VerseScreen = ({ route }) => {
  const { book, chapter } = route.params;
  const { nightMode, fontSize, fontFamily } = useUserPreferences();
  const { bookmarks, addBookmark, removeBookmark } = useBookmarks();

  const verses = getVersesForChapter(book, chapter);

  const isBookmarked = (verse) => {
    return bookmarks.some(b => b.book === book && b.chapter === chapter && b.verse === verse);
  };

  const toggleBookmark = (verse) => {
    if (isBookmarked(verse)) {
      removeBookmark(book, chapter, verse);
    } else {
      addBookmark(book, chapter, verse);
    }
  };

  const renderVerse = ({ item }) => (
    <View style={styles.verseContainer}>
      <Text style={[
        styles.verseNumber, 
        nightMode && styles.textDark,
        { fontFamily, fontSize: fontSize === 'small' ? 12 : fontSize === 'large' ? 16 : 14 }
      ]}>
        {item.number}
      </Text>
      <Text style={[
        styles.verseText, 
        nightMode && styles.textDark,
        { fontFamily, fontSize: fontSize === 'small' ? 14 : fontSize === 'large' ? 18 : 16 }
      ]}>
        {item.text}
      </Text>
      <TouchableOpacity onPress={() => toggleBookmark(item.number)}>
        <Icon 
          name={isBookmarked(item.number) ? "bookmark" : "bookmark-border"} 
          size={24} 
          color={nightMode ? "#FFD700" : "#007AFF"}
        />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={[styles.container, nightMode && styles.containerDark]}>
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
    backgroundColor: '#f5f5f5',
  },
  containerDark: {
    backgroundColor: '#121212',
  },
  verseContainer: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  verseNumber: {
    marginRight: 10,
    color: '#666',
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