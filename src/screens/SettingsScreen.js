import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { useUserPreferences } from '../context/UserPreferencesContext';
import NotificationService from '../services/NotificationService';

const SettingsScreen = () => {
  const { 
    nightMode, 
    fontSize, 
    fontFamily, 
    toggleNightMode, 
    changeFontSize, 
    changeFontFamily 
  } = useUserPreferences();

  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [notificationTimeInput, setNotificationTimeInput] = useState('12:00');

  const toggleNotifications = (value) => {
    setNotificationsEnabled(value);
    if (value) {
      const [hours, minutes] = notificationTimeInput.split(':').map(Number);
      NotificationService.scheduleNotification(hours, minutes);
    } else {
      NotificationService.cancelAllNotifications();
    }
  };

  const handleTimeChange = (text) => {
    setNotificationTimeInput(text);
    if (notificationsEnabled) {
      const [hours, minutes] = text.split(':').map(Number);
      if (!isNaN(hours) && !isNaN(minutes)) {
        NotificationService.scheduleNotification(hours, minutes);
      }
    }
  };

  return (
    <ScrollView style={[styles.container, nightMode && styles.containerDark]}>
      <View style={[styles.section, nightMode && styles.sectionDark]}>
        <Text style={[styles.sectionTitle, nightMode && styles.textDark]}>Apariencia</Text>
        <View style={styles.setting}>
          <Text style={[styles.settingLabel, nightMode && styles.textDark]}>Modo Nocturno</Text>
          <Switch
            value={nightMode}
            onValueChange={toggleNightMode}
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={nightMode ? "#f5dd4b" : "#f4f3f4"}
          />
        </View>

        <View style={styles.setting}>
          <Text style={[styles.settingLabel, nightMode && styles.textDark]}>Tamaño de Fuente</Text>
          <View style={styles.buttonGroup}>
            {['small', 'medium', 'large'].map((size) => (
              <TouchableOpacity 
                key={size}
                style={[
                  styles.button, 
                  fontSize === size && styles.selectedButton,
                  nightMode && styles.buttonDark
                ]} 
                onPress={() => changeFontSize(size)}
              >
                <Text style={[
                  styles.buttonText, 
                  nightMode && styles.textDark,
                  { fontSize: size === 'small' ? 14 : size === 'medium' ? 18 : 24 }
                ]}>A</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.setting}>
          <Text style={[styles.settingLabel, nightMode && styles.textDark]}>Tipo de Fuente</Text>
          <View style={styles.buttonGroup}>
            {['default', 'serif'].map((family) => (
              <TouchableOpacity 
                key={family}
                style={[
                  styles.button, 
                  fontFamily === family && styles.selectedButton,
                  nightMode && styles.buttonDark
                ]} 
                onPress={() => changeFontFamily(family)}
              >
                <Text style={[
                  styles.buttonText, 
                  nightMode && styles.textDark,
                  { fontFamily: family === 'serif' ? 'serif' : undefined }
                ]}>{family}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      <View style={[styles.section, nightMode && styles.sectionDark]}>
        <Text style={[styles.sectionTitle, nightMode && styles.textDark]}>Notificaciones</Text>
        <View style={styles.setting}>
          <Text style={[styles.settingLabel, nightMode && styles.textDark]}>Notificaciones de Lectura Diaria</Text>
          <Switch
            value={notificationsEnabled}
            onValueChange={toggleNotifications}
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={notificationsEnabled ? "#f5dd4b" : "#f4f3f4"}
          />
        </View>

        {notificationsEnabled && (
          <View style={styles.timePicker}>
            <Text style={[styles.timePickerText, nightMode && styles.textDark]}>Hora de notificación:</Text>
            <TextInput
              style={[styles.timeInput, nightMode && styles.timeInputDark]}
              value={notificationTimeInput}
              onChangeText={handleTimeChange}
              placeholder="HH:MM"
              placeholderTextColor={nightMode ? "#999" : "#666"}
              keyboardType="numeric"
            />
          </View>
        )}
      </View>

      <View style={[styles.section, nightMode && styles.sectionDark]}>
        <Text style={[styles.sectionTitle, nightMode && styles.textDark]}>Acerca de</Text>
        <Text style={[styles.aboutText, nightMode && styles.textDark]}>Eternal Stone Bible App v1.0</Text>
        <Text style={[styles.aboutText, nightMode && styles.textDark]}>Desarrollado con ❤️ por Eternal Stone</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  containerDark: {
    backgroundColor: '#121212',
  },
  section: {
    backgroundColor: 'white',
    marginBottom: 20,
    padding: 15,
  },
  sectionDark: {
    backgroundColor: '#1e1e1e',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
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
    color: '#444',
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
  buttonDark: {
    backgroundColor: '#333',
  },
  selectedButton: {
    backgroundColor: '#007AFF',
  },
  buttonText: {
    color: '#000000',
  },
  timePicker: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  timePickerText: {
    fontSize: 16,
    marginRight: 10,
  },
  timeInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 5,
    width: 80,
    textAlign: 'center',
  },
  timeInputDark: {
    borderColor: '#666',
    color: '#fff',
    backgroundColor: '#333',
  },
  aboutText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  textDark: {
    color: '#fff',
  },
});

export default SettingsScreen;