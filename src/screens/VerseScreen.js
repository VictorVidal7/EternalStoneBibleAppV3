import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, ToastAndroid, Platform, Alert, Share, AccessibilityInfo, Dimensions } from 'react-native';
import { RecyclerListView, DataProvider, LayoutProvider } from 'recyclerlistview';
import Clipboard from '@react-native-clipboard/clipboard';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { useBookmarks } from '../context/BookmarksContext';
import { useUserPreferences } from '../context/UserPreferencesContext';
import { useNotes } from '../context/NotesContext';
import { getChapter } from '../services/bibleDataManager';
import { useStyles } from '../hooks/useStyles';
import NoteModal from '../components/NoteModal';
import { useTranslation } from 'react-i18next';
import { withTheme } from '../hoc/withTheme';
import { AnalyticsService } from '../services/AnalyticsService';

const { width } = Dimensions.get('window');

const VerseItem = React.memo(({ item, onToggleBookmark, onShareVerse, onOpenNoteModal, onCopyVerse, styles, colors, isBookmarked }) => (
  <View 
    style={[styles.verseContainer, { lineHeight: item.lineSpacing }]}
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
));

const VerseScreen = ({ route, theme }) => {
  const { book, chapter, initialVerse } = route.params;
  const { bookmarks, addBookmark, removeBookmark } = useBookmarks();
  const { addNote, getNote } = useNotes();
  const { fontSize, fontFamily, lineSpacing } = useUserPreferences();
  const { colors } = theme;
  const styles = useStyles(createStyles);
  const [verses, setVerses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [noteModalVisible, setNoteModalVisible] = useState(false);
  const [currentVerse, setCurrentVerse] = useState(null);
  const navigation = useNavigation();
  const { t } = useTranslation();

  const dataProvider = useMemo(() => new DataProvider((r1, r2) => r1 !== r2), []);
  const [dataProviderState, setDataProviderState] = useState(dataProvider);

  const layoutProvider = useMemo(() => new LayoutProvider(
    index => 0,
    (type, dim) => {
      dim.width = width;
      dim.height = 120; // Ajusta esta altura según tus necesidades
    }
  ), []);

  useEffect(() => {
    const loadVerses = async () => {
      try {
        setLoading(true);
        const chapterVerses = await getChapter(book, chapter);
        setVerses(chapterVerses);
        setDataProviderState(dataProvider.cloneWithRows(chapterVerses));
        AnalyticsService.logScreenView(`Verse_${book}_${chapter}`);
      } catch (error) {
        console.error('Error loading verses:', error);
        Alert.alert(t('error'), t('errorLoadingVerses'));
      } finally {
        setLoading(false);
      }
    };
    loadVerses();
  }, [book, chapter, t, dataProvider]);

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

  const renderVerse = useCallback((_type, item) => (
    <VerseItem
      item={item}
      onToggleBookmark={toggleBookmark}
      onShareVerse={shareVerse}
      onOpenNoteModal={openNoteModal}
      onCopyVerse={copyVerse}
      styles={styles}
      colors={colors}
      isBookmarked={isBookmarked}
    />
  ), [toggleBookmark, shareVerse, openNoteModal, copyVerse, styles, colors, isBookmarked]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container} testID="verse-screen-container">
      <RecyclerListView
        layoutProvider={layoutProvider}
        dataProvider={dataProviderState}
        rowRenderer={renderVerse}
        initialRenderIndex={initialVerse ? initialVerse - 1 : 0}
        renderAheadOffset={1000}
        scrollViewProps={{
          accessibilityLabel: t('verseList'),
          accessibilityRole: "list"
        }}
      />
      <NoteModal 
        visible={noteModalVisible}
        onClose={() => setNoteModalVisible(false)}
        verse={currentVerse}
        onSave={(noteText) => {
          if (currentVerse) {
            addNote(book, chapter, currentVerse.number, noteText);
            AnalyticsService.logEvent('add_note', { book, chapter, verse: currentVerse.number });
          }
          setNoteModalVisible(false);
        }}
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
  };
};

export default withTheme(React.memo(VerseScreen));