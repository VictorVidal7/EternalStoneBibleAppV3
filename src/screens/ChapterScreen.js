import React, { useCallback, useMemo } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useStyles } from '../hooks/useStyles';
import { bibleBooks } from '../data/bibleVerses';
import { useReadingProgress } from '../context/ReadingProgressContext';
import { withTheme } from '../hoc/withTheme';
import { AnalyticsService } from '../services/AnalyticsService';

const { width } = Dimensions.get('window');
const COLUMN_COUNT = 3;
const ITEM_WIDTH = width / COLUMN_COUNT;

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

  const navigateToVerse = useCallback((chapter) => {
    console.log(`Navigating to Verse screen for ${book}, chapter ${chapter}`);
    navigation.navigate('Verse', { book, chapter });
    AnalyticsService.logEvent('select_chapter', { book, chapter });
  }, [navigation, book]);

  const renderItem = useCallback(({ item: chapter }) => {
    const progress = getChapterProgress ? getChapterProgress(book, chapter) : 0;
    const iconName = progress === 1 ? 'check-circle' : progress > 0 ? 'adjust' : 'panorama-fish-eye';

    return (
      <TouchableOpacity
        style={[styles.chapterItem, { width: ITEM_WIDTH - 10 }]}
        onPress={() => navigateToVerse(chapter)}
      >
        <View style={[styles.chapterContent, { backgroundColor: colors.surface }]}>
          <Text style={[styles.chapterText, { color: colors.text }]}>{chapter}</Text>
          <Icon 
            name={iconName} 
            size={24} 
            color={progress === 1 ? colors.success : progress > 0 ? colors.warning : colors.disabled} 
          />
        </View>
        <View style={[styles.progressBar, { width: `${progress * 100}%`, backgroundColor: colors.primary }]} />
      </TouchableOpacity>
    );
  }, [book, colors, getChapterProgress, navigateToVerse, styles]);

  const keyExtractor = useCallback((item) => item.toString(), []);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Icon name="book" size={24} color={colors.primary} />
        <Text style={[styles.bookTitle, { color: colors.text }]}>{book}</Text>
      </View>
      <FlatList
        data={chapters}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        numColumns={COLUMN_COUNT}
        initialNumToRender={15}
        maxToRenderPerBatch={15}
        windowSize={5}
        removeClippedSubviews={true}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const createStyles = (nightMode, fontSize, fontFamily) => {
  const dynamicFontSize = fontSize === 'small' ? 14 : fontSize === 'large' ? 18 : 16;

  return StyleSheet.create({
    container: {
      flex: 1,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: nightMode ? '#333' : '#e0e0e0',
    },
    bookTitle: {
      fontSize: dynamicFontSize + 4,
      fontWeight: 'bold',
      marginLeft: 10,
      fontFamily,
    },
    listContent: {
      padding: 5,
    },
    chapterItem: {
      margin: 5,
      aspectRatio: 1,
    },
    chapterContent: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 10,
      overflow: 'hidden',
    },
    chapterText: {
      fontSize: dynamicFontSize,
      fontWeight: 'bold',
      marginBottom: 5,
      fontFamily,
    },
    progressBar: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      height: 3,
    },
  });
};

export default withTheme(React.memo(ChapterScreen));