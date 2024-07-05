import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { bibleBooks } from '../data/bibleVerses';

const BibleListScreen = ({ navigation }) => {
  const books = Object.keys(bibleBooks);

  const renderBookItem = ({ item }) => (
    <TouchableOpacity
      style={styles.bookItem}
      onPress={() => navigation.navigate('Chapter', { book: item })}
    >
      <Text style={styles.bookName}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {books.length > 0 ? (
        <FlatList
          data={books}
          renderItem={renderBookItem}
          keyExtractor={(item) => item}
        />
      ) : (
        <Text style={styles.errorText}>No se pudieron cargar los libros de la Biblia.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  bookItem: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  bookName: {
    fontSize: 16,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
  },
});

export default BibleListScreen;