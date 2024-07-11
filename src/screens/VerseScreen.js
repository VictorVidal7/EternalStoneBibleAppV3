import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, ToastAndroid, Platform, Alert, Share } from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useBookmarks } from '../context/BookmarksContext';
import { useUserPreferences } from '../context/UserPreferencesContext';
import { useNotes } from '../context/NotesContext';
import { getChapter } from '../services/bibleDataManager';
import { useStyles } from '../hooks/useStyles';
import NoteModal from '../components/NoteModal';

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

  useEffect(() => {
    const loadVerses = async () => {
      try {
        setLoading(true);
        const chapterVerses = await getChapter(book, chapter);
        setVerses(chapterVerses);
      } catch (error) {
        console.error('Error loading verses:', error);
        Alert.alert('Error', 'No se pudieron cargar los versículos. Por favor, intente de nuevo.');
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

  const shareVerse = useCallback(async (verse) => {
    try {
      const result = await Share.share({
        message: `${verse.text} - ${book} ${chapter}:${verse.number}`,
        title: `Versículo de ${book} ${chapter}:${verse.number}`,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log('Shared with activity type:', result.activityType);
        } else {
          console.log('Shared successfully');
        }
      } else if (result.action === Share.dismissedAction) {
        console.log('Share dismissed');
      }
    } catch (error) {
      console.error('Error sharing verse:', error);
      Alert.alert('Error', 'No se pudo compartir el versículo');
    }
  }, [book, chapter]);

  const copyVerse = useCallback((verse) => {
    Clipboard.setString(`${verse.text} - ${book} ${chapter}:${verse.number}`);
    if (Platform.OS === 'android') {
      ToastAndroid.show('Versículo copiado al portapapeles', ToastAndroid.SHORT);
    } else {
      Alert.alert('Copiado', 'Versículo copiado al portapapeles');
    }
  }, [book, chapter]);

  const openNoteModal = useCallback((verse) => {
    setCurrentVerse(verse);
    setNoteModalVisible(true);
  }, []);

  const renderVerse = useCallback(({ item }) => (
    <View style={[styles.verseContainer, { lineHeight: lineSpacing }]}>
      <Text style={styles.verseNumber}>{item.number}</Text>
      <Text style={styles.verseText} testID={`verse-text-${item.number}`}>{item.text}</Text>
      <View style={styles.actionsContainer}>
        <TouchableOpacity onPress={() => toggleBookmark(item.number)}>
          <Icon 
            name={isBookmarked(item.number) ? "bookmark" : "bookmark-border"} 
            size={24} 
            color={styles.bookmarkColor}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => shareVerse(item)}>
          <Icon name="share" size={24} color={styles.shareColor} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => openNoteModal(item)}>
          <Icon name="note-add" size={24} color={styles.noteColor} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => copyVerse(item)}>
          <Icon name="content-copy" size={24} color={styles.copyColor} />
        </TouchableOpacity>
      </View>
    </View>
  ), [styles, isBookmarked, toggleBookmark, shareVerse, openNoteModal, copyVerse, lineSpacing]);

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