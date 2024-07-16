import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, ToastAndroid, Platform, Alert, Share, Dimensions, TextInput, FlatList } from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useBookmarks } from '../context/BookmarksContext';
import { useUserPreferences } from '../context/UserPreferencesContext';
import { useNotes } from '../context/NotesContext';
import { getChapter, getBookChapters } from '../services/bibleDataManager';
import { useStyles } from '../hooks/useStyles';
import NoteModal from '../components/NoteModal';
import { useTranslation } from 'react-i18next';
import { withTheme } from '../hoc/withTheme';
import { AnalyticsService } from '../services/AnalyticsService';

const { width } = Dimensions.get('window');

const VerseItem = React.memo(({ item, onToggleBookmark, onShareVerse, onOpenNoteModal, onCopyVerse, styles, colors, isBookmarked, isHighlighted }) => {
  if (!item) return null;
  
  return (
    <View 
      style={[
        styles.verseContainer, 
        { lineHeight: item.lineSpacing },
        isHighlighted && styles.highlightedVerse
      ]}
      accessible={true}
      accessibilityLabel={`Versículo ${item.number}: ${item.text}`}
      accessibilityRole="text"
    >
      <Text style={styles.verseNumber}>{item.number}</Text>
      <Text style={styles.verseText} testID={`verse-text-${item.number}`}>{item.text}</Text>
      <View style={styles.actionsContainer}>
        <TouchableOpacity 
          onPress={() => onToggleBookmark(item.number)}
          accessibilityLabel={isBookmarked(item.number) ? 'Quitar marcador' : 'Añadir marcador'}
          accessibilityRole="button"
        >
          <Icon 
            name={isBookmarked(item.number) ? "bookmark" : "bookmark-border"} 
            size={24} 
            color={colors.primary}
          />
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => onShareVerse(item)}
          accessibilityLabel="Compartir versículo"
          accessibilityRole="button"
        >
          <Icon name="share" size={24} color={colors.primary} />
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => onOpenNoteModal(item)}
          accessibilityLabel="Añadir nota"
          accessibilityRole="button"
        >
          <Icon name="note-add" size={24} color={colors.primary} />
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => onCopyVerse(item)}
          accessibilityLabel="Copiar versículo"
          accessibilityRole="button"
        >
          <Icon name="content-copy" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );
});

