import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useBookmarks } from '../context/BookmarksContext';
import { useReadingPlan } from '../context/ReadingPlanContext';
import { useStyles } from '../hooks/useStyles';
import DailyVerse from '../components/DailyVerse';
import { useTranslation } from 'react-i18next';

const HomeScreen = () => {
  const navigation = useNavigation();
  const { bookmarks } = useBookmarks();
  const { currentPlan } = useReadingPlan();
  const styles = useStyles(createStyles);
  const { t } = useTranslation();

  const buttonTextStyle = useMemo(() => [
    styles.buttonText,
    { fontSize: styles.dynamicFontSize }
  ], [styles.buttonText, styles.dynamicFontSize]);

  const renderButton = (text, onPress, testID) => (
    <TouchableOpacity style={styles.button} onPress={onPress} testID={testID}>
      <Text style={buttonTextStyle}>{text}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container} testID="home-screen">
      <Text style={styles.title}>{t('appName')}</Text>
      
      <DailyVerse />
      
      {renderButton(t('exploreBible'), () => navigation.navigate('BibleList'), 'explore-bible-button')}
      {renderButton(t('myBookmarks'), () => navigation.navigate('Bookmarks'), 'bookmarks-button')}
      {renderButton(t('viewReadingPlan'), () => navigation.navigate('ReadingPlan'), 'reading-plan-button')}
      {renderButton(t('searchBible'), () => navigation.navigate('Search'), 'search-bible-button')}
      {renderButton(t('settings'), () => navigation.navigate('Settings'), 'settings-button')}

      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          {t('readingPlan')}: {currentPlan ? currentPlan.name : t('notSelected')}
        </Text>
        <Text style={styles.infoText}>
          {t('bookmarks')}: {bookmarks.length}
        </Text>
      </View>
    </ScrollView>
  );
};

const createStyles = (nightMode, fontSize, fontFamily) => {
  const dynamicFontSize = fontSize === 'small' ? 14 : fontSize === 'large' ? 18 : 16;
  
  return {
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: nightMode ? '#121212' : '#f5f5f5',
    },
    title: {
      fontWeight: 'bold',
      marginBottom: 20,
      textAlign: 'center',
      color: nightMode ? '#fff' : '#333',
      fontFamily,
      fontSize: dynamicFontSize + 12,
    },
    button: {
      backgroundColor: nightMode ? '#0a84ff' : '#007AFF',
      padding: 15,
      borderRadius: 10,
      marginBottom: 15,
      alignItems: 'center',
    },
    buttonText: {
      color: 'white',
      fontWeight: 'bold',
      fontFamily,
    },
    infoContainer: {
      backgroundColor: nightMode ? '#2c2c2e' : '#e0e0e0',
      padding: 15,
      borderRadius: 10,
      marginTop: 20,
    },
    infoText: {
      color: nightMode ? '#fff' : '#333',
      marginBottom: 5,
      fontFamily,
      fontSize: dynamicFontSize,
    },
    dynamicFontSize,
  };
};

export default React.memo(HomeScreen);