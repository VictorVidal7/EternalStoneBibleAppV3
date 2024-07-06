import AsyncStorage from '@react-native-async-storage/async-storage';

class NotificationService {
  constructor() {
    this.isConfigured = false;
  }

  async configure() {
    if (this.isConfigured) return;

    try {
      // Aquí iría la configuración real de las notificaciones
      // Por ejemplo, solicitar permisos, configurar canales, etc.
      
      this.isConfigured = true;
      console.log('NotificationService configured');
    } catch (error) {
      console.error('Error configuring NotificationService:', error);
    }
  }

  async scheduleNotification(hour, minute) {
    if (!this.isConfigured) {
      await this.configure();
    }

    try {
      // Aquí iría la lógica real para programar notificaciones
      console.log(`Notification scheduled for ${hour}:${minute}`);
      await AsyncStorage.setItem('notificationTime', JSON.stringify({ hour, minute }));
    } catch (error) {
      console.error('Error scheduling notification:', error);
    }
  }

  async cancelAllNotifications() {
    try {
      // Aquí iría la lógica real para cancelar todas las notificaciones
      console.log('All notifications cancelled');
      await AsyncStorage.removeItem('notificationTime');
    } catch (error) {
      console.error('Error cancelling notifications:', error);
    }
  }

  async getScheduledNotificationTime() {
    try {
      const time = await AsyncStorage.getItem('notificationTime');
      return time ? JSON.parse(time) : null;
    } catch (error) {
      console.error('Error getting scheduled notification time:', error);
      return null;
    }
  }
}

export default new NotificationService();