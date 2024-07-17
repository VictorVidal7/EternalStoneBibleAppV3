import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../context/ThemeContext';

const DistractionFreeMode = ({ verses, currentVerseIndex, onNextVerse, onPreviousVerse, onClose }) => {
  const { colors } = useTheme();
  const [controlsOpacity] = useState(new Animated.Value(1));

  const showControls = () => {
    Animated.timing(controlsOpacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
    setTimeout(hideControls, 3000);
  };

  const hideControls = () => {
    Animated.timing(controlsOpacity, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const currentVerse = verses[currentVerseIndex];

  if (!currentVerse) {
    return null;
  }

  return (
    <TouchableOpacity 
      style={[styles.container, { backgroundColor: colors.background }]} 
      activeOpacity={1}
      onPress={showControls}
    >
      <Text style={[styles.verseText, { color: colors.text }]}>
        {currentVerse.text}
      </Text>
      <Text style={[styles.verseReference, { color: colors.secondary }]}>
        {`${currentVerse.book} ${currentVerse.chapter}:${currentVerse.number}`}
      </Text>
      <Animated.View style={[styles.controls, { opacity: controlsOpacity }]}>
        <TouchableOpacity onPress={onPreviousVerse} style={styles.navButton}>
          <Icon name="chevron-left" size={40} color={colors.primary} />
        </TouchableOpacity>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Icon name="close" size={30} color={colors.primary} />
        </TouchableOpacity>
        <TouchableOpacity onPress={onNextVerse} style={styles.navButton}>
          <Icon name="chevron-right" size={40} color={colors.primary} />
        </TouchableOpacity>
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  verseText: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
  },
  verseReference: {
    fontSize: 18,
    fontStyle: 'italic',
  },
  controls: {
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    left: 0,
    right: 0,
    bottom: 40,
    paddingHorizontal: 20,
  },
  navButton: {
    padding: 10,
  },
  closeButton: {
    padding: 10,
  },
});

export default DistractionFreeMode;