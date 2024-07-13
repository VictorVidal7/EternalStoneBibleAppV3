import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useBookmarks } from '../context/BookmarksContext';
import { useStyles } from '../hooks/useStyles';
import { getVerse } from '../services/bibleDataManager';

const BATCH_SIZE = 10; // Number of bookmarks to load at a time

const BookmarksScreen = () => {
  const navigation = useNavigation();
  const { bookmarks, removeBookmark } = useBookmarks();
  const styles = useStyles(createStyles);
  const [bookmarksWithPreview, setBookmarksWithPreview] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadBookmarksWithPreview();
  }, [bookmarks]);

  const loadBookmarksWithPreview = async () => {
    setLoading(true);
    setError(null);
    try {
      let loadedBookmarks = [];
      for (let i = 0; i < bookmarks.length; i += BATCH_SIZE) {
        const batch = bookmarks.slice(i, i + BATCH_SIZE);
        const batchWithVerses = await Promise.all(
          batch.map(async (bookmark) => {
            try {
              const verse = await getVerse(bookmark.book, bookmark.chapter, bookmark.verse);
              return { ...bookmark, verseText: verse.text };
            } catch (error) {
              console.error('Error loading verse:', error);
              return { ...bookmark, verseText: 'Error al cargar el versículo' };
            }
          })
        );
        loadedBookmarks = [...loadedBookmarks, ...batchWithVerses];
        setBookmarksWithPreview(loadedBookmarks);
      }
    } catch (error) {
      console.error('Error loading bookmarks:', error);
      setError('Error al cargar los marcadores. Por favor, inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const renderBookmark = useCallback(({ item }) => (
    <TouchableOpacity
      style={styles.bookmarkItem}
      onPress={() => navigation.navigate('Verse', { book: item.book, chapter: item.chapter, verse: item.verse })}
    >
      <Text style={styles.bookmarkReference}>{item.book} {item.chapter}:{item.verse}</Text>
      <Text style={styles.bookmarkPreview} numberOfLines={2}>{item.verseText}</Text>
      <TouchableOpacity 
        style={styles.removeButton}
        onPress={() => removeBookmark(item.book, item.chapter, item.verse)}
      >
        <Text style={styles.removeButtonText}>Eliminar</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  ), [navigation, styles, removeBookmark]);

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadBookmarksWithPreview}>
          <Text style={styles.retryButtonText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={bookmarksWithPreview}
        renderItem={renderBookmark}
        keyExtractor={(item, index) => `${item.book}-${item.chapter}-${item.verse}-${index}`}
        ListEmptyComponent={
          loading ? (
            <ActivityIndicator size="large" color={styles.loadingColor} />
          ) : (
            <Text style={styles.emptyText}>No tienes marcadores guardados.</Text>
          )
        }
        onRefresh={loadBookmarksWithPreview}
        refreshing={loading}
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
      padding: 10,
    },
    bookmarkItem: {
      padding: 15,
      borderBottomWidth: 1,
      borderBottomColor: nightMode ? '#333' : '#e0e0e0',
      backgroundColor: nightMode ? '#1e1e1e' : 'white',
      marginBottom: 10,
      borderRadius: 5,
    },
    bookmarkReference: {
      fontWeight: 'bold',
      color: nightMode ? '#fff' : '#333',
      fontFamily,
      fontSize: dynamicFontSize,
      marginBottom: 5,
    },
    bookmarkPreview: {
      color: nightMode ? '#ccc' : '#666',
      fontFamily,
      fontSize: dynamicFontSize - 2,
      fontStyle: 'italic',
    },
    emptyText: {
      textAlign: 'center',
      marginTop: 20,
      color: nightMode ? '#999' : '#666',
      fontFamily,
      fontSize: dynamicFontSize,
    },
    loadingColor: nightMode ? '#ffffff' : '#000000',
    removeButton: {
      marginTop: 10,
      alignSelf: 'flex-end',
      padding: 5,
      backgroundColor: nightMode ? '#ff4444' : '#ff6b6b',
      borderRadius: 5,
    },
    removeButtonText: {
      color: 'white',
      fontFamily,
      fontSize: dynamicFontSize - 2,
    },
    errorText: {
      textAlign: 'center',
      color: nightMode ? '#ff6b6b' : '#ff4444',
      fontFamily,
      fontSize: dynamicFontSize,
      marginBottom: 20,
    },
    retryButton: {
      alignSelf: 'center',
      padding: 10,
      backgroundColor: nightMode ? '#4CAF50' : '#45b549',
      borderRadius: 5,
    },
    retryButtonText: {
      color: 'white',
      fontFamily,
      fontSize: dynamicFontSize,
    },
  };
};

export default React.memo(BookmarksScreen);