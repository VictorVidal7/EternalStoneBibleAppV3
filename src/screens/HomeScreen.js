import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import DailyVerse from '../components/DailyVerse';
import { useUserPreferences } from '../context/UserPreferencesContext';

const HomeScreen = ({ navigation }) => {
  const { nightMode, fontSize, fontFamily } = useUserPreferences();

  const getFontSize = () => {
    switch (fontSize) {
      case 'small': return 14;
      case 'medium': return 16;
      case 'large': return 18;
      default: return 16;
    }
  };

  const navigateToScreen = (screenName) => {
    console.log(`Attempting to navigate to: ${screenName}`);
    Alert.alert('Navigation', `Attempting to navigate to: ${screenName}`);
    navigation.navigate(screenName);
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, nightMode && styles.containerDark]}>
      <Text style={[styles.title, nightMode && styles.textDark, { fontFamily, fontSize: getFontSize() + 12 }]}>
        Eternal Stone Bible App
      </Text>
      <Text style={[styles.subtitle, nightMode && styles.textDark, { fontFamily, fontSize: getFontSize() + 2 }]}>
        Explora la Palabra Eterna
      </Text>
      
      <DailyVerse navigation={navigation} />
      
      {[
        { name: 'Bible', title: 'Explorar la Biblia' },
        { name: 'Bookmarks', title: 'Mis Marcadores' },
        { name: 'Search', title: 'Buscar en la Biblia' },
        { name: 'Settings', title: 'Configuración' }
      ].map((screen) => (
        <TouchableOpacity
          key={screen.name}
          style={[styles.button, nightMode && styles.buttonDark]}
          onPress={() => navigateToScreen(screen.name)}
        >
          <Text style={[styles.buttonText, { fontFamily, fontSize: getFontSize() }]}>
            {screen.title}
          </Text>
        </TouchableOpacity>
      ))}
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
    backgroundColor: '#121212',
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
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
  buttonDark: {
    backgroundColor: '#1a3f6c',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default HomeScreen;