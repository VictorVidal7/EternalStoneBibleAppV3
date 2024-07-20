import React, { useCallback, useMemo } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, SectionList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { getAllBooks } from '../services/bibleDataManager';
import { useStyles } from '../hooks/useStyles';
import { withTheme } from '../hoc/withTheme';
import { AnalyticsService } from '../services/AnalyticsService';

const BibleListScreen = ({ theme }) => {
  const navigation = useNavigation();
  const { colors } = theme;
  const styles = useStyles(createStyles);

  const books = useMemo(() => getAllBooks(), []);
  const sections = useMemo(() => [
    { title: 'Antiguo Testamento', data: books.slice(0, 39) },
    { title: 'Nuevo Testamento', data: books.slice(39) }
  ], [books]);

  const navigateToChapter = useCallback((book) => {
    console.log(`Navigating to Chapter screen for book: ${book}`);
    navigation.navigate('Chapter', { book });
    AnalyticsService.logEvent('select_book', { book });
  }, [navigation]);

  const renderItem = useCallback(({ item: book }) => (
    <TouchableOpacity
      style={styles.bookItem}
      onPress={() => navigateToChapter(book)}
      testID={`book-item-${book}`}
    >
      <Icon name="book" size={24} color={colors.primary} style={styles.bookIcon} />
      <Text style={[styles.bookName, { color: colors.text }]}>{book}</Text>
      <Icon name="chevron-right" size={24} color={colors.secondary} />
    </TouchableOpacity>
  ), [colors, navigateToChapter, styles]);

  const renderSectionHeader = useCallback(({ section: { title } }) => (
    <View style={[styles.sectionHeader, { backgroundColor: colors.background }]}>
      <Text style={[styles.sectionHeaderText, { color: colors.primary }]}>{title}</Text>
    </View>
  ), [colors, styles]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SectionList
        sections={sections}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        keyExtractor={(item) => item}
        stickySectionHeadersEnabled={false}
        initialNumToRender={20}
        maxToRenderPerBatch={20}
        windowSize={21}
        removeClippedSubviews={true}
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
    sectionHeader: {
      padding: 10,
      borderBottomWidth: 1,
      borderBottomColor: nightMode ? '#333' : '#e0e0e0',
    },
    sectionHeaderText: {
      fontFamily,
      fontSize: dynamicFontSize + 2,
      fontWeight: 'bold',
    },
    bookItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 15,
      borderBottomWidth: 1,
      borderBottomColor: nightMode ? '#333' : '#e0e0e0',
    },
    bookIcon: {
      marginRight: 10,
    },
    bookName: {
      flex: 1,
      fontFamily,
      fontSize: dynamicFontSize,
    },
  });
};

export default React.memo(withTheme(BibleListScreen));