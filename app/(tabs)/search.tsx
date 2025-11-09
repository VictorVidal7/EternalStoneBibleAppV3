import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { useState, useCallback } from 'react';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useDebouncedCallback } from 'use-debounce';
import bibleDB from '../../src/lib/database';
import { BibleVerse } from '../../src/types/bible';

type TestamentFilter = 'all' | 'old' | 'new';

// Libros del Antiguo Testamento (1-39)
const OLD_TESTAMENT_BOOKS = [
  'Génesis', 'Éxodo', 'Levítico', 'Números', 'Deuteronomio', 'Josué', 'Jueces', 'Rut',
  '1 Samuel', '2 Samuel', '1 Reyes', '2 Reyes', '1 Crónicas', '2 Crónicas', 'Esdras',
  'Nehemías', 'Ester', 'Job', 'Salmos', 'Proverbios', 'Eclesiastés', 'Cantares',
  'Isaías', 'Jeremías', 'Lamentaciones', 'Ezequiel', 'Daniel', 'Oseas', 'Joel',
  'Amós', 'Abdías', 'Jonás', 'Miqueas', 'Nahúm', 'Habacuc', 'Sofonías', 'Hageo',
  'Zacarías', 'Malaquías'
];

export default function SearchScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<BibleVerse[]>([]);
  const [allResults, setAllResults] = useState<BibleVerse[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [testamentFilter, setTestamentFilter] = useState<TestamentFilter>('all');

  const applyTestamentFilter = useCallback((verses: BibleVerse[], filter: TestamentFilter) => {
    if (filter === 'all') return verses;

    if (filter === 'old') {
      return verses.filter(v => OLD_TESTAMENT_BOOKS.includes(v.book));
    }

    // Nuevo Testamento
    return verses.filter(v => !OLD_TESTAMENT_BOOKS.includes(v.book));
  }, []);

  const performSearch = useCallback(async (query: string) => {
    if (query.trim().length < 3) {
      setResults([]);
      setAllResults([]);
      setHasSearched(false);
      return;
    }

    setLoading(true);
    setHasSearched(true);

    try {
      await bibleDB.initialize();
      const searchResults = await bibleDB.searchVerses(query, 'RVR1960', 200);
      setAllResults(searchResults);
      setResults(applyTestamentFilter(searchResults, testamentFilter));
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
      setAllResults([]);
    } finally {
      setLoading(false);
    }
  }, [testamentFilter, applyTestamentFilter]);

  const debouncedSearch = useDebouncedCallback(performSearch, 500);

  function handleSearchChange(text: string) {
    setSearchQuery(text);
    debouncedSearch(text);
  }

  function handleFilterChange(filter: TestamentFilter) {
    setTestamentFilter(filter);
    setResults(applyTestamentFilter(allResults, filter));
  }

  function goToVerse(verse: BibleVerse) {
    router.push(`/verse/${verse.book}/${verse.chapter}?verse=${verse.verse}` as any);
  }

  function getHighlightedText(text: string, query: string) {
    if (!query.trim()) return [{ text, highlight: false }];

    const words = query.toLowerCase().split(' ').filter(w => w.length > 0);
    const parts: { text: string; highlight: boolean }[] = [];
    let lastIndex = 0;
    const lowerText = text.toLowerCase();

    // Encontrar todas las coincidencias
    const matches: { start: number; end: number }[] = [];
    words.forEach(word => {
      let index = 0;
      while ((index = lowerText.indexOf(word, index)) !== -1) {
        matches.push({ start: index, end: index + word.length });
        index += word.length;
      }
    });

    // Ordenar y fusionar coincidencias superpuestas
    matches.sort((a, b) => a.start - b.start);
    const mergedMatches: { start: number; end: number }[] = [];
    matches.forEach(match => {
      if (mergedMatches.length === 0) {
        mergedMatches.push(match);
      } else {
        const last = mergedMatches[mergedMatches.length - 1];
        if (match.start <= last.end) {
          last.end = Math.max(last.end, match.end);
        } else {
          mergedMatches.push(match);
        }
      }
    });

    // Crear partes con highlights
    mergedMatches.forEach(match => {
      if (match.start > lastIndex) {
        parts.push({ text: text.slice(lastIndex, match.start), highlight: false });
      }
      parts.push({ text: text.slice(match.start, match.end), highlight: true });
      lastIndex = match.end;
    });

    if (lastIndex < text.length) {
      parts.push({ text: text.slice(lastIndex), highlight: false });
    }

    return parts.length > 0 ? parts : [{ text, highlight: false }];
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

        {/* Testament Filters */}
        {hasSearched && (
          <View style={styles.filtersContainer}>
            <TouchableOpacity
              style={[styles.filterButton, testamentFilter === 'all' && styles.filterButtonActive]}
              onPress={() => handleFilterChange('all')}
            >
              <Text style={[styles.filterText, testamentFilter === 'all' && styles.filterTextActive]}>
                Toda la Biblia
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterButton, testamentFilter === 'old' && styles.filterButtonActive]}
              onPress={() => handleFilterChange('old')}
            >
              <Text style={[styles.filterText, testamentFilter === 'old' && styles.filterTextActive]}>
                Antiguo T.
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterButton, testamentFilter === 'new' && styles.filterButtonActive]}
              onPress={() => handleFilterChange('new')}
            >
              <Text style={[styles.filterText, testamentFilter === 'new' && styles.filterTextActive]}>
                Nuevo T.
              </Text>
            </TouchableOpacity>
          </View>
        )}
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
                  {getHighlightedText(item.text, searchQuery).map((part, index) => (
                    <Text
                      key={index}
                      style={part.highlight ? styles.highlightedText : undefined}
                    >
                      {part.text}
                    </Text>
                  ))}
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
  filtersContainer: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 8,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#ECF0F1',
    alignItems: 'center',
  },
  filterButtonActive: {
    backgroundColor: '#4A90E2',
    borderColor: '#4A90E2',
  },
  filterText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#7F8C8D',
  },
  filterTextActive: {
    color: '#FFFFFF',
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
  highlightedText: {
    backgroundColor: '#FFF9C4',
    fontWeight: '600',
    color: '#2C3E50',
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
