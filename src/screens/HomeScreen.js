import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useBookmarks } from '../context/BookmarksContext';
import { useReadingPlan } from '../context/ReadingPlanContext';
import { useStyles } from '../hooks/useStyles';
import DailyVerse from '../components/DailyVerse';
import { useTranslation } from 'react-i18next';
import { withTheme } from '../hoc/withTheme';

const HomeScreen = ({ theme }) => {
  const navigation = useNavigation();
  const { bookmarks } = useBookmarks();
  const { currentPlan } = useReadingPlan();
  const { t } = useTranslation();
  const { colors } = theme;

  const styles = useMemo(() => createStyles(colors), [colors]);

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

const createStyles = (colors) => StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.background,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: colors.text,
    fontSize: 28,
  },
  button: {
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: colors.background,
    fontWeight: 'bold',
  },
  infoContainer: {
    backgroundColor: colors.secondary,
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  infoText: {
    color: colors.text,
    marginBottom: 5,
    fontSize: 16,
  },
});

export default withTheme(React.memo(HomeScreen));