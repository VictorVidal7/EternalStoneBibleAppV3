import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import DailyVerse from '../components/DailyVerse';

const HomeScreen = ({ navigation }) => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Eternal Stone Bible App</Text>
      <Text style={styles.subtitle}>Explora la Palabra Eterna</Text>
      
      <DailyVerse navigation={navigation} />
      
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Bible')}
      >
        <Text style={styles.buttonText}>Explorar la Biblia</Text>
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
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    width: '100%',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default HomeScreen;