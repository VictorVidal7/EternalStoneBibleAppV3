import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useBookmarks } from '../context/BookmarksContext';
import { useReadingPlan } from '../context/ReadingPlanContext';
import { useStyles } from '../hooks/useStyles';

const HomeScreen = ({ navigation }) => {
  const { bookmarks } = useBookmarks();
  const { currentPlan } = useReadingPlan();
  const styles = useStyles(createStyles);

  const buttonTextStyle = useMemo(() => [
    styles.buttonText,
    { fontSize: styles.dynamicFontSize }
  ], [styles.buttonText, styles.dynamicFontSize]);

  const renderButton = (text, onPress) => (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={buttonTextStyle}>{text}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Eternal Stone Bible App</Text>
      
      {renderButton('Explorar la Biblia', () => navigation.navigate('Bible'))}
      {renderButton(`Mis Marcadores (${bookmarks.length})`, () => navigation.navigate('Bookmarks'))}
      {renderButton(
        currentPlan ? 'Ver Plan de Lectura' : 'Seleccionar Plan de Lectura',
        () => navigation.navigate('ReadingPlan')
      )}
      {renderButton('Buscar en la Biblia', () => navigation.navigate('Search'))}
      {renderButton('Configuración', () => navigation.navigate('Settings'))}

      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          Plan de lectura: {currentPlan ? currentPlan.name : 'No seleccionado'}
        </Text>
        <Text style={styles.infoText}>
          Marcadores: {bookmarks.length}
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

export default HomeScreen;