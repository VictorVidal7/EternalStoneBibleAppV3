import React, { useState, useCallback, useEffect, memo, useMemo } from 'react';
import { View, Text, TextInput, VirtualizedList, TouchableOpacity, ActivityIndicator, StyleSheet, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useStyles } from '../hooks/useStyles';
import { searchBible } from '../services/bibleDataManager';
import { useTranslation } from 'react-i18next';
import { withTheme } from '../hoc/withTheme';
import { AnalyticsService } from '../services/AnalyticsService';
import { debounce } from 'lodash';

const ITEMS_PER_PAGE = 20;

const SearchResultItem = memo(({ item, onPress, styles, colors, index }) => {
  const opacity = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 500,
      delay: index * 100,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View style={{ opacity }}>
      <TouchableOpacity
        style={[styles.resultItem, { backgroundColor: colors.card }]}
        onPress={onPress}
      >
        <Text style={[styles.resultReference, { color: colors.primary }]}>
          {item.book} {item.chapter}:{item.verse}
        </Text>
        <Text style={[styles.resultText, { color: colors.text }]} numberOfLines={2}>
          {item.text}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
});

const SearchScreen = ({ theme }) => {
  const navigation = useNavigation();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [searchType, setSearchType] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { colors } = theme;
  const styles = useStyles(createStyles);
  const { t } = useTranslation();

  const handleSearch = useCallback(async (newSearch = false) => {
    if (query.length < 3) {
      setResults([]);
      return;
    }
    setIsLoading(true);
    try {
      const currentPage = newSearch ? 1 : page;
      const searchResults = await searchBible(query, searchType, currentPage, ITEMS_PER_PAGE);
      setResults(prevResults => newSearch ? searchResults : [...prevResults, ...searchResults]);
      setHasMore(searchResults.length === ITEMS_PER_PAGE);
      setPage(currentPage + 1);
      AnalyticsService.logEvent('search_performed', { query, searchType, resultsCount: searchResults.length });
    } catch (error) {
      console.error('Error searching the Bible:', error);
      setResults([]);
      AnalyticsService.logEvent('search_error', { query, searchType, error: error.message });
    } finally {
      setIsLoading(false);
    }
  }, [query, searchType, page]);

  const debouncedSearch = useMemo(
    () => debounce((searchQuery) => {
      if (searchQuery.length >= 3) {
        handleSearch(true);
      }
    }, 300),
    [handleSearch]
  );

  useEffect(() => {
    debouncedSearch(query);
    return () => debouncedSearch.cancel();
  }, [query, debouncedSearch]);

  const getItem = useCallback((data, index) => data[index], []);
  const getItemCount = useCallback((data) => data.length, []);
  const keyExtractor = useCallback((item, index) => `${item.book}-${item.chapter}-${item.verse}-${index}`, []);

  const renderSearchResult = useCallback(({ item, index }) => (
    <SearchResultItem
      item={item}
      index={index}
      onPress={() => {
        navigation.navigate('Bible', {
          screen: 'Verse',
          params: { book: item.book, chapter: item.chapter, verse: item.verse }
        });
        AnalyticsService.logEvent('search_result_selected', { book: item.book, chapter: item.chapter, verse: item.verse });
      }}
      styles={styles}
      colors={colors}
    />
  ), [navigation, styles, colors]);

  const loadMoreResults = useCallback(() => {
    if (!isLoading && hasMore) {
      handleSearch();
    }
  }, [isLoading, hasMore, handleSearch]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.searchInputContainer}>
        <Icon name="search" size={24} color={colors.secondary} style={styles.searchIcon} />
        <TextInput
          style={[styles.searchInput, { color: colors.text, borderColor: colors.secondary }]}
          value={query}
          onChangeText={setQuery}
          placeholder={t('searchPlaceholder')}
          placeholderTextColor={colors.secondary}
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery('')}>
            <Icon name="close" size={24} color={colors.secondary} />
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.searchTypeContainer}>
        {['all', 'ot', 'nt'].map((type) => (
          <TouchableOpacity
            key={type}
            style={[
              styles.searchTypeButton,
              searchType === type && styles.activeSearchType,
              { backgroundColor: searchType === type ? colors.primary : colors.card }
            ]}
            onPress={() => {
              setSearchType(type);
              AnalyticsService.logEvent('search_type_changed', { newType: type });
            }}
          >
            <Text style={[styles.searchTypeText, searchType === type && styles.activeSearchTypeText, { color: searchType === type ? colors.card : colors.text }]}>
              {t(`searchType${type.toUpperCase()}Short`)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {isLoading && page === 1 ? (
        <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
      ) : (
        <VirtualizedList
          data={results}
          renderItem={renderSearchResult}
          keyExtractor={keyExtractor}
          getItemCount={getItemCount}
          getItem={getItem}
          onEndReached={loadMoreResults}
          onEndReachedThreshold={0.5}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          updateCellsBatchingPeriod={50}
          windowSize={21}
          removeClippedSubviews={true}
          ListEmptyComponent={
            <Text style={[styles.emptyResult, { color: colors.text }]}>
              {query.length < 3 ? t('enterMinChars') : t('noResults')}
            </Text>
          }
          ListFooterComponent={() => isLoading && page > 1 ? <ActivityIndicator size="small" color={colors.primary} /> : null}
        />
      )}
    </View>
  );
};

const createStyles = (colors, fontSize, fontFamily) => StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 25,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 50,
    fontSize: fontSize,
    fontFamily,
  },
  searchTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  searchTypeButton: {
    flex: 1,
    padding: 10,
    borderRadius: 20,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  searchTypeText: {
    fontSize: fontSize - 2,
    fontFamily,
  },
  activeSearchTypeText: {
    fontWeight: 'bold',
  },
  resultItem: {
    marginBottom: 16,
    padding: 16,
    borderRadius: 8,
    elevation: 2,
  },
  resultReference: {
    fontWeight: 'bold',
    marginBottom: 8,
    fontFamily,
    fontSize: fontSize,
  },
  resultText: {
    fontFamily,
    fontSize: fontSize - 2,
  },
  emptyResult: {
    textAlign: 'center',
    marginTop: 32,
    fontFamily,
    fontSize: fontSize,
  },
  loader: {
    marginTop: 32,
  },
});

export default withTheme(React.memo(SearchScreen));