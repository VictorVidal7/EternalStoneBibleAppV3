import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

/**
 * HapticFeedback service using Expo Haptics
 * Provides cross-platform haptic feedback for user interactions
 */
const HapticFeedback = {
  light: async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (error) {
      if (__DEV__) {
        console.warn('Haptic feedback not available:', error);
      }
    }
  },

  medium: async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (error) {
      if (__DEV__) {
        console.warn('Haptic feedback not available:', error);
      }
    }
  },

  heavy: async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    } catch (error) {
      if (__DEV__) {
        console.warn('Haptic feedback not available:', error);
      }
    }
  },

  success: async () => {
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      if (__DEV__) {
        console.warn('Haptic feedback not available:', error);
      }
    }
  },

  warning: async () => {
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    } catch (error) {
      if (__DEV__) {
        console.warn('Haptic feedback not available:', error);
      }
    }
  },

  error: async () => {
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } catch (error) {
      if (__DEV__) {
        console.warn('Haptic feedback not available:', error);
      }
    }
  },

  // Additional useful methods
  selection: async () => {
    try {
      await Haptics.selectionAsync();
    } catch (error) {
      if (__DEV__) {
        console.warn('Haptic feedback not available:', error);
      }
    }
  }
};

export default HapticFeedback;