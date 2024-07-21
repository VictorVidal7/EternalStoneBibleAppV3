import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ToastAndroid,
  Platform,
  Alert,
  Share,
  Dimensions,
  TextInput,
  FlatList,
  Animated,
  StyleSheet
} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import Slider from '@react-native-community/slider';
import { useBookmarks } from '../context/BookmarksContext';
import { useUserPreferences } from '../context/UserPreferencesContext';
import { useNotes } from '../context/NotesContext';
import { getChapter, getBookChapters, getNextChapter, getPreviousChapter } from '../services/bibleDataManager';
import { useStyles } from '../hooks/useStyles';
import NoteModal from '../components/NoteModal';
import DistractionFreeMode from '../components/DistractionFreeMode';
import { useTranslation } from 'react-i18next';
import { withTheme } from '../hoc/withTheme';
import { AnalyticsService } from '../services/AnalyticsService';

const { width } = Dimensions.get('window');
const INITIAL_VERSES_TO_LOAD = 20;
const VERSES_PER_BATCH = 10;

const VerseItem = React.memo(({ item, onToggleBookmark, onShareVerse, onOpenNoteModal, onCopyVerse, styles, colors, isBookmarked, isHighlighted }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  const animatePress = useCallback(() => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.95, duration: 100, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, friction: 4, useNativeDriver: true })
    ]).start();
  }, [scaleAnim]);

  if (!item) return null;
  
  return (
    <Animated.View 
      style={[
        styles.verseContainer, 
        { 
          opacity: fadeAnim, 
          transform: [{ scale: scaleAnim }],
        },
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
          onPress={() => {
            animatePress();
            onToggleBookmark(item.number);
          }}
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
          onPress={() => {
            animatePress();
            onShareVerse(item);
          }}
          accessibilityLabel="Compartir versículo"
          accessibilityRole="button"
        >
          <Icon name="share" size={24} color={colors.primary} />
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => {
            animatePress();
            onOpenNoteModal(item);
          }}
          accessibilityLabel="Añadir nota"
          accessibilityRole="button"
        >
          <Icon name="note-add" size={24} color={colors.primary} />
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => {
            animatePress();
            onCopyVerse(item);
          }}
          accessibilityLabel="Copiar versículo"
          accessibilityRole="button"
        >
          <Icon name="content-copy" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
});

