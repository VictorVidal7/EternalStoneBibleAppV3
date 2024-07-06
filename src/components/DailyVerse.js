import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useUserPreferences } from '../context/UserPreferencesContext';
import DailyVerseService from '../services/DailyVerseService';
import { useStyles } from '../hooks/useStyles';

const DailyVerse = ({ navigation }) => {
  const [dailyVerse, setDailyVerse] = useState(null);
  const styles = useStyles(createStyles);

  const loadDailyVerse = useCallback(async () => {
    try {
      const verse = await DailyVerseService.getDailyVerse();
      setDailyVerse(verse);
    } catch (error) {
      console.error('Error loading daily verse:', error);
    }
  }, []);

  useEffect(() => {
    loadDailyVerse();
  }, [loadDailyVerse]);

  const handlePress = useCallback(() => {
    if (dailyVerse) {
      navigation.navigate('Verse', { 
        book: dailyVerse.book, 
        chapter: dailyVerse.chapter, 
        verseNumber: dailyVerse.number 
      });
    }
  }, [dailyVerse, navigation]);

  if (!dailyVerse) return null;

  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={handlePress}
    >
      <Text style={styles.title}>Versículo del Día</Text>
      <Text style={styles.verse}>{dailyVerse.text}</Text>
      <Text style={styles.reference}>
        {dailyVerse.book} {dailyVerse.chapter}:{dailyVerse.number}
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
    verse: {
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
  };
};

export default DailyVerse;