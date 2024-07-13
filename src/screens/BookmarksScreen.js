import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useBookmarks } from '../context/BookmarksContext';
import { useStyles } from '../hooks/useStyles';

const BookmarksScreen = () => {
  const navigation = useNavigation();
  const { bookmarks, removeBookmark } = useBookmarks();
  const styles = useStyles(createStyles);

  const renderBookmark = ({ item }) => (
    <TouchableOpacity
      style={styles.bookmarkItem}
      onPress={() => navigation.navigate('Verse', { book: item.book, chapter: item.chapter, verse: item.verse })}
    >
      <Text style={styles.bookmarkText}>{item.book} {item.chapter}:{item.verse}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={bookmarks}
        renderItem={renderBookmark}
        keyExtractor={(item, index) => `${item.book}-${item.chapter}-${item.verse}-${index}`}
        ListEmptyComponent={<Text style={styles.emptyText}>No tienes marcadores guardados.</Text>}
      />
    </View>
  );
};

const createStyles = (nightMode, fontSize, fontFamily) => {
  const dynamicFontSize = fontSize === 'small' ? 14 : fontSize === 'large' ? 18 : 16;

  return {
    container: {
      flex: 1,
      backgroundColor: nightMode ? '#121212' : '#f5f5f5',
      padding: 10,
    },
    bookmarkItem: {
      padding: 15,
      borderBottomWidth: 1,
      borderBottomColor: nightMode ? '#333' : '#e0e0e0',
    },
    bookmarkText: {
      color: nightMode ? '#fff' : '#333',
      fontFamily,
      fontSize: dynamicFontSize,
    },
    emptyText: {
      textAlign: 'center',
      marginTop: 20,
      color: nightMode ? '#999' : '#666',
      fontFamily,
      fontSize: dynamicFontSize,
    },
  };
};

export default BookmarksScreen;