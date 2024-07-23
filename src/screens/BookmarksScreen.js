import React, { useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, VirtualizedList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useBookmarks } from '../context/BookmarksContext';
import { useStyles } from '../hooks/useStyles';
import { withTheme } from '../hoc/withTheme';
import { useTranslation } from 'react-i18next';
import { AnalyticsService } from '../services/AnalyticsService';

const BookmarkItem = React.memo(({ item, onPress, onRemove, styles, colors }) => (
  <View style={[styles.bookmarkItem, { backgroundColor: colors.secondary }]}>
    <TouchableOpacity onPress={onPress}>
      <Text style={[styles.bookmarkText, { color: colors.text }]}>{item.book} {item.chapter}:{item.verse}</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.removeButton} onPress={onRemove}>
      <Text style={[styles.removeButtonText, { color: colors.primary }]}>Quitar</Text>
    </TouchableOpacity>
  </View>
));

const BookmarksScreen = ({ theme }) => {
  const navigation = useNavigation();
  const { bookmarks, removeBookmark } = useBookmarks();
  const { colors } = theme;
  const styles = useStyles(createStyles);
  const { t } = useTranslation();

  const getItem = useCallback((data, index) => data[index], []);
  const getItemCount = useCallback((data) => data.length, []);
  const keyExtractor = useCallback((item, index) => `${item.book}-${item.chapter}-${item.verse}-${index}`, []);

  const renderItem = useCallback(({ item }) => (
    <BookmarkItem
      item={item}
      onPress={() => {
        navigation.navigate('Biblia', {
          screen: 'Verse',
          params: { book: item.book, chapter: item.chapter, verse: item.verse }
        });
        AnalyticsService.logEvent('favorite_verse_selected', { book: item.book, chapter: item.chapter, verse: item.verse });
      }}
      onRemove={() => {
        removeBookmark(item.book, item.chapter, item.verse);
        AnalyticsService.logEvent('favorite_verse_removed', { book: item.book, chapter: item.chapter, verse: item.verse });
      }}
      styles={styles}
      colors={colors}
    />
  ), [navigation, removeBookmark, styles, colors]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>{t('Mis versículos favoritos')}</Text>
      <VirtualizedList
        data={bookmarks}
        initialNumToRender={10}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        getItemCount={getItemCount}
        getItem={getItem}
        maxToRenderPerBatch={10}
        windowSize={21}
        updateCellsBatchingPeriod={50}
        removeClippedSubviews={true}
        ListEmptyComponent={<Text style={[styles.emptyText, { color: colors.text }]}>{t('Aún no tienes versículos favoritos')}</Text>}
      />
    </View>
  );
};

const createStyles = (nightMode, fontSize, fontFamily) => {
  const dynamicFontSize = fontSize === 'small' ? 14 : fontSize === 'large' ? 18 : 16;

  return StyleSheet.create({
    container: {
      flex: 1,
      padding: 10,
    },
    title: {
      fontSize: dynamicFontSize + 4,
      fontWeight: 'bold',
      marginBottom: 15,
      textAlign: 'center',
    },
    bookmarkItem: {
      padding: 15,
      borderRadius: 5,
      marginBottom: 10,
    },
    bookmarkText: {
      fontFamily,
      fontSize: dynamicFontSize,
    },
    removeButton: {
      marginTop: 5,
      alignSelf: 'flex-end',
    },
    removeButtonText: {
      fontFamily,
      fontSize: dynamicFontSize - 2,
    },
    emptyText: {
      textAlign: 'center',
      marginTop: 20,
      fontFamily,
      fontSize: dynamicFontSize,
    },
  });
};

export default withTheme(React.memo(BookmarksScreen));