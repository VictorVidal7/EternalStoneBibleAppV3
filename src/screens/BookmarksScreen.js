import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useBookmarks } from '../context/BookmarksContext';
import { useUserPreferences } from '../context/UserPreferencesContext';

const BookmarksScreen = ({ navigation }) => {
  const { bookmarks, removeBookmark } = useBookmarks();
  const { nightMode, fontSize, fontFamily } = useUserPreferences();

  const getFontSize = () => {
    switch (fontSize) {
      case 'small': return 14;
      case 'medium': return 16;
      case 'large': return 18;
      default: return 16;
    }
  };

  const renderBookmark = ({ item }) => (
    <View style={[styles.bookmarkItem, nightMode && styles.bookmarkItemDark]}>
      <TouchableOpacity
        onPress={() => navigation.navigate('Verse', { book: item.book, chapter: item.chapter })}
      >
        <Text style={[styles.bookmarkText, nightMode && styles.textDark, { fontFamily, fontSize: getFontSize() }]}>
          {item.book} {item.chapter}:{item.verse}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => removeBookmark(item.book, item.chapter, item.verse)}>
        <Text style={[styles.removeButton, { fontFamily, fontSize: getFontSize() - 2 }]}>Eliminar</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={[styles.container, nightMode && styles.containerDark]}>
      <Text style={[styles.title, nightMode && styles.textDark, { fontFamily, fontSize: getFontSize() + 8 }]}>
        Mis Marcadores
      </Text>
      {bookmarks.length === 0 ? (
        <Text style={[styles.emptyMessage, nightMode && styles.textDark, { fontFamily, fontSize: getFontSize() }]}>
          No tienes marcadores guardados.
        </Text>
      ) : (
        <FlatList
          data={bookmarks}
          renderItem={renderBookmark}
          keyExtractor={(item, index) => `${item.book}-${item.chapter}-${item.verse}-${index}`}
        />
      )}
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  bookmarkItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 5,
    marginBottom: 10,
  },
  bookmarkItemDark: {
    backgroundColor: '#1e1e1e',
  },
  bookmarkText: {
    fontSize: 16,
    color: '#333',
  },
  removeButton: {
    color: 'red',
  },
  emptyMessage: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
  textDark: {
    color: '#fff',
  },
});

export default BookmarksScreen;