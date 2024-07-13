import React, { useCallback, useMemo } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getAllBooks } from '../services/bibleDataManager';
import { useStyles } from '../hooks/useStyles';

const BibleListScreen = () => {
  const navigation = useNavigation();
  const styles = useStyles(createStyles);

  const books = useMemo(() => getAllBooks(), []);

  const renderBookItem = useCallback(({ item }) => (
    <TouchableOpacity
      style={styles.bookItem}
      onPress={() => navigation.navigate('Chapter', { book: item })}
    >
      <Text style={styles.bookName}>{item}</Text>
    </TouchableOpacity>
  ), [navigation, styles]);

  const getItemLayout = useCallback((data, index) => ({
    length: 50,
    offset: 50 * index,
    index,
  }), []);

  return (
    <View style={styles.container}>
      <FlatList
        data={books}
        renderItem={renderBookItem}
        keyExtractor={(item) => item}
        getItemLayout={getItemLayout}
        initialNumToRender={20}
        maxToRenderPerBatch={20}
        windowSize={21}
        removeClippedSubviews={true}
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

export default React.memo(BibleListScreen);