import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { bibleBooks } from '../data/bibleVerses';

const ChapterScreen = ({ route, navigation }) => {
  const { book } = route.params;
  const chapters = Array.from({ length: bibleBooks[book] }, (_, i) => i + 1);

  const renderChapter = ({ item }) => (
    <TouchableOpacity
      style={styles.chapterItem}
      onPress={() => navigation.navigate('Verse', { book, chapter: item })}
    >
      <Text style={styles.chapterText}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.bookTitle}>{book}</Text>
      <FlatList
        data={chapters}
        renderItem={renderChapter}
        keyExtractor={(item) => item.toString()}
        numColumns={3}
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
  bookTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  chapterItem: {
    flex: 1,
    margin: 5,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chapterText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ChapterScreen;