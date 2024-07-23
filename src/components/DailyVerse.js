import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import DailyVerseService from '../services/DailyVerseService';
import { useTranslation } from 'react-i18next';

const DailyVerse = () => {
  const [verse, setVerse] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const theme = useTheme();
  const { t } = useTranslation();

  useEffect(() => {
    const fetchDailyVerse = async () => {
      try {
        const dailyVerse = await DailyVerseService.getDailyVerse();
        setVerse(dailyVerse);
      } catch (error) {
        console.error('Error al obtener el versículo del día:', error);
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

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.card,
      padding: 16,
      borderRadius: theme.roundness,
      margin: 16,
      elevation: 2,
      shadowColor: theme.colors.text,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    title: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.colors.primary,
      marginBottom: 8,
    },
    verseText: {
      fontSize: 16,
      color: theme.colors.text,
      marginBottom: 8,
      fontStyle: 'italic',
    },
    reference: {
      fontSize: 14,
      color: theme.colors.secondary,
      textAlign: 'right',
    },
  });

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="small" color={theme.colors.primary} />
      </View>
    );
  }

  if (!verse) {
    return null;
  }

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <Text style={styles.title}>{t('Versículo del día')}</Text>
      <Text style={styles.verseText}>{verse.text}</Text>
      <Text style={styles.reference}>
        {verse.book} {verse.chapter}:{verse.number}
      </Text>
    </TouchableOpacity>
  );
};

export default DailyVerse;