import React, { useCallback, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SectionList, Animated } from 'react-native';
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

  const renderItem = useCallback(({ item: book, index, section }) => {
    const opacity = new Animated.Value(0);
    Animated.timing(opacity, {
      toValue: 1,
      duration: 500,
      delay: index * 50,
      useNativeDriver: true,
    }).start();

    return (
      <Animated.View style={{ opacity }}>
        <TouchableOpacity
          style={styles.bookItem}
          onPress={() => navigateToChapter(book)}
          testID={`book-item-${book}`}
        >
          <Icon name="book" size={24} color={colors.primary} style={styles.bookIcon} />
          <Text style={[styles.bookName, { color: colors.text }]}>{book}</Text>
          <Text style={styles.bookNumber}>{section.data.indexOf(book) + 1}</Text>
          <Icon name="chevron-right" size={24} color={colors.secondary} />
        </TouchableOpacity>
      </Animated.View>
    );
  }, [colors, navigateToChapter, styles]);

  const renderSectionHeader = useCallback(({ section: { title } }) => (
    <View style={[styles.sectionHeader, { backgroundColor: colors.card }]}>
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
        stickySectionHeadersEnabled={true}
        initialNumToRender={20}
        maxToRenderPerBatch={20}
        windowSize={21}
        removeClippedSubviews={true}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const createStyles = (colors, fontSize, fontFamily) => StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 16,
  },
  sectionHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sectionHeaderText: {
    fontFamily,
    fontSize: fontSize + 4,
    fontWeight: 'bold',
  },
  bookItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  bookIcon: {
    marginRight: 16,
  },
  bookName: {
    flex: 1,
    fontFamily,
    fontSize: fontSize,
  },
  bookNumber: {
    fontFamily,
    fontSize: fontSize - 2,
    color: colors.secondary,
    marginRight: 8,
  },
});

export default React.memo(withTheme(BibleListScreen));