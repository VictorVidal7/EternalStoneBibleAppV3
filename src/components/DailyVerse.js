import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import DailyVerseService from '../services/DailyVerseService';

const DailyVerse = ({ navigation }) => {
  const [dailyVerse, setDailyVerse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDailyVerse();
  }, []);

  const loadDailyVerse = async () => {
    setLoading(true);
    try {
      const verse = await DailyVerseService.getDailyVerse();
      setDailyVerse(verse);
    } catch (error) {
      console.error('Error al cargar el versículo diario:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!dailyVerse) return null;

  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={() => navigation.navigate('Verse', { book: dailyVerse.book, chapter: dailyVerse.chapter, verseNumber: dailyVerse.number })}
    >
      <Text style={styles.title}>Versículo del Día</Text>
      <Text style={styles.verse}>{dailyVerse.text}</Text>
      <Text style={styles.reference}>{dailyVerse.book} {dailyVerse.chapter}:{dailyVerse.number}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    minHeight: 150,
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  verse: {
    fontSize: 16,
    fontStyle: 'italic',
    marginBottom: 5,
  },
  reference: {
    fontSize: 14,
    textAlign: 'right',
  },
});

export default DailyVerse;