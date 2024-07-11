import React, { useCallback, useMemo, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import { ProgressBar } from '@react-native-community/progress-bar-android';
import { useNavigation } from '@react-navigation/native';
import { useReadingPlan } from '../context/ReadingPlanContext';
import { readingPlans } from '../data/readingPlans';
import { useStyles } from '../hooks/useStyles';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ReadingPlanScreen = () => {
  const navigation = useNavigation();
  const { currentPlan, savePlan, progress, startPlan, continuePlan } = useReadingPlan();
  const styles = useStyles(createStyles);

  useEffect(() => {
    console.log('ReadingPlan context:', { currentPlan, progress, startPlan, continuePlan });
  }, [currentPlan, progress, startPlan, continuePlan]);

  const handlePlanSelection = useCallback((plan) => {
    if (currentPlan && currentPlan.id !== plan.id) {
      Alert.alert(
        "Cambiar Plan de Lectura",
        "¿Estás seguro de que quieres cambiar tu plan de lectura actual? Tu progreso en el plan actual se guardará.",
        [
          { text: "Cancelar", style: "cancel" },
          { text: "Cambiar", onPress: () => savePlan(plan) }
        ]
      );
    } else if (!currentPlan) {
      savePlan(plan);
    }
  }, [currentPlan, savePlan]);

  const handleStartContinuePlan = useCallback(() => {
    console.log('handleStartContinuePlan called');
    if (currentPlan) {
      if (progress[currentPlan.id]) {
        console.log('Continuing plan');
        continuePlan && continuePlan();
      } else {
        console.log('Starting plan');
        startPlan && startPlan();
      }
      navigation.navigate('Home'); // Cambiado de 'Bible' a 'Home'
    } else {
      console.log('No current plan selected');
    }
  }, [currentPlan, progress, continuePlan, startPlan, navigation]);

  const renderPlanItem = useCallback(({ item }) => {
    const isCurrentPlan = currentPlan && currentPlan.id === item.id;
    const planProgress = progress[item.id] || {};
    const completedDays = Object.keys(planProgress).length;
    const progressPercentage = (completedDays / item.duration) * 100;

    return (
      <TouchableOpacity
        style={[styles.planItem, isCurrentPlan && styles.currentPlanItem]}
        onPress={() => handlePlanSelection(item)}
        testID={`plan-item-${item.id}`}
      >
        <View style={styles.planHeader}>
          <Text style={styles.planName}>{item.name}</Text>
          {isCurrentPlan && <Icon name="check-circle" size={24} color={styles.checkColor} />}
        </View>
        <Text style={styles.planDescription}>{item.description}</Text>
        <Text style={styles.planDuration}>Duración: {item.duration} días</Text>
        {isCurrentPlan && (
          <View style={styles.progressContainer}>
            <ProgressBar progress={progressPercentage / 100} color={styles.progressBarColor} style={styles.progressBar} />
            <Text style={styles.progressText}>{`${completedDays}/${item.duration} días completados`}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  }, [styles, currentPlan, progress, handlePlanSelection]);

  const memoizedPlans = useMemo(() => readingPlans, []);

  return (
    <View style={styles.container} testID="reading-plan-screen">
      {currentPlan && (
        <TouchableOpacity style={styles.startContinueButton} onPress={handleStartContinuePlan}>
          <Text style={styles.startContinueButtonText}>
            {progress[currentPlan.id] ? "Continuar Lectura" : "Comenzar Plan"}
          </Text>
        </TouchableOpacity>
      )}
      <FlatList
        data={memoizedPlans}
        renderItem={renderPlanItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <Text style={styles.header}>Planes de Lectura Disponibles</Text>
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
      backgroundColor: nightMode ? '#121212' : '#f5f5f5',
      padding: 10,
    },
    header: {
      fontSize: dynamicFontSize + 4,
      fontWeight: 'bold',
      color: nightMode ? '#fff' : '#333',
      marginBottom: 15,
      fontFamily,
    },
    planItem: {
      backgroundColor: nightMode ? '#1e1e1e' : 'white',
      padding: 15,
      borderRadius: 10,
      marginBottom: 15,
      elevation: 3,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.22,
      shadowRadius: 2.22,
    },
    currentPlanItem: {
      borderColor: nightMode ? '#0a84ff' : '#007AFF',
      borderWidth: 2,
    },
    planHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 5,
    },
    planName: {
      fontSize: dynamicFontSize + 2,
      fontWeight: 'bold',
      color: nightMode ? '#fff' : '#333',
      fontFamily,
    },
    planDescription: {
      fontSize: dynamicFontSize,
      color: nightMode ? '#ccc' : '#666',
      marginBottom: 5,
      fontFamily,
    },
    planDuration: {
      fontSize: dynamicFontSize - 2,
      color: nightMode ? '#999' : '#999',
      fontFamily,
    },
    progressContainer: {
      marginTop: 10,
    },
    progressBar: {
      height: 5,
      borderRadius: 5,
    },
    progressBarColor: nightMode ? '#0a84ff' : '#007AFF',
    progressText: {
      fontSize: dynamicFontSize - 2,
      color: nightMode ? '#ccc' : '#666',
      marginTop: 5,
      fontFamily,
    },
    checkColor: nightMode ? '#0a84ff' : '#007AFF',
    startContinueButton: {
      backgroundColor: nightMode ? '#0a84ff' : '#007AFF',
      padding: 15,
      borderRadius: 10,
      alignItems: 'center',
      marginBottom: 15,
    },
    startContinueButtonText: {
      color: 'white',
      fontSize: dynamicFontSize,
      fontWeight: 'bold',
      fontFamily,
    },
  };
};

export default React.memo(ReadingPlanScreen);