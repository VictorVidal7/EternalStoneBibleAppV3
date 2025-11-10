import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * NotificationService using Expo Notifications
 * Provides scheduled daily reminders for Bible reading
 */

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

class NotificationService {
  constructor() {
    this.configure();
  }

  configure = async () => {
    // Set notification channel for Android
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('daily-reminder', {
        name: 'Daily Reminder',
        description: 'Recordatorios diarios de lectura bíblica',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        enableVibrate: true,
        enableLights: true,
        lightColor: '#4A90E2',
      });
    }
  }

  requestPermissions = async () => {
    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        if (__DEV__) {
          console.log('Permiso de notificación denegado');
        }
        return false;
      }

      if (__DEV__) {
        console.log('Permiso de notificación concedido');
      }
      return true;
    } catch (error) {
      if (__DEV__) {
        console.error('Error al solicitar permisos:', error);
      }
      return false;
    }
  }

  scheduleNotification = async (hour, minute) => {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        throw new Error('No se obtuvo permiso para notificaciones');
      }

      // Cancel any existing notifications first
      await Notifications.cancelAllScheduledNotificationsAsync();

      // Create trigger for daily notification
      const trigger = {
        hour: hour,
        minute: minute,
        repeats: true,
      };

      // Schedule the notification
      const identifier = await Notifications.scheduleNotificationAsync({
        content: {
          title: "📖 Recordatorio de lectura diaria",
          body: "Es hora de tu lectura bíblica diaria",
          sound: true,
          priority: Notifications.AndroidNotificationPriority.HIGH,
          ...(Platform.OS === 'android' && {
            channelId: 'daily-reminder',
          }),
        },
        trigger,
      });

      await AsyncStorage.setItem('notificationTime', JSON.stringify({ hour, minute }));
      await AsyncStorage.setItem('notificationId', identifier);

      if (__DEV__) {
        console.log(`Notification scheduled for ${hour}:${minute} with id: ${identifier}`);
      }

      return identifier;
    } catch (error) {
      if (__DEV__) {
        console.error('Error scheduling notification:', error);
      }
      throw error;
    }
  }

  cancelAllNotifications = async () => {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      await AsyncStorage.removeItem('notificationTime');
      await AsyncStorage.removeItem('notificationId');

      if (__DEV__) {
        console.log('All notifications cancelled');
      }
    } catch (error) {
      if (__DEV__) {
        console.error('Error cancelling notifications:', error);
      }
      throw error;
    }
  }

  getScheduledNotificationTime = async () => {
    try {
      const time = await AsyncStorage.getItem('notificationTime');
      return time ? JSON.parse(time) : null;
    } catch (error) {
      if (__DEV__) {
        console.error('Error getting scheduled notification time:', error);
      }
      return null;
    }
  }

  // Get all scheduled notifications
  getAllScheduledNotifications = async () => {
    try {
      const notifications = await Notifications.getAllScheduledNotificationsAsync();
      return notifications;
    } catch (error) {
      if (__DEV__) {
        console.error('Error getting scheduled notifications:', error);
      }
      return [];
    }
  }
}

export default new NotificationService();