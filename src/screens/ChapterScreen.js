import React, { useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useStyles } from '../hooks/useStyles';
import { bibleBooks } from '../data/bibleVerses';

const ChapterScreen = ({ route, navigation }) => {
  const { book } = route.params;
  const styles = useStyles(createStyles);

  const chapters = Array.from({ length: bibleBooks[book] }, (_, i) => i + 1);

  const renderChapter = useCallback(({ item }) => (
    <TouchableOpacity
      style={styles.chapterItem}
      onPress={() => navigation.navigate('Verse', { book, chapter: item })}
    >
      <Text style={styles.chapterText}>Capítulo {item}</Text>
    </TouchableOpacity>
  ), [styles, navigation, book]);

  return (
    <View style={styles.container}>
      <Text style={styles.bookTitle}>{book}</Text>
      <FlatList
        data={chapters}
        renderItem={renderChapter}
        keyExtractor={(item) => item.toString()}
        numColumns={3}
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
    bookTitle: {
      fontSize: dynamicFontSize + 4,
      fontWeight: 'bold',
      color: nightMode ? '#fff' : '#333',
      marginBottom: 10,
      textAlign: 'center',
      fontFamily,
    },
    chapterItem: {
      flex: 1,
      margin: 5,
      padding: 20,
      backgroundColor: nightMode ? '#1e1e1e' : 'white',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 5,
    },
    chapterText: {
      color: nightMode ? '#fff' : '#333',
      fontSize: dynamicFontSize,
      fontFamily,
    },
  };
};

export default ChapterScreen;