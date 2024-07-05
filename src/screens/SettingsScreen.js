import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import DailyVerse from '../components/DailyVerse';
import { useUserPreferences } from '../context/UserPreferencesContext';

const HomeScreen = ({ navigation }) => {
  const { nightMode } = useUserPreferences();

  return (
    <ScrollView contentContainerStyle={[styles.container, nightMode && styles.containerDark]}>
      <Text style={[styles.title, nightMode && styles.textDark]}>Eternal Stone Bible App</Text>
      <Text style={[styles.subtitle, nightMode && styles.textDark]}>Explora la Palabra Eterna</Text>
      
      <DailyVerse navigation={navigation} />
      
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Bible')}
      >
        <Text style={styles.buttonText}>Explorar la Biblia</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Bookmarks')}
      >
        <Text style={styles.buttonText}>Mis Marcadores</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Search')}
      >
        <Text style={styles.buttonText}>Buscar en la Biblia</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Settings')}
      >
        <Text style={styles.buttonText}>Configuración</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  containerDark: {
    backgroundColor: '#1a1a1a',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 30,
  },
  textDark: {
    color: '#fff',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    width: '100%',
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default HomeScreen;