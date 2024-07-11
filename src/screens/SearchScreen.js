import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { searchBible } from '../data/bibleVerses';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useStyles } from '../hooks/useStyles';
import { debounce } from 'lodash';

const SearchScreen = () => {
  const navigation = useNavigation();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [searchType, setSearchType] = useState('all');
  const styles = useStyles(createStyles);

  const handleSearch = useCallback(() => {
    if (query.length < 3) {
      setResults([]);
      return;
    }
    console.log('Searching for:', query, 'with type:', searchType);
    const searchResults = searchBible(query, searchType);
    console.log('Search results:', searchResults);
    setResults(searchResults);
  }, [query, searchType]);

  const debouncedSearch = useMemo(
    () => debounce(handleSearch, 300),
    [handleSearch]
  );

  useEffect(() => {
    if (query.length >= 3) {
      debouncedSearch();
    } else {
      setResults([]);
    }
    return () => {
      debouncedSearch.cancel();
    };
  }, [query, searchType, debouncedSearch]);

  const renderSearchResult = useCallback(({ item }) => (
    <TouchableOpacity
      style={styles.resultItem}
      onPress={() => navigation.navigate('Verse', { book: item.book, chapter: item.chapter, verseNumber: item.verseNumber })}
      accessibilityLabel={`Resultado de búsqueda: ${item.book} ${item.chapter}:${item.verseNumber}`}
      accessibilityHint="Pulse para ver el versículo completo"
    >
      <Text style={styles.resultReference}>
        {item.book} {item.chapter}:{item.verseNumber}
      </Text>
      <Text style={styles.resultText} numberOfLines={2}>
        {item.text}
      </Text>
    </TouchableOpacity>
  ), [styles, navigation]);

  const searchTypeButtons = useMemo(() => ['all', 'ot', 'nt'].map((type) => (
    <TouchableOpacity
      key={type}
      style={[
        styles.searchTypeButton,
        searchType === type && styles.activeSearchType
      ]}
      onPress={() => setSearchType(type)}
      accessibilityLabel={`Buscar en ${type === 'all' ? 'toda la Biblia' : type === 'ot' ? 'Antiguo Testamento' : 'Nuevo Testamento'}`}
      accessibilityHint={`Pulse para cambiar el tipo de búsqueda a ${type === 'all' ? 'toda la Biblia' : type === 'ot' ? 'Antiguo Testamento' : 'Nuevo Testamento'}`}
    >
      <Text style={[styles.searchTypeText, searchType === type && styles.activeSearchTypeText]}>
        {type === 'all' ? 'Toda' : type === 'ot' ? 'A.T.' : 'N.T.'}
      </Text>
    </TouchableOpacity>
  )), [searchType, styles]);

  return (
    <View style={styles.container} testID="search-screen">
      <View style={styles.searchInputContainer}>
        <TextInput
          style={styles.searchInput}
          value={query}
          onChangeText={setQuery}
          placeholder="Buscar en la Biblia..."
          placeholderTextColor={styles.placeholderColor}
          onSubmitEditing={handleSearch}
          testID="search-input"
          accessibilityLabel="Campo de búsqueda bíblica"
          accessibilityHint="Ingrese texto para buscar en la Biblia"
        />
        <TouchableOpacity 
          onPress={handleSearch} 
          style={styles.searchButton} 
          testID="search-icon"
          accessibilityLabel="Botón de búsqueda"
          accessibilityHint="Presione para realizar la búsqueda"
        >
          <Icon name="search" size={24} color={styles.iconColor} />
        </TouchableOpacity>
      </View>
      <View style={styles.searchTypeContainer}>
        {searchTypeButtons}
      </View>
      <FlatList
        data={results}
        renderItem={renderSearchResult}
        keyExtractor={(item, index) => `${item.book}-${item.chapter}-${item.verseNumber}-${index}`}
        ListEmptyComponent={
          <Text style={styles.emptyResult}>
            {query.length < 3 ? "Ingresa al menos 3 caracteres para buscar" : "No se encontraron resultados"}
          </Text>
        }
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
      backgroundColor: nightMode ? '#121212' : '#f5f5f5',
    },
    searchInputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
    },
    searchInput: {
      flex: 1,
      height: 40,
      borderColor: nightMode ? '#666' : 'gray',
      borderWidth: 1,
      borderRadius: 5,
      paddingHorizontal: 10,
      backgroundColor: nightMode ? '#333' : 'white',
      color: nightMode ? 'white' : 'black',
      fontFamily,
      fontSize: dynamicFontSize,
    },
    placeholderColor: nightMode ? '#999999' : '#666666',
    iconColor: nightMode ? '#fff' : '#007AFF',
    searchButton: {
      padding: 10,
    },
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
  };
};

export default SearchScreen;