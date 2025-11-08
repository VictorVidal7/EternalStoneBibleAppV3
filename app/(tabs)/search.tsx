import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useState, useCallback } from 'react';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useDebouncedCallback } from 'use-debounce';
import bibleDB from '../../src/lib/database';
import { BibleVerse } from '../../src/types/bible';

export default function SearchScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<BibleVerse[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const performSearch = useCallback(async (query: string) => {
    if (query.trim().length < 3) {
      setResults([]);
      setHasSearched(false);
      return;
    }

    setLoading(true);
    setHasSearched(true);

    try {
      await bibleDB.initialize();
      const searchResults = await bibleDB.searchVerses(query, 'RVR1960', 100);
      setResults(searchResults);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const debouncedSearch = useDebouncedCallback(performSearch, 500);

  function handleSearchChange(text: string) {
    setSearchQuery(text);
    debouncedSearch(text);
  }

  function goToVerse(verse: BibleVerse) {
    router.push(`/verse/${verse.book}/${verse.chapter}?verse=${verse.verse}` as any);
  }

  function highlightText(text: string, query: string): string {
    // Simple highlight for now
    return text;
  }

  return (
    <View style={styles.container}>
      {/* Search Input */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color="#7F8C8D" />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar en toda la Biblia..."
            value={searchQuery}
            onChangeText={handleSearchChange}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => handleSearchChange('')}>
              <Ionicons name="close-circle" size={20} color="#7F8C8D" />
            </TouchableOpacity>
          )}
        </View>

        <Text style={styles.hint}>
          Escribe al menos 3 caracteres para buscar
        </Text>
      </View>

      {/* Loading State */}
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4A90E2" />
          <Text style={styles.loadingText}>Buscando...</Text>
        </View>
      )}

      {/* Results */}
      {!loading && hasSearched && (
        <>
          <View style={styles.resultsHeader}>
            <Text style={styles.resultsCount}>
              {results.length > 0
                ? `${results.length} ${results.length === 1 ? 'resultado encontrado' : 'resultados encontrados'}`
                : 'No se encontraron resultados'}
            </Text>
          </View>

          <FlatList
            data={results}
            keyExtractor={(item) => `${item.id}-${item.book}-${item.chapter}-${item.verse}`}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.resultItem}
                onPress={() => goToVerse(item)}
                activeOpacity={0.7}
              >
                <View style={styles.resultHeader}>
                  <Text style={styles.resultReference}>
                    {item.book} {item.chapter}:{item.verse}
                  </Text>
                  <Ionicons name="chevron-forward" size={18} color="#BDC3C7" />
                </View>

                <Text style={styles.resultText} numberOfLines={3}>
                  {item.text}
                </Text>
              </TouchableOpacity>
            )}
            contentContainerStyle={styles.resultsList}
            ListEmptyComponent={
              !loading && hasSearched ? (
                <View style={styles.emptyContainer}>
                  <Ionicons name="search-outline" size={64} color="#BDC3C7" />
                  <Text style={styles.emptyText}>
                    No se encontraron resultados para "{searchQuery}"
                  </Text>
                  <Text style={styles.emptyHint}>
                    Intenta con otras palabras clave
                  </Text>
                </View>
              ) : null
            }
          />
        </>
      )}

      {/* Initial State */}
      {!loading && !hasSearched && (
        <View style={styles.initialContainer}>
          <Ionicons name="search" size={80} color="#ECF0F1" />
          <Text style={styles.initialTitle}>Busca en toda la Biblia</Text>
          <Text style={styles.initialSubtitle}>
            Encuentra versículos por palabras clave
          </Text>

          <View style={styles.suggestionsContainer}>
            <Text style={styles.suggestionsTitle}>Búsquedas populares:</Text>
            {['amor', 'fe', 'esperanza', 'paz', 'salvación'].map((suggestion) => (
              <TouchableOpacity
                key={suggestion}
                style={styles.suggestionChip}
                onPress={() => handleSearchChange(suggestion)}
              >
                <Text style={styles.suggestionText}>{suggestion}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  searchContainer: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ECF0F1',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#2C3E50',
    marginLeft: 12,
  },
  hint: {
    fontSize: 13,
    color: '#7F8C8D',
    marginTop: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#7F8C8D',
    marginTop: 16,
  },
  resultsHeader: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#ECF0F1',
  },
  resultsCount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4A90E2',
  },
  resultsList: {
    padding: 16,
  },
  resultItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  resultReference: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4A90E2',
  },
  resultText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#34495E',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#7F8C8D',
    marginTop: 16,
    textAlign: 'center',
  },
  emptyHint: {
    fontSize: 14,
    color: '#BDC3C7',
    marginTop: 8,
  },
  initialContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  initialTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginTop: 20,
  },
  initialSubtitle: {
    fontSize: 16,
    color: '#7F8C8D',
    marginTop: 8,
    textAlign: 'center',
  },
  suggestionsContainer: {
    marginTop: 40,
    alignItems: 'center',
  },
  suggestionsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7F8C8D',
    marginBottom: 12,
  },
  suggestionChip: {
    backgroundColor: '#E8F4FD',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginBottom: 10,
  },
  suggestionText: {
    fontSize: 15,
    color: '#4A90E2',
    fontWeight: '500',
  },
});