const VerseScreen = ({ route, theme }) => {
  const { book, chapter: initialChapter, initialVerse } = route.params;
  const [chapter, setChapter] = useState(initialChapter);
  const { bookmarks, addBookmark, removeBookmark } = useBookmarks();
  const { addNote, getNote } = useNotes();
  const { fontSize, changeFontSize, fontFamily, lineSpacing } = useUserPreferences();
  const [localFontSize, setLocalFontSize] = useState(fontSize);
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
  const [isDistractionFreeMode, setIsDistractionFreeMode] = useState(false);
  const [currentVerseIndex, setCurrentVerseIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [hasMoreVerses, setHasMoreVerses] = useState(true);

  const listRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  const loadVerses = useCallback(async (bookToLoad, chapterToLoad, start = 0, limit = INITIAL_VERSES_TO_LOAD) => {
    try {
      setLoading(true);
      setError(null);
      const chapterVerses = await getChapter(bookToLoad, chapterToLoad, start, limit);
      if (!chapterVerses || chapterVerses.length === 0) {
        throw new Error('No verses found for this chapter');
      }
      setVerses(prevVerses => start === 0 ? chapterVerses : [...prevVerses, ...chapterVerses]);
      setHasMoreVerses(chapterVerses.length === limit);
      const bookChapters = await getBookChapters(bookToLoad);
      setTotalChapters(bookChapters);
      AnalyticsService.logScreenView(`Verse_${bookToLoad}_${chapterToLoad}`);
    } catch (error) {
      console.error('Error loading verses:', error);
      setError(t('errorLoadingVerses'));
    } finally {
      setLoading(false);
      setIsTransitioning(false);
    }
  }, [t]);

  useEffect(() => {
    loadVerses(book, chapter);
  }, [book, chapter, loadVerses]);

  useEffect(() => {
    if (initialVerse && listRef.current) {
      const index = verses.findIndex(v => v.number === initialVerse);
      if (index !== -1) {
        listRef.current.scrollToIndex({ index, animated: true });
        setCurrentVerseIndex(index);
      }
    }
  }, [initialVerse, verses]);

  const animateTransition = useCallback((direction) => {
    setIsTransitioning(true);
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0.5,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: -100 * direction,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => {
      slideAnim.setValue(100 * direction);
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setIsTransitioning(false);
      });
    });
  }, [fadeAnim, slideAnim]);

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
    if (matchingVerses.length > 0 && listRef.current) {
      const index = verses.findIndex(v => v.number === matchingVerses[0]);
      if (index !== -1) {
        listRef.current.scrollToIndex({ index, animated: true });
      }
    }
    AnalyticsService.logEvent('search_within_chapter', { book, chapter, query: searchQuery });
  }, [searchQuery, verses, book, chapter]);

  const navigateToChapter = useCallback((newChapter) => {
    if (newChapter > 0 && newChapter <= totalChapters && !isTransitioning) {
      const direction = newChapter > chapter ? 1 : -1;
      animateTransition(direction);
      setChapter(newChapter);
      setSearchQuery('');
      setHighlightedVerses([]);
      loadVerses(book, newChapter);
      AnalyticsService.logEvent('navigate_chapter', { book, from: chapter, to: newChapter });
    }
  }, [totalChapters, chapter, book, animateTransition, isTransitioning, loadVerses]);

  const handleGesture = ({ nativeEvent }) => {
    if (nativeEvent.state === State.END) {
      if (nativeEvent.translationX > 50) {
        const prevChapter = getPreviousChapter(book, chapter);
        if (prevChapter) {
          navigateToChapter(prevChapter.chapter);
        }
      } else if (nativeEvent.translationX < -50) {
        const nextChapter = getNextChapter(book, chapter);
        if (nextChapter) {
          navigateToChapter(nextChapter.chapter);
        }
      }
    }
  };

  const toggleDistractionFreeMode = useCallback(() => {
    setIsDistractionFreeMode(prev => !prev);
    AnalyticsService.logEvent('toggle_distraction_free_mode', { enabled: !isDistractionFreeMode });
  }, [isDistractionFreeMode]);

  const handleNextVerse = useCallback(() => {
    if (currentVerseIndex < verses.length - 1) {
      setCurrentVerseIndex(prev => prev + 1);
    }
  }, [currentVerseIndex, verses.length]);

  const handlePreviousVerse = useCallback(() => {
    if (currentVerseIndex > 0) {
      setCurrentVerseIndex(prev => prev - 1);
    }
  }, [currentVerseIndex]);

  const handleFontSizeChange = useCallback((value) => {
    const newSize = Math.round(value);
    setLocalFontSize(newSize);
    changeFontSize(newSize);
  }, [changeFontSize]);

  const renderItem = useCallback(({ item }) => (
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
  ), [toggleBookmark, shareVerse, openNoteModal, copyVerse, styles, colors, isBookmarked, highlightedVerses]);

  const keyExtractor = useCallback((item) => `verse-${item.number}`, []);

  const onEndReached = useCallback(() => {
    if (!loading && hasMoreVerses) {
      loadVerses(book, chapter, verses.length, VERSES_PER_BATCH);
    }
  }, [loading, hasMoreVerses, book, chapter, verses.length, loadVerses]);

  const memoizedVerses = useMemo(() => verses, [verses]);

  if (loading && verses.length === 0) {
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
        <TouchableOpacity style={styles.retryButton} onPress={() => loadVerses(book, chapter)}>
          <Text style={styles.retryButtonText}>{t('retry')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (isDistractionFreeMode) {
    return (
      <DistractionFreeMode
        verses={verses.map(v => ({...v, book, chapter}))}
        currentVerseIndex={currentVerseIndex}
        onNextVerse={handleNextVerse}
        onPreviousVerse={handlePreviousVerse}
        onClose={toggleDistractionFreeMode}
      />
    );
  }

  return (
    <PanGestureHandler onHandlerStateChange={handleGesture}>
      <View style={styles.container} testID="verse-screen-container">
        <Animated.View style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateX: slideAnim }],
          }
        ]}>
          <View style={styles.header}>
            <TouchableOpacity 
              onPress={() => navigateToChapter(chapter - 1)} 
              disabled={chapter === 1}
              accessibilityLabel={`Ir al capítulo anterior de ${book}`}
              accessibilityHint="Navega al capítulo anterior del libro actual"
              accessibilityRole="button"
            >
              <Icon name="chevron-left" size={24} color={chapter === 1 ? colors.secondary : colors.primary} />
            </TouchableOpacity>
            <Text style={styles.chapterTitle} accessibilityRole="header">{`${book} ${chapter}`}</Text>
            <TouchableOpacity 
              onPress={() => navigateToChapter(chapter + 1)} 
              disabled={chapter === totalChapters}
              accessibilityLabel={`Ir al siguiente capítulo de ${book}`}
              accessibilityHint="Navega al siguiente capítulo del libro actual"
              accessibilityRole="button"
            >
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
              accessibilityLabel="Buscar en el capítulo actual"
              accessibilityHint="Ingresa texto para buscar en el capítulo actual"
            />
            <TouchableOpacity 
              onPress={handleSearch}
              accessibilityLabel="Buscar"
              accessibilityHint="Inicia la búsqueda con el texto ingresado"
              accessibilityRole="button"
            >
              <Icon name="search" size={24} color={colors.primary} />
            </TouchableOpacity>
          </View>
          <View style={styles.settingsContainer}>
            <Text style={styles.settingLabel}>{t('fontSize')}: {localFontSize}</Text>
            <Slider
              style={styles.slider}
              minimumValue={12}
              maximumValue={24}
              step={1}
              value={localFontSize}
              onValueChange={handleFontSizeChange}
              minimumTrackTintColor={colors.primary}
              maximumTrackTintColor={colors.secondary}
              thumbTintColor={colors.primary}
            />
          </View>
          <FlatList
            ref={listRef}
            data={memoizedVerses}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            onEndReached={onEndReached}
            onEndReachedThreshold={0.5}
            initialNumToRender={INITIAL_VERSES_TO_LOAD}
            maxToRenderPerBatch={VERSES_PER_BATCH}
            windowSize={21}
            removeClippedSubviews={true}
            contentContainerStyle={styles.listContent}
            style={styles.list}
            ListFooterComponent={loading && verses.length > 0 ? (
              <ActivityIndicator size="small" color={colors.primary} style={styles.loadingMore} />
            ) : null}
          />
        </Animated.View>
        <TouchableOpacity 
          style={styles.distractionFreeModeButton} 
          onPress={toggleDistractionFreeMode}
          accessibilityLabel="Activar modo de lectura sin distracciones"
          accessibilityRole="button"
        >
          <Icon name="fullscreen" size={24} color={colors.primary} />
        </TouchableOpacity>
        <NoteModal 
          visible={noteModalVisible}
          onClose={closeNoteModal}
          verse={currentVerse}
          onSave={saveNote}
          initialNote={currentVerse ? getNote(book, chapter, currentVerse.number) : ''}
        />
      </View>
    </PanGestureHandler>
  );
};

