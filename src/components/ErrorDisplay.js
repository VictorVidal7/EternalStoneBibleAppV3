import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useError } from '../context/ErrorContext';

const ErrorDisplay = () => {
  const { error } = useError();

  if (!error) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{error}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(255, 0, 0, 0.8)',
    padding: 10,
    borderRadius: 5,
  },
  text: {
    color: 'white',
    textAlign: 'center',
  },
});

export default ErrorDisplay;