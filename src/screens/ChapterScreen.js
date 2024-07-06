import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useUserPreferences } from '../context/UserPreferencesContext';
import { bibleBooks } from '../data/bibleVerses';

const ChapterScreen = ({ route, navigation }) => {
  const { book } = route.params;
  const { nightMode, fontSize, fontFamily } = useUserPreferences();

  const chapters = Array.from({ length: bibleBooks[book] }, (_, i) => i + 1);

  const renderChapter = ({ item }) => (
    <TouchableOpacity
      style={[styles.chapterItem, nightMode && styles.chapterItemDark]}
      onPress={() => navigation.navigate('Verse', { book, chapter: item })}
    >
      <Text style={[
        styles.chapterText, 
        nightMode && styles.textDark,
        { fontFamily, fontSize: fontSize === 'small' ? 14 : fontSize === 'large' ? 18 : 16 }
      ]}>
        Capítulo {item}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, nightMode && styles.containerDark]}>
      <FlatList
        data={chapters}
        renderItem={renderChapter}
        keyExtractor={(item) => item.toString()}
        numColumns={3}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 10,
  },
  containerDark: {
    backgroundColor: '#121212',
  },
  chapterItem: {
    flex: 1,
    margin: 5,
    padding: 20,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },
  chapterItemDark: {
    backgroundColor: '#333',
  },
  chapterText: {
    color: '#333',
  },
  textDark: {
    color: '#fff',
  },
});

export default ChapterScreen;