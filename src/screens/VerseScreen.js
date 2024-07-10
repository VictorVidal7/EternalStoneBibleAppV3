import React, { useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useBookmarks } from '../context/BookmarksContext';
import { useUserPreferences } from '../context/UserPreferencesContext';
import { getVersesForChapter } from '../data/bibleVerses';
import { useStyles } from '../hooks/useStyles';

const VerseScreen = ({ route }) => {
  const { book, chapter } = route.params;
  const { bookmarks, addBookmark, removeBookmark } = useBookmarks();
  const { nightMode, fontSize, fontFamily } = useUserPreferences();
  const styles = useStyles(createStyles);

  const verses = getVersesForChapter(book, chapter);

  const isBookmarked = useCallback((verse) => {
    return bookmarks.some(b => b.book === book && b.chapter === chapter && b.verse === verse);
  }, [bookmarks, book, chapter]);

  const toggleBookmark = useCallback((verse) => {
    if (isBookmarked(verse)) {
      removeBookmark(book, chapter, verse);
    } else {
      addBookmark(book, chapter, verse);
    }
  }, [isBookmarked, addBookmark, removeBookmark, book, chapter]);

  const renderVerse = useCallback(({ item }) => (
    <View style={styles.verseContainer}>
      <Text style={styles.verseNumber}>{item.number}</Text>
      <Text style={styles.verseText} testID={`verse-text-${item.number}`}>{item.text}</Text>
      <TouchableOpacity onPress={() => toggleBookmark(item.number)} testID="bookmark-icon">
        <Icon 
          name={isBookmarked(item.number) ? "bookmark" : "bookmark-border"} 
          size={24} 
          color={styles.bookmarkColor}
        />
      </TouchableOpacity>
    </View>
  ), [styles, isBookmarked, toggleBookmark]);

  return (
    <View style={styles.container} testID="verse-screen-container">
      <FlatList
        data={verses}
        renderItem={renderVerse}
        keyExtractor={(item) => item.number.toString()}
        initialNumToRender={20}
        maxToRenderPerBatch={20}
        windowSize={21}
      />
    </View>
  );
};

const createStyles = (nightMode, fontSize, fontFamily) => {
  const dynamicFontSize = fontSize === 'small' ? 14 : fontSize === 'large' ? 18 : 16;

  return {
    container: {
      flex: 1,
      backgroundColor: nightMode ? '#121212' : '#f5f5f5',
    },
    verseContainer: {
      flexDirection: 'row',
      padding: 10,
      borderBottomWidth: 1,
      borderBottomColor: nightMode ? '#333' : '#e0e0e0',
      alignItems: 'center',
    },
    verseNumber: {
      marginRight: 10,
      color: nightMode ? '#888' : '#666',
      fontFamily,
      fontSize: dynamicFontSize - 2,
    },
    verseText: {
      flex: 1,
      color: nightMode ? '#fff' : '#333',
      fontFamily,
      fontSize: dynamicFontSize,
    },
    bookmarkColor: nightMode ? "#FFD700" : "#007AFF",
  };
};

export default VerseScreen;