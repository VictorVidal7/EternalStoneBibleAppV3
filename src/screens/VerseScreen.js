import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, ToastAndroid, Platform, Alert, Share, PanResponder } from 'react-native';
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

const VerseScreen = ({ route }) => {
  const { book, chapter, initialVerse } = route.params;
  const { bookmarks, addBookmark, removeBookmark } = useBookmarks();
  const { addNote, getNote } = useNotes();
  const { nightMode, fontSize, fontFamily, lineSpacing } = useUserPreferences();
  const styles = useStyles(createStyles);
  const [verses, setVerses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [noteModalVisible, setNoteModalVisible] = useState(false);
  const [currentVerse, setCurrentVerse] = useState(null);
  const navigation = useNavigation();
  const { t } = useTranslation();

  useEffect(() => {
    const loadVerses = async () => {
      try {
        setLoading(true);
        const chapterVerses = await getChapter(book, chapter);
        setVerses(chapterVerses);
      } catch (error) {
        console.error('Error loading verses:', error);
        Alert.alert(t('error'), t('errorLoadingVerses'));
      } finally {
        setLoading(false);
      }
    };
    loadVerses();
  }, [book, chapter, t]);

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

  const shareVerse = useCallback(async (verse) => {
    try {
      const result = await Share.share({
        message: `${verse.text} - ${book} ${chapter}:${verse.number}`,
        title: t('shareVerseTitle', { book, chapter, number: verse.number }),
      });
      if (result.action === Share.sharedAction) {
        console.log('Shared successfully');
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
  }, [book, chapter, t]);

  const openNoteModal = useCallback((verse) => {
    setCurrentVerse(verse);
    setNoteModalVisible(true);
  }, []);

  const renderVerse = useCallback(({ item }) => (
    <View style={[styles.verseContainer, { lineHeight: lineSpacing }]}>
      <Text style={styles.verseNumber}>{item.number}</Text>
      <Text style={styles.verseText} testID={`verse-text-${item.number}`}>{item.text}</Text>
      <View style={styles.actionsContainer}>
        <TouchableOpacity onPress={() => toggleBookmark(item.number)} accessibilityLabel={t('toggleBookmark')}>
          <Icon 
            name={isBookmarked(item.number) ? "bookmark" : "bookmark-border"} 
            size={24} 
            color={styles.bookmarkColor}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => shareVerse(item)} accessibilityLabel={t('shareVerse')}>
          <Icon name="share" size={24} color={styles.shareColor} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => openNoteModal(item)} accessibilityLabel={t('addNote')}>
          <Icon name="note-add" size={24} color={styles.noteColor} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => copyVerse(item)} accessibilityLabel={t('copyVerse')}>
          <Icon name="content-copy" size={24} color={styles.copyColor} />
        </TouchableOpacity>
      </View>
    </View>
  ), [styles, isBookmarked, toggleBookmark, shareVerse, openNoteModal, copyVerse, lineSpacing, t]);

  const getItemLayout = useCallback((data, index) => ({
    length: 60,
    offset: 60 * index,
    index,
  }), []);

  const panResponder = useMemo(() => PanResponder.create({
    onMoveShouldSetPanResponder: (evt, gestureState) => {
      return Math.abs(gestureState.dx) > 50;
    },
    onPanResponderRelease: (evt, gestureState) => {
      if (gestureState.dx > 50) {
        // Navigate to previous chapter
        navigation.navigate('Chapter', { book, chapter: chapter - 1 });
      } else if (gestureState.dx < -50) {
        // Navigate to next chapter
        navigation.navigate('Chapter', { book, chapter: chapter + 1 });
      }
    },
  }), [navigation, book, chapter]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={styles.loadingColor} />
      </View>
    );
  }

  return (
    <View style={styles.container} testID="verse-screen-container" {...panResponder.panHandlers}>
      <FlatList
        data={verses}
        renderItem={renderVerse}
        keyExtractor={(item) => item.number.toString()}
        initialScrollIndex={initialVerse ? initialVerse - 1 : 0}
        getItemLayout={getItemLayout}
        maxToRenderPerBatch={10}
        windowSize={21}
        removeClippedSubviews={true}
      />
      <NoteModal 
        visible={noteModalVisible}
        onClose={() => setNoteModalVisible(false)}
        verse={currentVerse}
        onSave={(noteText) => {
          if (currentVerse) {
            addNote(book, chapter, currentVerse.number, noteText);
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
    loadingColor: nightMode ? '#ffffff' : '#000000',
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
    bookmarkColor: nightMode ? "#FFD700" : "#007AFF",
    shareColor: nightMode ? "#4CAF50" : "#4CAF50",
    noteColor: nightMode ? "#FF9800" : "#FF9800",
    copyColor: nightMode ? "#9C27B0" : "#9C27B0",
  };
};

export default React.memo(VerseScreen);