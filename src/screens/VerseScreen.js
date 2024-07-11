import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useBookmarks } from '../context/BookmarksContext';
import { useUserPreferences } from '../context/UserPreferencesContext';
import { getChapter } from '../services/bibleDataManager';
import { useStyles } from '../hooks/useStyles';

const VerseScreen = ({ route }) => {
  const { book, chapter } = route.params;
  const { bookmarks, addBookmark, removeBookmark } = useBookmarks();
  const { nightMode, fontSize, fontFamily } = useUserPreferences();
  const styles = useStyles(createStyles);
  const [verses, setVerses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadVerses = async () => {
      try {
        setLoading(true);
        const chapterVerses = await getChapter(book, chapter);
        setVerses(chapterVerses);
      } catch (error) {
        console.error('Error loading verses:', error);
        // Here you might want to show an error message to the user
      } finally {
        setLoading(false);
      }
    };
    loadVerses();
  }, [book, chapter]);

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
      <TouchableOpacity 
        onPress={() => toggleBookmark(item.number)} 
        testID={`bookmark-icon-${item.number}`}
        accessibilityLabel={`Marcar versículo ${item.number}`}
        accessibilityHint={isBookmarked(item.number) ? "Pulse para quitar el marcador" : "Pulse para añadir un marcador"}
      >
        <Icon 
          name={isBookmarked(item.number) ? "bookmark" : "bookmark-border"} 
          size={24} 
          color={styles.bookmarkColor}
        />
      </TouchableOpacity>
    </View>
  ), [styles, isBookmarked, toggleBookmark]);

  const getItemLayout = useCallback((data, index) => ({
    length: 60,
    offset: 60 * index,
    index,
  }), []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={styles.loadingColor} />
      </View>
    );
  }

  return (
    <View style={styles.container} testID="verse-screen-container">
      <FlatList
        data={verses}
        renderItem={renderVerse}
        keyExtractor={(item) => item.number.toString()}
        initialNumToRender={10}
        maxToRenderPerBatch={20}
        windowSize={21}
        getItemLayout={getItemLayout}
        removeClippedSubviews={true}
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
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: nightMode ? '#121212' : '#f5f5f5',
    },
    loadingColor: nightMode ? '#ffffff' : '#000000',
    verseContainer: {
      flexDirection: 'row',
      padding: 10,
      borderBottomWidth: 1,
      borderBottomColor: nightMode ? '#333' : '#e0e0e0',
      alignItems: 'center',
      minHeight: 60,
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