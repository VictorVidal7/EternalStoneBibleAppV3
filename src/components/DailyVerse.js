import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useUserPreferences } from '../context/UserPreferencesContext';
import DailyVerseService from '../services/DailyVerseService';

const DailyVerse = ({ navigation }) => {
  const [dailyVerse, setDailyVerse] = useState(null);
  const { nightMode, fontSize, fontFamily } = useUserPreferences();

  useEffect(() => {
    loadDailyVerse();
  }, []);

  const loadDailyVerse = async () => {
    const verse = await DailyVerseService.getDailyVerse();
    setDailyVerse(verse);
  };

  if (!dailyVerse) return null;

  const getFontSize = () => {
    switch (fontSize) {
      case 'small': return 14;
      case 'medium': return 16;
      case 'large': return 18;
      default: return 16;
    }
  };

  return (
    <TouchableOpacity 
      style={[styles.container, nightMode && styles.containerDark]}
      onPress={() => navigation.navigate('Verse', { book: dailyVerse.book, chapter: dailyVerse.chapter, verseNumber: dailyVerse.number })}
    >
      <Text style={[styles.title, nightMode && styles.textDark, { fontFamily, fontSize: getFontSize() + 2 }]}>Versículo del Día</Text>
      <Text style={[styles.verse, nightMode && styles.textDark, { fontFamily, fontSize: getFontSize() }]}>{dailyVerse.text}</Text>
      <Text style={[styles.reference, nightMode && styles.textDark, { fontFamily, fontSize: getFontSize() - 2 }]}>
        {dailyVerse.book} {dailyVerse.chapter}:{dailyVerse.number}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  containerDark: {
    backgroundColor: '#2a2a2a',
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  verse: {
    fontStyle: 'italic',
    marginBottom: 5,
    color: '#333',
  },
  reference: {
    textAlign: 'right',
    color: '#666',
  },
  textDark: {
    color: '#fff',
  },
});

export default DailyVerse;