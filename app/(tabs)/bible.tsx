import { View, Text, StyleSheet, SectionList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { BIBLE_BOOKS } from '../../src/constants/bible';

export default function BibleScreen() {
  const router = useRouter();

  const oldTestament = BIBLE_BOOKS.filter((book) => book.testament === 'old');
  const newTestament = BIBLE_BOOKS.filter((book) => book.testament === 'new');

  const sections = [
    { title: 'Antiguo Testamento', data: oldTestament },
    { title: 'Nuevo Testamento', data: newTestament },
  ];

  function goToChapterSelection(bookName: string) {
    router.push(`/chapter/${bookName}` as any);
  }

  return (
    <View style={styles.container}>
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id.toString()}
        renderSectionHeader={({ section }) => (
          <View style={styles.sectionHeader}>
            <Ionicons
              name={section.title.includes('Antiguo') ? 'book' : 'heart'}
              size={20}
              color="#FFFFFF"
            />
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <Text style={styles.sectionCount}>
              {section.data.length} libros
            </Text>
          </View>
        )}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.bookItem}
            onPress={() => goToChapterSelection(item.name)}
            activeOpacity={0.7}
          >
            <View style={styles.bookIconContainer}>
              <Text style={styles.bookIcon}>{item.abbr}</Text>
            </View>

            <View style={styles.bookInfo}>
              <Text style={styles.bookName}>{item.name}</Text>
              <Text style={styles.bookChapters}>
                {item.chapters} {item.chapters === 1 ? 'capítulo' : 'capítulos'}
              </Text>
            </View>

            <Ionicons name="chevron-forward" size={20} color="#BDC3C7" />
          </TouchableOpacity>
        )}
        stickySectionHeadersEnabled
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  listContent: {
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4A90E2',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 10,
    flex: 1,
  },
  sectionCount: {
    fontSize: 14,
    color: '#ECF0F1',
  },
  bookItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  bookIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E8F4FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  bookIcon: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#4A90E2',
  },
  bookInfo: {
    flex: 1,
  },
  bookName: {
    fontSize: 17,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 4,
  },
  bookChapters: {
    fontSize: 14,
    color: '#7F8C8D',
  },
});
