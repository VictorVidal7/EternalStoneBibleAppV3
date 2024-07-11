import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useStyles } from '../hooks/useStyles';
import DailyVerseService from '../services/DailyVerseService';

const DailyVerse = () => {
  const [verse, setVerse] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const styles = useStyles(createStyles);

  useEffect(() => {
    const fetchDailyVerse = async () => {
      try {
        const dailyVerse = await DailyVerseService.getDailyVerse();
        setVerse(dailyVerse);
      } catch (error) {
        console.error('Error fetching daily verse:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDailyVerse();
  }, []);

  const handlePress = () => {
    if (verse) {
      navigation.navigate('Verse', { 
        book: verse.book, 
        chapter: verse.chapter, 
        verseNumber: verse.number 
      });
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="small" color={styles.loadingColor} />
      </View>
    );
  }

  if (!verse) {
    return null;
  }

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <Text style={styles.title}>Versículo del Día</Text>
      <Text style={styles.verseText}>{verse.text}</Text>
      <Text style={styles.reference}>
        {verse.book} {verse.chapter}:{verse.number}
      </Text>
    </TouchableOpacity>
  );
};

const createStyles = (nightMode, fontSize, fontFamily) => {
  const dynamicFontSize = fontSize === 'small' ? 14 : fontSize === 'large' ? 18 : 16;

  return {
    container: {
      backgroundColor: nightMode ? '#2a2a2a' : '#f0f0f0',
      padding: 15,
      borderRadius: 10,
      marginBottom: 20,
    },
    title: {
      fontWeight: 'bold',
      marginBottom: 10,
      color: nightMode ? '#fff' : '#333',
      fontFamily,
      fontSize: dynamicFontSize + 2,
    },
    verseText: {
      fontStyle: 'italic',
      marginBottom: 5,
      color: nightMode ? '#fff' : '#333',
      fontFamily,
      fontSize: dynamicFontSize,
    },
    reference: {
      textAlign: 'right',
      color: nightMode ? '#ccc' : '#666',
      fontFamily,
      fontSize: dynamicFontSize - 2,
    },
    loadingColor: nightMode ? '#ffffff' : '#000000',
  };
};

export default DailyVerse;