const createStyles = (colors, fontSize, fontFamily) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      flex: 1,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.background,
    },
    errorContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.background,
    },
    errorText: {
      color: colors.text,
      fontSize: 16,
      marginBottom: 20,
      textAlign: 'center',
    },
    retryButton: {
      backgroundColor: colors.primary,
      padding: 10,
      borderRadius: 5,
    },
    retryButtonText: {
      color: colors.background,
      fontSize: 16,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 10,
      backgroundColor: colors.card,
    },
    chapterTitle: {
      fontSize: fontSize + 2,
      fontWeight: 'bold',
      color: colors.text,
      fontFamily,
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 10,
      backgroundColor: colors.card,
    },
    searchInput: {
      flex: 1,
      height: 40,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 5,
      paddingHorizontal: 10,
      marginRight: 10,
      color: colors.text,
      fontFamily,
      fontSize: fontSize,
    },
    settingsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 10,
      backgroundColor: colors.card,
    },
    settingLabel: {
      color: colors.text,
      fontFamily,
      fontSize: fontSize,
      marginRight: 10,
    },
    slider: {
      flex: 1,
    },
    list: {
      flex: 1,
    },
    listContent: {
      paddingBottom: 40,
    },
    verseContainer: {
      flexDirection: 'column',
      padding: 20,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      marginBottom: 20,
    },
    highlightedVerse: {
      backgroundColor: colors.highlight,
    },
    verseNumber: {
      marginRight: 10,
      color: colors.secondary,
      fontFamily,
      fontSize: fontSize - 2,
      minWidth: 30,
      textAlign: 'right',
    },
    verseText: {
      flex: 1,
      color: colors.text,
      fontFamily,
      fontSize: fontSize,
    },
    actionsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 10,
    },
    distractionFreeModeButton: {
      position: 'absolute',
      right: 10,
      bottom: 10,
      padding: 10,
      backgroundColor: colors.card,
      borderRadius: 20,
    },
    loadingMore: {
      paddingVertical: 20,
    },
  });
};

export default React.memo(withTheme(VerseScreen));