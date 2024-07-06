import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useUserPreferences } from '../context/UserPreferencesContext';
import { useBookmarks } from '../context/BookmarksContext';
import { useReadingPlan } from '../context/ReadingPlanContext';

const HomeScreen = ({ navigation }) => {
  const { nightMode, fontSize, fontFamily } = useUserPreferences();
  const { bookmarks } = useBookmarks();
  const { currentPlan } = useReadingPlan();

  useEffect(() => {
    console.log('HomeScreen rendered');
    console.log('nightMode:', nightMode);
    console.log('fontSize:', fontSize);
    console.log('fontFamily:', fontFamily);
    console.log('bookmarks:', bookmarks);
    console.log('currentPlan:', currentPlan);
  }, [nightMode, fontSize, fontFamily, bookmarks, currentPlan]);

  const buttonStyle = [styles.button, nightMode && styles.buttonDark];
  const buttonTextStyle = [styles.buttonText, { fontFamily, fontSize: fontSize === 'small' ? 14 : fontSize === 'large' ? 18 : 16 }];

  return (
    <ScrollView style={[styles.container, nightMode && styles.containerDark]}>
      <Text style={[styles.title, nightMode && styles.textDark, { fontFamily, fontSize: fontSize === 'small' ? 24 : fontSize === 'large' ? 32 : 28 }]}>
        Eternal Stone Bible App
      </Text>
      
      <TouchableOpacity style={buttonStyle} onPress={() => navigation.navigate('Bible')}>
        <Text style={buttonTextStyle}>Explorar la Biblia</Text>
      </TouchableOpacity>

      <TouchableOpacity style={buttonStyle} onPress={() => navigation.navigate('Bookmarks')}>
        <Text style={buttonTextStyle}>Mis Marcadores ({bookmarks.length})</Text>
      </TouchableOpacity>

      <TouchableOpacity style={buttonStyle} onPress={() => navigation.navigate('ReadingPlan')}>
        <Text style={buttonTextStyle}>
          {currentPlan ? 'Ver Plan de Lectura' : 'Seleccionar Plan de Lectura'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={buttonStyle} onPress={() => navigation.navigate('Search')}>
        <Text style={buttonTextStyle}>Buscar en la Biblia</Text>
      </TouchableOpacity>

      <TouchableOpacity style={buttonStyle} onPress={() => navigation.navigate('Settings')}>
        <Text style={buttonTextStyle}>Configuración</Text>
      </TouchableOpacity>

      <View style={[styles.infoContainer, nightMode && styles.infoContainerDark]}>
        <Text style={[styles.infoText, nightMode && styles.textDark, { fontFamily }]}>
          Plan de lectura: {currentPlan ? currentPlan.name : 'No seleccionado'}
        </Text>
        <Text style={[styles.infoText, nightMode && styles.textDark, { fontFamily }]}>
          Marcadores: {bookmarks.length}
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  containerDark: {
    backgroundColor: '#121212',
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: 'center',
  },
  buttonDark: {
    backgroundColor: '#0a84ff',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  infoContainer: {
    backgroundColor: '#e0e0e0',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  infoContainerDark: {
    backgroundColor: '#2c2c2e',
  },
  infoText: {
    color: '#333',
    marginBottom: 5,
  },
  textDark: {
    color: '#fff',
  },
});

export default HomeScreen;