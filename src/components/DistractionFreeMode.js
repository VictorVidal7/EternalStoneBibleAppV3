import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, TouchableWithoutFeedback } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import CustomIconButton from './CustomIconButton';

const DistractionFreeMode = ({ verses, currentVerseIndex, onNextVerse, onPreviousVerse, onClose }) => {
  const { colors } = useTheme();
  const [controlsOpacity] = useState(new Animated.Value(1));
  const [textOpacity] = useState(new Animated.Value(1));

  const currentVerse = verses[currentVerseIndex];

  useEffect(() => {
    Animated.timing(textOpacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [currentVerseIndex, textOpacity]);

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

  if (!currentVerse) {
    return null;
  }

  return (
    <TouchableWithoutFeedback onPress={showControls}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Animated.View style={[styles.verseContainer, { opacity: textOpacity }]}>
          <Text style={[styles.verseText, { color: colors.text }]}>
            {currentVerse.text}
          </Text>
          <Text style={[styles.verseReference, { color: colors.secondary }]}>
            {`${currentVerse.book} ${currentVerse.chapter}:${currentVerse.number}`}
          </Text>
        </Animated.View>
        <Animated.View style={[styles.controls, { opacity: controlsOpacity }]}>
          <CustomIconButton
            name="chevron-left"
            onPress={onPreviousVerse}
            color={colors.primary}
            size={40}
            style={styles.navButton}
          />
          <CustomIconButton
            name="close"
            onPress={onClose}
            color={colors.primary}
            size={30}
            style={styles.closeButton}
          />
          <CustomIconButton
            name="chevron-right"
            onPress={onNextVerse}
            color={colors.primary}
            size={40}
            style={styles.navButton}
          />
        </Animated.View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  verseContainer: {
    padding: 20,
    alignItems: 'center',
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