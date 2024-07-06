import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useBookmarks } from '../context/BookmarksContext';
import { useUserPreferences } from '../context/UserPreferencesContext';
import Icon from 'react-native-vector-icons/MaterialIcons';

const BookmarksScreen = ({ navigation }) => {
  const { bookmarks, removeBookmark } = useBookmarks();
  const { nightMode, fontSize, fontFamily } = useUserPreferences();

  const getFontSize = () => {
    switch (fontSize) {
      case 'small': return 16;
      case 'medium': return 18;
      case 'large': return 20;
      default: return 18;
    }
  };

  const renderBookmark = ({ item }) => (
    <View style={[styles.bookmarkItem, nightMode && styles.bookmarkItemDark]}>
      <TouchableOpacity
        style={styles.bookmarkText}
        onPress={() => navigation.navigate('Verse', { book: item.book, chapter: item.chapter, verse: item.verse })}
      >
        <Text style={[styles.bookmarkReference, nightMode && styles.textDark, { fontFamily, fontSize: getFontSize() }]}>
          {item.book} {item.chapter}:{item.verse}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => removeBookmark(item.book, item.chapter, item.verse)}>
        <Icon name="delete" size={24} color={nightMode ? "#FFD700" : "#007AFF"} />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={[styles.container, nightMode && styles.containerDark]}>
      <FlatList
        data={bookmarks}
        renderItem={renderBookmark}
        keyExtractor={(item, index) => `${item.book}-${item.chapter}-${item.verse}-${index}`}
        ListEmptyComponent={
          <Text style={[styles.emptyText, nightMode && styles.textDark, { fontFamily, fontSize: getFontSize() }]}>
            No tienes marcadores guardados.
          </Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  containerDark: {
    backgroundColor: '#121212',
  },
  bookmarkItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  bookmarkItemDark: {
    borderBottomColor: '#333',
  },
  bookmarkText: {
    flex: 1,
  },
  bookmarkReference: {
    fontSize: 16,
    color: '#333',
  },
  textDark: {
    color: '#FFFFFF',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
  },
});

export default BookmarksScreen;