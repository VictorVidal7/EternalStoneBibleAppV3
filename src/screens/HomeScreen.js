import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Animated, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useBookmarks } from '../context/BookmarksContext';
import { useReadingPlan } from '../context/ReadingPlanContext';
import { useStyles } from '../hooks/useStyles';
import DailyVerse from '../components/DailyVerse';
import { useTranslation } from 'react-i18next';
import { withTheme } from '../hoc/withTheme';
import { AnalyticsService } from '../services/AnalyticsService';

const HomeScreen = ({ theme }) => {
  const navigation = useNavigation();
  const { bookmarks } = useBookmarks();
  const { currentPlan } = useReadingPlan();
  const { t } = useTranslation();
  const { colors } = theme;
  const styles = useStyles(createStyles);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const renderButton = (text, onPress, testID) => (
    <TouchableOpacity 
      style={[
        styles.button,
        { backgroundColor: colors.primary }
      ]} 
      onPress={onPress} 
      testID={testID}
    >
      <Text style={[styles.buttonText, { color: colors.background }]}>{text}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container} testID="home-screen">
      <Animated.View style={{ opacity: fadeAnim }}>
        <Text style={[styles.title, { color: colors.text }]}>{t('appName')}</Text>
        
        <DailyVerse />
        
        {renderButton(t('exploreBible'), () => {
          navigation.navigate('Bible', { screen: 'BibleList' });
          AnalyticsService.logEvent('navigate_to_bible_list');
        }, 'explore-bible-button')}
        {renderButton(t('myBookmarks'), () => {
          navigation.navigate('Bookmarks');
          AnalyticsService.logEvent('navigate_to_bookmarks');
        }, 'bookmarks-button')}
        {renderButton(t('viewReadingPlan'), () => {
          navigation.navigate('ReadingPlan');
          AnalyticsService.logEvent('navigate_to_reading_plan');
        }, 'reading-plan-button')}
        {renderButton(t('searchBible'), () => {
          navigation.navigate('Search');
          AnalyticsService.logEvent('navigate_to_search');
        }, 'search-bible-button')}
        {renderButton(t('settings'), () => {
          navigation.navigate('Settings');
          AnalyticsService.logEvent('navigate_to_settings');
        }, 'settings-button')}

        <View style={[styles.infoContainer, { backgroundColor: colors.secondary }]}>
          <Text style={[styles.infoText, { color: colors.text }]}>
            {t('readingPlan')}: {currentPlan ? currentPlan.name : t('notSelected')}
          </Text>
          <Text style={[styles.infoText, { color: colors.text }]}>
            {t('bookmarks')}: {bookmarks.length}
          </Text>
        </View>
      </Animated.View>
    </ScrollView>
  );
};

const createStyles = (colors, fontSize, fontFamily) => StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  infoContainer: {
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  infoText: {
    marginBottom: 5,
    fontSize: 16,
  },
});

export default withTheme(React.memo(HomeScreen));