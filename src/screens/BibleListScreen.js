import React, { useCallback, useEffect, useState } from 'react';
import { View, FlatList, TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getAllBooks } from '../services/bibleDataManager';
import { useStyles } from '../hooks/useStyles';

const BookItem = React.memo(({ item, onPress, styles }) => (
  <TouchableOpacity
    style={styles.bookItem}
    onPress={onPress}
  >
    <Text style={styles.bookName}>{item}</Text>
  </TouchableOpacity>
));

const BibleListScreen = () => {
  const navigation = useNavigation();
  const styles = useStyles(createStyles);
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const loadBooks = async () => {
      const allBooks = await getAllBooks();
      setBooks(allBooks);
    };
    loadBooks();
  }, []);

  const renderBookItem = useCallback(({ item }) => (
    <BookItem
      item={item}
      onPress={() => navigation.navigate('Chapter', { book: item })}
      styles={styles}
    />
  ), [navigation, styles]);

  return (
    <View style={styles.container}>
      <FlatList
        data={books}
        renderItem={renderBookItem}
        keyExtractor={(item) => item}
        initialNumToRender={20}
        maxToRenderPerBatch={20}
        windowSize={21}
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
    bookItem: {
      padding: 15,
      borderBottomWidth: 1,
      borderBottomColor: nightMode ? '#333' : '#e0e0e0',
    },
    bookName: {
      color: nightMode ? '#fff' : '#333',
      fontFamily,
      fontSize: dynamicFontSize,
    },
  };
};

export default BibleListScreen;