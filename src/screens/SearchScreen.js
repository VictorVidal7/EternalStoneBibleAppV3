import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useStyles } from '../hooks/useStyles';
import { searchBible } from '../services/bibleDataManager';
import { useTranslation } from 'react-i18next';
import { withTheme } from '../hoc/withTheme';
import { AnalyticsService } from '../services/AnalyticsService';
import CustomIconButton from '../components/CustomIconButton';

const SearchScreen = ({ theme }) => {
  const navigation = useNavigation();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { colors } = theme;
  const styles = useStyles(createStyles);
  const { t } = useTranslation();

  const handleSearch = useCallback(async () => {
    if (query.length < 3) return;
    setIsLoading(true);
    try {
      const searchResults = await searchBible(query);
      setResults(searchResults);
      AnalyticsService.logEvent('search_performed', { query, resultsCount: searchResults.length });
    } catch (error) {
      console.error('Error searching the Bible:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, [query]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query.length >= 3) {
        handleSearch();
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query, handleSearch]);

  const renderItem = useCallback(({ item }) => (
    <TouchableOpacity
      style={styles.resultItem}
      onPress={() => {
        navigation.navigate('Biblia', {
          screen: 'Verse',
          params: { book: item.book, chapter: item.chapter, verse: item.verse }
        });
        AnalyticsService.logEvent('search_result_selected', { book: item.book, chapter: item.chapter, verse: item.verse });
      }}
    >
      <Text style={styles.resultReference}>{item.book} {item.chapter}:{item.verse}</Text>
      <Text style={styles.resultText} numberOfLines={2}>{item.text}</Text>
    </TouchableOpacity>
  ), [navigation, styles]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.searchInputContainer}>
        <CustomIconButton name="search" color={colors.primary} onPress={handleSearch} />
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          value={query}
          onChangeText={setQuery}
          placeholder={t('Buscar en la Biblia')}
          placeholderTextColor={colors.secondary}
        />
        {query.length > 0 && (
          <CustomIconButton name="close" color={colors.secondary} onPress={() => setQuery('')} />
        )}
      </View>
      {isLoading ? (
        <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
      ) : (
        <FlatList
          data={results}
          renderItem={renderItem}
          keyExtractor={(item, index) => `${item.book}-${item.chapter}-${item.verse}-${index}`}
          ListEmptyComponent={
            <Text style={[styles.emptyResult, { color: colors.text }]}>
              {query.length < 3 ? t('Escribe al menos 3 letras') : t('No se encontraron resultados')}
            </Text>
          }
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
    marginBottom: 16,
    backgroundColor: colors.card,
    borderRadius: 25,
    paddingHorizontal: 12,
  },
  searchInput: {
    flex: 1,
    height: 50,
    fontSize: fontSize,
    fontFamily,
    marginLeft: 8,
  },
  resultItem: {
    backgroundColor: colors.card,
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
  },
  resultReference: {
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 4,
    fontFamily,
    fontSize: fontSize,
  },
  resultText: {
    color: colors.text,
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