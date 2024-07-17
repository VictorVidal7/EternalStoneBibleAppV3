import React, { useCallback, useMemo } from 'react';
import { View, Text, SectionList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getAllBooks } from '../services/bibleDataManager';
import { useStyles } from '../hooks/useStyles';
import { withTheme } from '../hoc/withTheme';

const BookItem = React.memo(({ item, onPress, styles, colors }) => (
  <TouchableOpacity
    style={styles.bookItem}
    onPress={() => onPress(item)}
  >
    <Text style={[styles.bookName, { color: colors.text }]}>{item}</Text>
  </TouchableOpacity>
));

const SectionHeader = React.memo(({ title, styles, colors }) => (
  <View style={[styles.sectionHeader, { backgroundColor: colors.secondary }]}>
    <Text style={[styles.sectionHeaderText, { color: colors.text }]}>{title}</Text>
  </View>
));

const BibleListScreen = ({ theme }) => {
  const navigation = useNavigation();
  const { colors } = theme;
  const styles = useStyles(createStyles);

  const sections = useMemo(() => {
    console.log("Generating sections for Bible books");
    const allBooks = getAllBooks();
    const oldTestament = allBooks.slice(0, 39);
    const newTestament = allBooks.slice(39);
    return [
      { title: 'Antiguo Testamento', data: oldTestament },
      { title: 'Nuevo Testamento', data: newTestament },
    ];
  }, []);

  const navigateToChapter = useCallback((book) => {
    console.log(`Navigating to Chapter screen for book: ${book}`);
    navigation.navigate('Chapter', { book });
  }, [navigation]);

  const renderBookItem = useCallback(({ item }) => (
    <BookItem
      item={item}
      onPress={navigateToChapter}
      styles={styles}
      colors={colors}
    />
  ), [navigateToChapter, styles, colors]);

  const renderSectionHeader = useCallback(({ section: { title } }) => (
    <SectionHeader
      title={title}
      styles={styles}
      colors={colors}
    />
  ), [styles, colors]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SectionList
        sections={sections}
        renderItem={renderBookItem}
        renderSectionHeader={renderSectionHeader}
        keyExtractor={(item) => item}
        initialNumToRender={20}
        maxToRenderPerBatch={10}
        updateCellsBatchingPeriod={50}
        windowSize={21}
        removeClippedSubviews={true}
        stickySectionHeadersEnabled={false}
      />
    </View>
  );
};

const createStyles = (nightMode, fontSize, fontFamily) => {
  const dynamicFontSize = fontSize === 'small' ? 14 : fontSize === 'large' ? 18 : 16;

  return {
    container: {
      flex: 1,
    },
    bookItem: {
      padding: 15,
      borderBottomWidth: 1,
      borderBottomColor: nightMode ? '#333' : '#e0e0e0',
    },
    bookName: {
      fontFamily,
      fontSize: dynamicFontSize,
    },
    sectionHeader: {
      padding: 10,
    },
    sectionHeaderText: {
      fontFamily,
      fontSize: dynamicFontSize + 2,
      fontWeight: 'bold',
    },
  };
};

export default React.memo(withTheme(BibleListScreen));