const VerseScreen = ({ route, theme }) => {
  const { book, chapter: initialChapter, initialVerse } = route.params;
  const [chapter, setChapter] = useState(initialChapter);
  const { bookmarks, addBookmark, removeBookmark } = useBookmarks();
  const { addNote, getNote } = useNotes();
  const { fontSize, fontFamily, lineSpacing } = useUserPreferences();
  const { colors } = theme;
  const styles = useStyles(createStyles);
  const [verses, setVerses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [noteModalVisible, setNoteModalVisible] = useState(false);
  const [currentVerse, setCurrentVerse] = useState(null);
  const navigation = useNavigation();
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [highlightedVerses, setHighlightedVerses] = useState([]);
  const [totalChapters, setTotalChapters] = useState(0);

  const flatListRef = useRef(null);

  const loadVerses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const chapterVerses = await getChapter(book, chapter);
      console.log('Received chapter verses:', JSON.stringify(chapterVerses, null, 2));
      if (!chapterVerses || chapterVerses.length === 0) {
        throw new Error('No verses found for this chapter');
      }
      // Verificar y limpiar los datos
      const validVerses = chapterVerses.filter(verse => {
        const isValid = verse && typeof verse.number === 'number' && typeof verse.text === 'string';
        if (!isValid) {
          console.warn('Invalid verse:', JSON.stringify(verse, null, 2));
          console.warn('Verse number type:', typeof verse.number);
          console.warn('Verse text type:', typeof verse.text);
        }
        return isValid;
      });
      console.log('Valid verses:', JSON.stringify(validVerses, null, 2));
      if (validVerses.length !== chapterVerses.length) {
        console.warn(`Some verses were invalid and have been filtered out. Original: ${chapterVerses.length}, Valid: ${validVerses.length}`);
      }
      setVerses(validVerses);
      const bookChapters = await getBookChapters(book);
      setTotalChapters(bookChapters);
      AnalyticsService.logScreenView(`Verse_${book}_${chapter}`);
    } catch (error) {
      console.error('Error loading verses:', error);
      setError(t('errorLoadingVerses'));
    } finally {
      setLoading(false);
    }
  }, [book, chapter, t]);

  useFocusEffect(
    React.useCallback(() => {
      loadVerses();
    }, [loadVerses])
  );

  useEffect(() => {
    if (initialVerse && flatListRef.current && verses.length > 0) {
      const index = verses.findIndex(v => v.number === initialVerse);
      if (index !== -1) {
        flatListRef.current.scrollToIndex({ index, animated: true });
      }
    }
  }, [initialVerse, verses]);

  const isBookmarked = useCallback((verse) => {
    return bookmarks.some(b => b.book === book && b.chapter === chapter && b.verse === verse);
  }, [bookmarks, book, chapter]);

  const toggleBookmark = useCallback((verse) => {
    if (isBookmarked(verse)) {
      removeBookmark(book, chapter, verse);
      AnalyticsService.logEvent('remove_bookmark', { book, chapter, verse });
    } else {
      addBookmark(book, chapter, verse);
      AnalyticsService.logEvent('add_bookmark', { book, chapter, verse });
    }
  }, [isBookmarked, addBookmark, removeBookmark, book, chapter]);

  const shareVerse = useCallback(async (verse) => {
    try {
      const result = await Share.share({
        message: `${verse.text} - ${book} ${chapter}:${verse.number}`,
        title: t('shareVerseTitle', { book, chapter, number: verse.number }),
      });
      if (result.action === Share.sharedAction) {
        console.log('Shared successfully');
        AnalyticsService.logEvent('share_verse', { book, chapter, verse: verse.number });
      }
    } catch (error) {
      console.error('Error sharing verse:', error);
      Alert.alert(t('error'), t('errorSharingVerse'));
    }
  }, [book, chapter, t]);

  const copyVerse = useCallback((verse) => {
    Clipboard.setString(`${verse.text} - ${book} ${chapter}:${verse.number}`);
    if (Platform.OS === 'android') {
      ToastAndroid.show(t('verseCopied'), ToastAndroid.SHORT);
    } else {
      Alert.alert(t('copied'), t('verseCopied'));
    }
    AnalyticsService.logEvent('copy_verse', { book, chapter, verse: verse.number });
  }, [book, chapter, t]);

  const openNoteModal = useCallback((verse) => {
    setCurrentVerse(verse);
    setNoteModalVisible(true);
  }, []);

  const closeNoteModal = useCallback(() => {
    setNoteModalVisible(false);
  }, []);

  const saveNote = useCallback((noteText) => {
    if (currentVerse) {
      addNote(book, chapter, currentVerse.number, noteText);
      AnalyticsService.logEvent('add_note', { book, chapter, verse: currentVerse.number });
    }
    setNoteModalVisible(false);
  }, [addNote, book, chapter, currentVerse]);

  const handleSearch = useCallback(() => {
    if (searchQuery.trim() === '') {
      setHighlightedVerses([]);
      return;
    }
    const lowercaseQuery = searchQuery.toLowerCase();
    const matchingVerses = verses.filter(verse => 
      verse.text.toLowerCase().includes(lowercaseQuery)
    ).map(verse => verse.number);
    setHighlightedVerses(matchingVerses);
    if (matchingVerses.length > 0 && flatListRef.current) {
      const index = verses.findIndex(v => v.number === matchingVerses[0]);
      if (index !== -1) {
        flatListRef.current.scrollToIndex({ index, animated: true });
      }
    }
    AnalyticsService.logEvent('search_within_chapter', { book, chapter, query: searchQuery });
  }, [searchQuery, verses, book, chapter]);

  const navigateToChapter = useCallback((newChapter) => {
    if (newChapter > 0 && newChapter <= totalChapters) {
      setChapter(newChapter);
      setSearchQuery('');
      setHighlightedVerses([]);
      AnalyticsService.logEvent('navigate_chapter', { book, from: chapter, to: newChapter });
    }
  }, [totalChapters, chapter, book]);

  const renderItem = useCallback(({ item, index }) => {
    if (!item) return null;
    return (
      <VerseItem
        item={item}
        onToggleBookmark={toggleBookmark}
        onShareVerse={shareVerse}
        onOpenNoteModal={openNoteModal}
        onCopyVerse={copyVerse}
        styles={styles}
        colors={colors}
        isBookmarked={isBookmarked}
        isHighlighted={highlightedVerses.includes(item.number)}
      />
    );
  }, [toggleBookmark, shareVerse, openNoteModal, copyVerse, styles, colors, isBookmarked, highlightedVerses]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadVerses}>
          <Text style={styles.retryButtonText}>{t('retry')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container} testID="verse-screen-container">
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigateToChapter(chapter - 1)} disabled={chapter === 1}>
          <Icon name="chevron-left" size={24} color={chapter === 1 ? colors.secondary : colors.primary} />
        </TouchableOpacity>
        <Text style={styles.chapterTitle}>{`${book} ${chapter}`}</Text>
        <TouchableOpacity onPress={() => navigateToChapter(chapter + 1)} disabled={chapter === totalChapters}>
          <Icon name="chevron-right" size={24} color={chapter === totalChapters ? colors.secondary : colors.primary} />
        </TouchableOpacity>
      </View>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder={t('searchInChapter')}
          placeholderTextColor={colors.secondary}
        />
        <TouchableOpacity onPress={handleSearch}>
          <Icon name="search" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>
      <FlatList
        ref={flatListRef}
        data={verses}
        renderItem={renderItem}
        keyExtractor={(item, index) => `verse-${item?.number || index}`}
        initialNumToRender={20}
        maxToRenderPerBatch={20}
        windowSize={21}
        removeClippedSubviews={true}
        getItemLayout={(data, index) => (
          {length: 120, offset: 120 * index, index}
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>{t('noVersesFound')}</Text>
        }
      />
      <NoteModal 
        visible={noteModalVisible}
        onClose={closeNoteModal}
        verse={currentVerse}
        onSave={saveNote}
        initialNote={currentVerse ? getNote(book, chapter, currentVerse.number) : ''}
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
    errorContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: nightMode ? '#121212' : '#f5f5f5',
    },
    errorText: {
      color: nightMode ? '#fff' : '#333',
      fontSize: 16,
      marginBottom: 20,
      textAlign: 'center',
    },
    retryButton: {
      backgroundColor: nightMode ? '#2196F3' : '#007AFF',
      padding: 10,
      borderRadius: 5,
    },
    retryButtonText: {
      color: '#fff',
      fontSize: 16,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 10,
      backgroundColor: nightMode ? '#1E1E1E' : '#FFFFFF',
    },
    chapterTitle: {
      fontSize: dynamicFontSize + 2,
      fontWeight: 'bold',
      color: nightMode ? '#FFFFFF' : '#000000',
      fontFamily,
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 10,
      backgroundColor: nightMode ? '#1E1E1E' : '#FFFFFF',
    },
    searchInput: {
      flex: 1,
      height: 40,
      borderWidth: 1,
      borderColor: nightMode ? '#333333' : '#CCCCCC',
      borderRadius: 5,
      paddingHorizontal: 10,
      marginRight: 10,
      color: nightMode ? '#FFFFFF' : '#000000',
      fontFamily,
      fontSize: dynamicFontSize,
    },
    verseContainer: {
      flexDirection: 'row',
      padding: 10,
      borderBottomWidth: 1,
      borderBottomColor: nightMode ? '#333' : '#e0e0e0',
      alignItems: 'center',
    },
    highlightedVerse: {
      backgroundColor: nightMode ? '#2C2C2C' : '#FFFDE7',
    },
    verseNumber: {
      marginRight: 10,
      color: nightMode ? '#888' : '#666',
      fontFamily,
      fontSize: dynamicFontSize - 2,
      minWidth: 30,
      textAlign: 'right',
    },
    verseText: {
      flex: 1,
      color: nightMode ? '#fff' : '#333',
      fontFamily,
      fontSize: dynamicFontSize,
    },
    actionsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: 120,
      marginLeft: 10,
    },
    emptyText: {
      color: nightMode ? '#fff' : '#333',
      fontSize: 16,
      textAlign: 'center',
      marginTop: 20,
    },
  };
};

export default React.memo(withTheme(VerseScreen));