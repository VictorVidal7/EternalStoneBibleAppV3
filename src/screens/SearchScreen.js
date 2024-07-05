import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { searchBible } from '../data/bibleVerses';
import { useUserPreferences } from '../context/UserPreferencesContext';
import Icon from 'react-native-vector-icons/MaterialIcons';

const SearchScreen = ({ navigation }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [searchType, setSearchType] = useState('all'); // 'all', 'ot', 'nt'
  const { nightMode, fontSize, fontFamily } = useUserPreferences();

  const getFontSize = () => {
    switch (fontSize) {
      case 'small': return 14;
      case 'medium': return 16;
      case 'large': return 18;
      default: return 16;
    }
  };

  const handleSearch = useCallback(() => {
    if (query.length < 3) {
      setResults([]);
      return;
    }
    const searchResults = searchBible(query, searchType);
    setResults(searchResults);
  }, [query, searchType]);

  const renderSearchResult = useCallback(({ item }) => (
    <TouchableOpacity
      style={[styles.resultItem, nightMode && styles.resultItemDark]}
      onPress={() => navigation.navigate('Verse', { book: item.book, chapter: item.chapter, verseNumber: item.verseNumber })}
    >
      <Text style={[styles.resultReference, nightMode && styles.textDark, { fontFamily, fontSize: getFontSize() - 2 }]}>
        {item.book} {item.chapter}:{item.verseNumber}
      </Text>
      <Text style={[styles.resultText, nightMode && styles.textDark, { fontFamily, fontSize: getFontSize() }]}>
        {item.text}
      </Text>
    </TouchableOpacity>
  ), [nightMode, fontFamily, fontSize, navigation]);

  return (
    <View style={[styles.container, nightMode && styles.containerDark]}>
      <View style={styles.searchInputContainer}>
        <TextInput
          style={[styles.searchInput, nightMode && styles.searchInputDark, { fontFamily, fontSize: getFontSize() }]}
          value={query}
          onChangeText={setQuery}
          placeholder="Buscar en la Biblia..."
          placeholderTextColor={nightMode ? '#999999' : '#666666'}
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity onPress={handleSearch} style={styles.searchButton}>
          <Icon name="search" size={24} color={nightMode ? '#fff' : '#007AFF'} />
        </TouchableOpacity>
      </View>
      <View style={styles.searchTypeContainer}>
        {['all', 'ot', 'nt'].map((type) => (
          <TouchableOpacity
            key={type}
            style={[
              styles.searchTypeButton,
              searchType === type && styles.activeSearchType,
              nightMode && styles.searchTypeButtonDark
            ]}
            onPress={() => setSearchType(type)}
          >
            <Text style={[styles.searchTypeText, nightMode && styles.textDark, { fontFamily, fontSize: getFontSize() - 2 }]}>
              {type === 'all' ? 'Toda la Biblia' : type === 'ot' ? 'Antiguo Testamento' : 'Nuevo Testamento'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <FlatList
        data={results}
        renderItem={renderSearchResult}
        keyExtractor={(item, index) => `${item.book}-${item.chapter}-${item.verseNumber}-${index}`}
        ListEmptyComponent={
          <Text style={[styles.emptyResult, nightMode && styles.textDark, { fontFamily, fontSize: getFontSize() }]}>
            {query.length < 3 ? "Ingresa al menos 3 caracteres para buscar" : "No se encontraron resultados"}
          </Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f5f5f5',
  },
  containerDark: {
    backgroundColor: '#121212',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: 'white',
  },
  searchInputDark: {
    backgroundColor: '#333',
    color: 'white',
    borderColor: '#666',
  },
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
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    marginHorizontal: 2,
    alignItems: 'center',
  },
  searchTypeButtonDark: {
    backgroundColor: '#333',
  },
  activeSearchType: {
    backgroundColor: '#007AFF',
  },
  searchTypeText: {
    fontSize: 12,
    color: '#333',
  },
  resultItem: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 5,
  },
  resultItemDark: {
    backgroundColor: '#1e1e1e',
  },
  resultReference: {
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  resultText: {
    color: '#666',
  },
  emptyResult: {
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
  },
  textDark: {
    color: '#fff',
  },
});

export default SearchScreen;