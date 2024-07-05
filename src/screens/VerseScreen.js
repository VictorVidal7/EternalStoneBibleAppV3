import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { getVersesForChapter } from '../data/bibleVerses';

const VerseScreen = ({ route }) => {
  const { book, chapter } = route.params;
  const verses = getVersesForChapter(book, chapter);

  const renderVerse = ({ item }) => (
    <View style={styles.verseContainer}>
      <Text style={styles.verseNumber}>{item.number}</Text>
      <Text style={styles.verseText}>{item.text}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{book} - Capítulo {chapter}</Text>
      <FlatList
        data={verses}
        renderItem={renderVerse}
        keyExtractor={(item) => item.number.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  verseContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  verseNumber: {
    fontWeight: 'bold',
    marginRight: 10,
    minWidth: 30,
  },
  verseText: {
    flex: 1,
  },
});

export default VerseScreen;