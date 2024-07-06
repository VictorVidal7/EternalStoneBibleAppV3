import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useReadingPlan } from '../context/ReadingPlanContext';
import { readingPlans } from '../data/readingPlans';
import { useUserPreferences } from '../context/UserPreferencesContext';

const ReadingPlanScreen = ({ navigation }) => {
  const { currentPlan, savePlan } = useReadingPlan();
  const { nightMode, fontSize, fontFamily } = useUserPreferences();

  const getFontSize = (baseSize) => {
    return fontSize + baseSize;
  };

  const renderPlanItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.planItem, nightMode && styles.planItemDark]}
      onPress={() => {
        savePlan(item);
        // Comentamos la navegación automática
        // navigation.navigate('Home');
      }}
    >
      <Text style={[
        styles.planName, 
        nightMode && styles.textDark, 
        { fontFamily, fontSize: getFontSize(2) }
      ]}>
        {item.name}
      </Text>
      <Text style={[
        styles.planDescription, 
        nightMode && styles.textDark, 
        { fontFamily, fontSize: getFontSize(0) }
      ]}>
        {item.description}
      </Text>
      <Text style={[
        styles.planDuration, 
        nightMode && styles.textDark, 
        { fontFamily, fontSize: getFontSize(-2) }
      ]}>
        Duración: {item.duration} días
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, nightMode && styles.containerDark]}>
      <FlatList
        data={readingPlans}
        renderItem={renderPlanItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f5f5f5',
  },
  containerDark: {
    backgroundColor: '#121212',
  },
  planItem: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  planItemDark: {
    backgroundColor: '#1e1e1e',
  },
  planName: {
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  planDescription: {
    marginBottom: 5,
    color: '#666',
  },
  planDuration: {
    color: '#999',
  },
  textDark: {
    color: '#fff',
  },
});

export default ReadingPlanScreen;