import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Switch, TouchableOpacity, ScrollView, TextInput, Alert, StyleSheet } from 'react-native';
import { useUserPreferences } from '../context/UserPreferencesContext';
import NotificationService from '../services/NotificationService';
import { FONT_SIZES, FONT_FAMILIES } from '../constants/appConstants';

const SettingsScreen = () => {
  const { 
    nightMode, 
    fontSize, 
    fontFamily, 
    lineSpacing,
    toggleNightMode, 
    changeFontSize, 
    changeFontFamily,
    changeLineSpacing,
  } = useUserPreferences();

  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [notificationTimeInput, setNotificationTimeInput] = useState('12:00');

  useEffect(() => {
    loadNotificationSettings();
  }, []);

  const loadNotificationSettings = useCallback(async () => {
    const scheduledTime = await NotificationService.getScheduledNotificationTime();
    if (scheduledTime) {
      setNotificationsEnabled(true);
      setNotificationTimeInput(`${scheduledTime.hour.toString().padStart(2, '0')}:${scheduledTime.minute.toString().padStart(2, '0')}`);
    }
  }, []);

  const toggleNotifications = useCallback(async (value) => {
    try {
      setNotificationsEnabled(value);
      if (value) {
        const [hours, minutes] = notificationTimeInput.split(':').map(Number);
        await NotificationService.scheduleNotification(hours, minutes);
      } else {
        await NotificationService.cancelAllNotifications();
      }
    } catch (error) {
      console.error('Error toggling notifications:', error);
      Alert.alert('Error', 'No se pudo configurar la notificación. Por favor, inténtalo de nuevo.');
    }
  }, [notificationTimeInput]);

  const handleTimeChange = useCallback(async (text) => {
    setNotificationTimeInput(text);
    if (notificationsEnabled) {
      const [hours, minutes] = text.split(':').map(Number);
      if (!isNaN(hours) && !isNaN(minutes)) {
        try {
          await NotificationService.scheduleNotification(hours, minutes);
        } catch (error) {
          console.error('Error scheduling notification:', error);
          Alert.alert('Error', 'No se pudo programar la notificación. Por favor, inténtalo de nuevo.');
        }
      }
    }
  }, [notificationsEnabled]);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Apariencia</Text>
        <View style={styles.setting}>
          <Text style={styles.settingLabel}>Modo Nocturno</Text>
          <Switch
            testID="night-mode-switch"
            value={nightMode}
            onValueChange={toggleNightMode}
          />
        </View>

        <View style={styles.setting}>
          <Text style={styles.settingLabel}>Tamaño de Fuente</Text>
          <View style={styles.buttonGroup}>
            {Object.values(FONT_SIZES).map((size) => (
              <TouchableOpacity
                key={size}
                testID={`font-size-${size}`}
                style={[styles.button, fontSize === size && styles.selectedButton]}
                onPress={() => changeFontSize(size)}
              >
                <Text style={styles.buttonText}>{size}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.setting}>
          <Text style={styles.settingLabel}>Tipo de Fuente</Text>
          <View style={styles.buttonGroup}>
            {Object.values(FONT_FAMILIES).map((family) => (
              <TouchableOpacity
                key={family}
                testID={`font-family-${family}`}
                style={[styles.button, fontFamily === family && styles.selectedButton]}
                onPress={() => changeFontFamily(family)}
              >
                <Text style={styles.buttonText}>{family}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.setting}>
          <Text style={styles.settingLabel}>Espaciado de Línea</Text>
          <View style={styles.buttonGroup}>
            {['1.0', '1.5', '2.0'].map((spacing) => (
              <TouchableOpacity
                key={spacing}
                testID={`line-spacing-${spacing}`}
                style={[styles.button, lineSpacing === spacing && styles.selectedButton]}
                onPress={() => changeLineSpacing(spacing)}
              >
                <Text style={styles.buttonText}>{spacing}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notificaciones</Text>
        <View style={styles.setting}>
          <Text style={styles.settingLabel}>Notificaciones de Lectura Diaria</Text>
          <Switch
            testID="notifications-switch"
            value={notificationsEnabled}
            onValueChange={toggleNotifications}
          />
        </View>

        {notificationsEnabled && (
          <View style={styles.timePicker}>
            <Text style={styles.timePickerText}>Hora de notificación:</Text>
            <TextInput
              testID="notification-time-input"
              style={styles.timeInput}
              value={notificationTimeInput}
              onChangeText={handleTimeChange}
              placeholder="HH:MM"
              keyboardType="numeric"
            />
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  section: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  setting: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  settingLabel: {
    fontSize: 16,
    color: '#555',
  },
  buttonGroup: {
    flexDirection: 'row',
  },
  button: {
    padding: 10,
    marginRight: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
  },
  selectedButton: {
    backgroundColor: '#007AFF',
  },
  buttonText: {
    color: '#333',
  },
  timePicker: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  timePickerText: {
    marginRight: 10,
    fontSize: 16,
    color: '#555',
  },
  timeInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 5,
    width: 80,
    textAlign: 'center',
    fontSize: 16,
  },
});

export default React.memo(SettingsScreen);