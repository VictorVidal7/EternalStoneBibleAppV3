import React, { useCallback, useMemo } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useBookmarks } from '../context/BookmarksContext';
import { useStyles } from '../hooks/useStyles';
import Icon from 'react-native-vector-icons/MaterialIcons';

const BookmarksScreen = () => {
  const navigation = useNavigation();
  const { bookmarks, removeBookmark } = useBookmarks();
  const styles = useStyles(createStyles);

  const sortedBookmarks = useMemo(() => {
    return [...bookmarks].sort((a, b) => {
      if (a.book !== b.book) return a.book.localeCompare(b.book);
      if (a.chapter !== b.chapter) return a.chapter - b.chapter;
      return a.verse - b.verse;
    });
  }, [bookmarks]);

  const handleRemoveBookmark = useCallback((bookmark) => {
    Alert.alert(
      "Eliminar marcador",
      `¿Estás seguro de que quieres eliminar el marcador de ${bookmark.book} ${bookmark.chapter}:${bookmark.verse}?`,
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Eliminar", onPress: () => removeBookmark(bookmark.book, bookmark.chapter, bookmark.verse) }
      ]
    );
  }, [removeBookmark]);

  const renderBookmark = useCallback(({ item }) => (
    <View style={styles.bookmarkItem}>
      <TouchableOpacity
        style={styles.bookmarkText}
        onPress={() => navigation.navigate('Verse', { book: item.book, chapter: item.chapter, verse: item.verse })}
        testID={`bookmark-item-${item.book}-${item.chapter}-${item.verse}`}
      >
        <Text style={styles.bookmarkReference}>
          {item.book} {item.chapter}:{item.verse}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity 
        onPress={() => handleRemoveBookmark(item)} 
        testID={`delete-bookmark-${item.book}-${item.chapter}-${item.verse}`}
        accessibilityLabel={`Eliminar marcador de ${item.book} ${item.chapter}:${item.verse}`}
      >
        <Icon name="delete" size={24} color={styles.iconColor} />
      </TouchableOpacity>
    </View>
  ), [styles, navigation, handleRemoveBookmark]);

  const keyExtractor = useCallback((item) => `${item.book}-${item.chapter}-${item.verse}`, []);

  if (sortedBookmarks.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>No tienes marcadores guardados.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={sortedBookmarks}
        renderItem={renderBookmark}
        keyExtractor={keyExtractor}
        initialNumToRender={10}
        maxToRenderPerBatch={20}
        windowSize={21}
        removeClippedSubviews={true}
        ListHeaderComponent={
          <Text style={styles.headerText}>Tus Marcadores</Text>
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
      padding: 10,
    },
    headerText: {
      fontSize: dynamicFontSize + 4,
      fontWeight: 'bold',
      color: nightMode ? '#fff' : '#333',
      marginBottom: 15,
      fontFamily,
    },
    bookmarkItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 15,
      borderBottomWidth: 1,
      borderBottomColor: nightMode ? '#333' : '#E0E0E0',
      backgroundColor: nightMode ? '#1E1E1E' : '#FFFFFF',
      borderRadius: 5,
      marginBottom: 10,
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

export default React.memo(BookmarksScreen);