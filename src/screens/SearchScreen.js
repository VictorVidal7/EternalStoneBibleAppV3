import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useStyles } from '../hooks/useStyles';
import { searchBible } from '../services/bibleDataManager';
import { useTranslation } from 'react-i18next';

const SearchScreen = () => {
  const navigation = useNavigation();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [searchType, setSearchType] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const styles = useStyles(createStyles);
  const { t } = useTranslation();

  const handleSearch = useCallback(async () => {
    if (query.length < 3) {
      setResults([]);
      return;
    }
    setIsLoading(true);
    try {
      const searchResults = await searchBible(query, searchType);
      setResults(searchResults);
    } catch (error) {
      console.error('Error searching the Bible:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, [query, searchType]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query.length >= 3) {
        handleSearch();
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query, searchType, handleSearch]);

  const renderSearchResult = useCallback(({ item }) => (
    <TouchableOpacity
      style={styles.resultItem}
      onPress={() => navigation.navigate('Verse', { book: item.book, chapter: item.chapter, verse: item.number })}
    >
      <Text style={styles.resultReference}>
        {item.book} {item.chapter}:{item.number}
      </Text>
      <Text style={styles.resultText} numberOfLines={2}>
        {item.text}
      </Text>
    </TouchableOpacity>
  ), [styles, navigation]);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        value={query}
        onChangeText={setQuery}
        placeholder={t('searchPlaceholder')}
        placeholderTextColor={styles.placeholderColor}
      />
      <View style={styles.searchTypeContainer}>
        {['all', 'ot', 'nt'].map((type) => (
          <TouchableOpacity
            key={type}
            style={[
              styles.searchTypeButton,
              searchType === type && styles.activeSearchType
            ]}
            onPress={() => setSearchType(type)}
          >
            <Text style={[styles.searchTypeText, searchType === type && styles.activeSearchTypeText]}>
              {t(`searchType${type.toUpperCase()}Short`)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {isLoading ? (
        <ActivityIndicator size="large" color={styles.loadingColor} />
      ) : (
        <FlatList
          data={results}
          renderItem={renderSearchResult}
          keyExtractor={(item, index) => `${item.book}-${item.chapter}-${item.number}-${index}`}
          ListEmptyComponent={
            <Text style={styles.emptyResult}>
              {query.length < 3 ? t('enterMinChars') : t('noResults')}
            </Text>
          }
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
      backgroundColor: nightMode ? '#121212' : '#f5f5f5',
    },
    searchInput: {
      height: 40,
      borderColor: nightMode ? '#666' : 'gray',
      borderWidth: 1,
      borderRadius: 5,
      paddingHorizontal: 10,
      marginBottom: 10,
      backgroundColor: nightMode ? '#333' : 'white',
      color: nightMode ? 'white' : 'black',
      fontFamily,
      fontSize: dynamicFontSize,
    },
    placeholderColor: nightMode ? '#999999' : '#666666',
    searchTypeContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 10,
    },
    searchTypeButton: {
      flex: 1,
      padding: 10,
      backgroundColor: nightMode ? '#333' : '#e0e0e0',
      borderRadius: 5,
      marginHorizontal: 2,
      alignItems: 'center',
    },
    activeSearchType: {
      backgroundColor: '#007AFF',
    },
    searchTypeText: {
      fontSize: dynamicFontSize - 2,
      color: nightMode ? '#fff' : '#333',
      fontFamily,
    },
    activeSearchTypeText: {
      color: 'white',
    },
    resultItem: {
      marginBottom: 10,
      padding: 10,
      backgroundColor: nightMode ? '#1e1e1e' : 'white',
      borderRadius: 5,
    },
    resultReference: {
      fontWeight: 'bold',
      marginBottom: 5,
      color: nightMode ? '#fff' : '#333',
      fontFamily,
      fontSize: dynamicFontSize,
    },
    resultText: {
      color: nightMode ? '#ccc' : '#666',
      fontFamily,
      fontSize: dynamicFontSize,
    },
    emptyResult: {
      textAlign: 'center',
      marginTop: 20,
      color: nightMode ? '#ccc' : '#666',
      fontFamily,
      fontSize: dynamicFontSize,
    },
    loadingColor: '#007AFF',
  };
};

export default React.memo(SearchScreen);