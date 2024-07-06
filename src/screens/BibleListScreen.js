import React, { useCallback } from 'react';
import { View, FlatList, TouchableOpacity, Text } from 'react-native';
import { bibleBooks } from '../data/bibleVerses';
import { useStyles } from '../hooks/useStyles';

const BibleListScreen = ({ navigation }) => {
  const styles = useStyles(createStyles);

  const renderBookItem = useCallback(({ item }) => (
    <TouchableOpacity
      style={styles.bookItem}
      onPress={() => navigation.navigate('Chapter', { book: item })}
    >
      <Text style={styles.bookName}>{item}</Text>
    </TouchableOpacity>
  ), [styles, navigation]);

  return (
    <View style={styles.container}>
      <FlatList
        data={Object.keys(bibleBooks)}
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