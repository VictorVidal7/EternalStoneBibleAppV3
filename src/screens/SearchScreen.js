import React, { useState, useCallback, useEffect, memo } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useStyles } from '../hooks/useStyles';
import { searchBible } from '../services/bibleDataManager';
import { useTranslation } from 'react-i18next';
import { withTheme } from '../hoc/withTheme';
import { AnalyticsService } from '../services/AnalyticsService';

const ITEMS_PER_PAGE = 20;

const SearchResultItem = memo(({ item, onPress, styles, colors }) => (
  <TouchableOpacity
    style={[styles.resultItem, { backgroundColor: colors.secondary }]}
    onPress={onPress}
  >
    <Text style={[styles.resultReference, { color: colors.text }]}>
      {item.book} {item.chapter}:{item.verse}
    </Text>
    <Text style={[styles.resultText, { color: colors.text }]} numberOfLines={2}>
      {item.text}
    </Text>
  </TouchableOpacity>
));

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

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query.length >= 3) {
        handleSearch(true);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query, searchType]);

  const loadMoreResults = () => {
    if (!isLoading && hasMore) {
      handleSearch();
    }
  };

  const renderSearchResult = useCallback(({ item }) => (
    <SearchResultItem
      item={item}
      onPress={() => {
        navigation.navigate('Verse', { book: item.book, chapter: item.chapter, verse: item.verse });
        AnalyticsService.logEvent('search_result_selected', { book: item.book, chapter: item.chapter, verse: item.verse });
      }}
      styles={styles}
      colors={colors}
    />
  ), [navigation, styles, colors]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <TextInput
        style={[styles.searchInput, { color: colors.text, borderColor: colors.secondary }]}
        value={query}
        onChangeText={setQuery}
        placeholder={t('searchPlaceholder')}
        placeholderTextColor={colors.secondary}
      />
      <View style={styles.searchTypeContainer}>
        {['all', 'ot', 'nt'].map((type) => (
          <TouchableOpacity
            key={type}
            style={[
              styles.searchTypeButton,
              searchType === type && styles.activeSearchType,
              { backgroundColor: searchType === type ? colors.primary : colors.secondary }
            ]}
            onPress={() => {
              setSearchType(type);
              AnalyticsService.logEvent('search_type_changed', { newType: type });
            }}
          >
            <Text style={[styles.searchTypeText, searchType === type && styles.activeSearchTypeText, { color: colors.text }]}>
              {t(`searchType${type.toUpperCase()}Short`)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {isLoading && page === 1 ? (
        <ActivityIndicator size="large" color={colors.primary} />
      ) : (
        <FlatList
          data={results}
          renderItem={renderSearchResult}
          keyExtractor={(item, index) => `${item.book}-${item.chapter}-${item.verse}-${index}`}
          ListEmptyComponent={
            <Text style={[styles.emptyResult, { color: colors.text }]}>
            {query.length < 3 ? t('enterMinChars') : t('noResults')}
          </Text>
        }
        onEndReached={loadMoreResults}
        onEndReachedThreshold={0.5}
        ListFooterComponent={() => isLoading && page > 1 ? <ActivityIndicator size="small" color={colors.primary} /> : null}
      />
    )}
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
  searchInput: {
    height: 40,
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    fontFamily,
    fontSize: dynamicFontSize,
  },
  searchTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  searchTypeButton: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 2,
    alignItems: 'center',
  },
  searchTypeText: {
    fontSize: dynamicFontSize - 2,
    fontFamily,
  },
  activeSearchTypeText: {
    fontWeight: 'bold',
  },
  resultItem: {
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
  },
  resultReference: {
    fontWeight: 'bold',
    marginBottom: 5,
    fontFamily,
    fontSize: dynamicFontSize,
  },
  resultText: {
    fontFamily,
    fontSize: dynamicFontSize,
  },
  emptyResult: {
    textAlign: 'center',
    marginTop: 20,
    fontFamily,
    fontSize: dynamicFontSize,
  },
};
};

export default withTheme(React.memo(SearchScreen));