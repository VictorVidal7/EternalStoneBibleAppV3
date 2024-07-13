import React, { useCallback, useMemo } from 'react';
import { View, Text, SectionList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getAllBooks } from '../services/bibleDataManager';
import { useStyles } from '../hooks/useStyles';

const BibleListScreen = () => {
  const navigation = useNavigation();
  const styles = useStyles(createStyles);

  const sections = useMemo(() => {
    console.log("Generating sections for Bible books");
    const allBooks = getAllBooks();
    const oldTestament = allBooks.slice(0, 39);
    const newTestament = allBooks.slice(39);
    return [
      { title: 'Antiguo Testamento', data: oldTestament },
      { title: 'Nuevo Testamento', data: newTestament },
    ];
  }, []);

  const renderBookItem = useCallback(({ item }) => (
    <TouchableOpacity
      style={styles.bookItem}
      onPress={() => {
        console.log(`Navigating to Chapter screen for book: ${item}`);
        navigation.navigate('Chapter', { book: item });
      }}
    >
      <Text style={styles.bookName}>{item}</Text>
    </TouchableOpacity>
  ), [navigation, styles]);

  const renderSectionHeader = useCallback(({ section: { title } }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionHeaderText}>{title}</Text>
    </View>
  ), [styles]);

  return (
    <View style={styles.container}>
      <SectionList
        sections={sections}
        renderItem={renderBookItem}
        renderSectionHeader={renderSectionHeader}
        keyExtractor={(item) => item}
        initialNumToRender={20}
        maxToRenderPerBatch={20}
        windowSize={5}
        stickySectionHeadersEnabled={false}
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
    sectionHeader: {
      backgroundColor: nightMode ? '#1e1e1e' : '#e0e0e0',
      padding: 10,
    },
    sectionHeaderText: {
      color: nightMode ? '#fff' : '#333',
      fontFamily,
      fontSize: dynamicFontSize + 2,
      fontWeight: 'bold',
    },
  };
};

export default React.memo(BibleListScreen);