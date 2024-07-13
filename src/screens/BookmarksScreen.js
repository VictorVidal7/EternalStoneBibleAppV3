import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useBookmarks } from '../context/BookmarksContext';
import { useStyles } from '../hooks/useStyles';
import { withTheme } from '../hoc/withTheme';

const BookmarksScreen = ({ theme }) => {
  const navigation = useNavigation();
  const { bookmarks, removeBookmark } = useBookmarks();
  const { colors } = theme;
  const styles = useStyles(createStyles);

  const renderBookmark = ({ item }) => (
    <TouchableOpacity
      style={[styles.bookmarkItem, { backgroundColor: colors.secondary }]}
      onPress={() => navigation.navigate('Verse', { book: item.book, chapter: item.chapter, verse: item.verse })}
    >
      <Text style={[styles.bookmarkText, { color: colors.text }]}>{item.book} {item.chapter}:{item.verse}</Text>
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => removeBookmark(item.book, item.chapter, item.verse)}
      >
        <Text style={[styles.removeButtonText, { color: colors.primary }]}>Eliminar</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={bookmarks}
        renderItem={renderBookmark}
        keyExtractor={(item, index) => `${item.book}-${item.chapter}-${item.verse}-${index}`}
        ListEmptyComponent={<Text style={[styles.emptyText, { color: colors.text }]}>No tienes marcadores guardados.</Text>}
      />
    </View>
  );
};

const createStyles = (nightMode, fontSize, fontFamily) => {
  const dynamicFontSize = fontSize === 'small' ? 14 : fontSize === 'large' ? 18 : 16;

  return StyleSheet.create({
    container: {
      flex: 1,
      padding: 10,
    },
    bookmarkItem: {
      padding: 15,
      borderRadius: 5,
      marginBottom: 10,
    },
    bookmarkText: {
      fontFamily,
      fontSize: dynamicFontSize,
    },
    removeButton: {
      marginTop: 5,
      alignSelf: 'flex-end',
    },
    removeButtonText: {
      fontFamily,
      fontSize: dynamicFontSize - 2,
    },
    emptyText: {
      textAlign: 'center',
      marginTop: 20,
      fontFamily,
      fontSize: dynamicFontSize,
    },
  });
};

export default withTheme(React.memo(BookmarksScreen));