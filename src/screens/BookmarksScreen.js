import React, { useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useBookmarks } from '../context/BookmarksContext';
import { useStyles } from '../hooks/useStyles';
import Icon from 'react-native-vector-icons/MaterialIcons';

const BookmarksScreen = ({ navigation }) => {
  const { bookmarks, removeBookmark } = useBookmarks();
  const styles = useStyles(createStyles);

  const renderBookmark = useCallback(({ item }) => (
    <View style={styles.bookmarkItem}>
      <TouchableOpacity
        style={styles.bookmarkText}
        onPress={() => navigation.navigate('Verse', { book: item.book, chapter: item.chapter, verse: item.verse })}
      >
        <Text style={styles.bookmarkReference}>
          {item.book} {item.chapter}:{item.verse}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => removeBookmark(item.book, item.chapter, item.verse)}>
        <Icon name="delete" size={24} color={styles.iconColor} />
      </TouchableOpacity>
    </View>
  ), [styles, navigation, removeBookmark]);

  return (
    <View style={styles.container}>
      <FlatList
        data={bookmarks}
        renderItem={renderBookmark}
        keyExtractor={(item, index) => `${item.book}-${item.chapter}-${item.verse}-${index}`}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            No tienes marcadores guardados.
          </Text>
        }
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
    },
    bookmarkItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 15,
      borderBottomWidth: 1,
      borderBottomColor: nightMode ? '#333' : '#E0E0E0',
    },
    bookmarkText: {
      flex: 1,
    },
    bookmarkReference: {
      fontSize: dynamicFontSize,
      color: nightMode ? '#fff' : '#333',
      fontFamily,
    },
    emptyText: {
      textAlign: 'center',
      marginTop: 20,
      color: nightMode ? '#999' : '#666',
      fontSize: dynamicFontSize,
      fontFamily,
    },
    iconColor: nightMode ? "#FFD700" : "#007AFF",
  };
};

export default BookmarksScreen;