import React, { useCallback, useMemo } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useStyles } from '../hooks/useStyles';
import { bibleBooks } from '../data/bibleVerses';
import { useReadingProgress } from '../context/ReadingProgressContext';
import { withTheme } from '../hoc/withTheme';

const ChapterScreen = ({ route, theme }) => {
  const navigation = useNavigation();
  const { book } = route.params;
  const { colors } = theme;
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
        style={[styles.chapterItem, { backgroundColor: colors.secondary }]}
        onPress={() => {
          console.log(`Navigating to Verse screen for ${book}, chapter ${item}`);
          navigation.navigate('Verse', { book, chapter: item });
        }}
      >
        <Text style={[styles.chapterText, { color: colors.text }]}>Capítulo {item}</Text>
        {progress > 0 && (
          <View style={[styles.progressIndicator, { width: `${progress * 100}%`, backgroundColor: colors.primary }]} />
        )}
      </TouchableOpacity>
    );
  }, [navigation, book, styles, colors, getChapterProgress]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.bookTitle, { color: colors.text }]}>{book}</Text>
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
      padding: 10,
    },
    bookTitle: {
      fontSize: dynamicFontSize + 4,
      fontWeight: 'bold',
      marginBottom: 10,
      textAlign: 'center',
      fontFamily,
    },
    chapterItem: {
      flex: 1,
      margin: 5,
      padding: 20,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 5,
      position: 'relative',
      overflow: 'hidden',
    },
    chapterText: {
      fontSize: dynamicFontSize,
      fontFamily,
    },
    progressIndicator: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      height: 3,
    },
  };
};

export default withTheme(React.memo(ChapterScreen));