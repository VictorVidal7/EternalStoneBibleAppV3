import React, { useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useReadingPlan } from '../context/ReadingPlanContext';
import { readingPlans } from '../data/readingPlans';
import { useStyles } from '../hooks/useStyles';

const ReadingPlanScreen = ({ navigation }) => {
  const { currentPlan, savePlan } = useReadingPlan();
  const styles = useStyles(createStyles);

  const renderPlanItem = useCallback(({ item }) => (
    <TouchableOpacity
      style={styles.planItem}
      onPress={() => {
        savePlan(item);
        navigation.navigate('Home');
      }}
    >
      <Text style={styles.planName}>{item.name}</Text>
      <Text style={styles.planDescription}>{item.description}</Text>
      <Text style={styles.planDuration}>Duración: {item.duration} días</Text>
    </TouchableOpacity>
  ), [styles, savePlan, navigation]);

  return (
    <View style={styles.container}>
      {currentPlan && (
        <View style={styles.currentPlanContainer}>
          <Text style={styles.currentPlanTitle}>Plan Actual:</Text>
          <Text style={styles.currentPlanName}>{currentPlan.name}</Text>
        </View>
      )}
      <FlatList
        data={readingPlans}
        renderItem={renderPlanItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <Text style={styles.header}>Selecciona un Plan de Lectura</Text>
        }
      />
    </View>
  );
};

const createStyles = (nightMode, fontSize, fontFamily) => {
  const dynamicFontSize = fontSize === 'small' ? 14 : fontSize === 'large' ? 18 : 16;

  return {
    container: {
      flex: 1,
      padding: 10,
      backgroundColor: nightMode ? '#121212' : '#f5f5f5',
    },
    header: {
      fontSize: dynamicFontSize + 4,
      fontWeight: 'bold',
      color: nightMode ? '#fff' : '#333',
      marginBottom: 10,
      fontFamily,
    },
    currentPlanContainer: {
      backgroundColor: nightMode ? '#2c2c2e' : '#e0e0e0',
      padding: 15,
      borderRadius: 10,
      marginBottom: 20,
    },
    currentPlanTitle: {
      fontSize: dynamicFontSize,
      fontWeight: 'bold',
      color: nightMode ? '#fff' : '#333',
      marginBottom: 5,
      fontFamily,
    },
    currentPlanName: {
      fontSize: dynamicFontSize,
      color: nightMode ? '#ccc' : '#666',
      fontFamily,
    },
    planItem: {
      backgroundColor: nightMode ? '#1e1e1e' : 'white',
      padding: 15,
      borderRadius: 10,
      marginBottom: 10,
    },
    planName: {
      fontSize: dynamicFontSize + 2,
      fontWeight: 'bold',
      marginBottom: 5,
      color: nightMode ? '#fff' : '#333',
      fontFamily,
    },
    planDescription: {
      fontSize: dynamicFontSize,
      marginBottom: 5,
      color: nightMode ? '#ccc' : '#666',
      fontFamily,
    },
    planDuration: {
      fontSize: dynamicFontSize - 2,
      color: nightMode ? '#999' : '#999',
      fontFamily,
    },
  };
};

export default ReadingPlanScreen;