import React, { useCallback, useMemo } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useStyles } from '../hooks/useStyles';
import { bibleBooks } from '../data/bibleVerses';
import { useReadingProgress } from '../context/ReadingProgressContext';

const ChapterScreen = ({ route }) => {
  const navigation = useNavigation();
  const { book } = route.params;
  const styles = useStyles(createStyles);
  const { getChapterProgress } = useReadingProgress();

  const chapters = useMemo(() => 
    Array.from({ length: bibleBooks[book] }, (_, i) => i + 1),
    [book]
  );

  const renderChapter = useCallback(({ item }) => {
    const progress = getChapterProgress ? getChapterProgress(book, item) : 0;
    return (
      <TouchableOpacity
        style={styles.chapterItem}
        onPress={() => {
          console.log(`Navigating to Verse screen for ${book}, chapter ${item}`);
          navigation.navigate('Verse', { book, chapter: item });
        }}
      >
        <Text style={styles.chapterText}>Capítulo {item}</Text>
        {progress > 0 && (
          <View style={[styles.progressIndicator, { width: `${progress * 100}%` }]} />
        )}
      </TouchableOpacity>
    );
  }, [navigation, book, styles, getChapterProgress]);

  return (
    <View style={styles.container}>
      <Text style={styles.bookTitle}>{book}</Text>
      <FlatList
        data={chapters}
        renderItem={renderChapter}
        keyExtractor={(item) => item.toString()}
        numColumns={3}
        initialNumToRender={15}
        maxToRenderPerBatch={15}
        windowSize={5}
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
      padding: 10,
    },
    bookTitle: {
      fontSize: dynamicFontSize + 4,
      fontWeight: 'bold',
      color: nightMode ? '#fff' : '#333',
      marginBottom: 10,
      textAlign: 'center',
      fontFamily,
    },
    chapterItem: {
      flex: 1,
      margin: 5,
      padding: 20,
      backgroundColor: nightMode ? '#1e1e1e' : 'white',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 5,
      position: 'relative',
      overflow: 'hidden',
    },
    chapterText: {
      color: nightMode ? '#fff' : '#333',
      fontSize: dynamicFontSize,
      fontFamily,
    },
    progressIndicator: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      height: 3,
      backgroundColor: nightMode ? '#0a84ff' : '#007AFF',
    },
  };
};

export default React.memo(ChapterScreen);