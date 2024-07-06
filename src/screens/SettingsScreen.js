import React, { useState } from 'react';
import { View, Text, Switch, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { useUserPreferences } from '../context/UserPreferencesContext';
import { useStyles } from '../hooks/useStyles';
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
  const styles = useStyles(createStyles);

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
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Apariencia</Text>
        <View style={styles.setting}>
          <Text style={styles.settingLabel}>Modo Nocturno</Text>
          <Switch
            value={nightMode}
            onValueChange={toggleNightMode}
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={nightMode ? "#f5dd4b" : "#f4f3f4"}
          />
        </View>

        <View style={styles.setting}>
          <Text style={styles.settingLabel}>Tamaño de Fuente</Text>
          <View style={styles.buttonGroup}>
            {['small', 'medium', 'large'].map((size) => (
              <TouchableOpacity 
                key={size}
                style={[
                  styles.button, 
                  fontSize === size && styles.selectedButton
                ]} 
                onPress={() => changeFontSize(size)}
              >
                <Text style={[
                  styles.buttonText,
                  { fontSize: size === 'small' ? 14 : size === 'medium' ? 18 : 24 }
                ]}>A</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.setting}>
          <Text style={styles.settingLabel}>Tipo de Fuente</Text>
          <View style={styles.buttonGroup}>
            {['default', 'serif'].map((family) => (
              <TouchableOpacity 
                key={family}
                style={[
                  styles.button, 
                  fontFamily === family && styles.selectedButton
                ]} 
                onPress={() => changeFontFamily(family)}
              >
                <Text style={[
                  styles.buttonText,
                  { fontFamily: family === 'serif' ? 'serif' : undefined }
                ]}>{family}</Text>
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
            value={notificationsEnabled}
            onValueChange={toggleNotifications}
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={notificationsEnabled ? "#f5dd4b" : "#f4f3f4"}
          />
        </View>

        {notificationsEnabled && (
          <View style={styles.timePicker}>
            <Text style={styles.timePickerText}>Hora de notificación:</Text>
            <TextInput
              style={styles.timeInput}
              value={notificationTimeInput}
              onChangeText={handleTimeChange}
              placeholder="HH:MM"
              keyboardType="numeric"
            />
          </View>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Acerca de</Text>
        <Text style={styles.aboutText}>Eternal Stone Bible App v1.0</Text>
        <Text style={styles.aboutText}>Desarrollado con ❤️ por Eternal Stone</Text>
      </View>
    </ScrollView>
  );
};

const createStyles = (nightMode, fontSize, fontFamily) => {
  const dynamicFontSize = fontSize === 'small' ? 14 : fontSize === 'large' ? 18 : 16;

  return {
    container: {
      flex: 1,
      backgroundColor: nightMode ? '#121212' : '#f5f5f5',
    },
    section: {
      backgroundColor: nightMode ? '#1e1e1e' : 'white',
      marginBottom: 20,
      padding: 15,
    },
    sectionTitle: {
      fontSize: dynamicFontSize + 2,
      fontWeight: 'bold',
      marginBottom: 10,
      color: nightMode ? '#fff' : '#333',
      fontFamily,
    },
    setting: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 15,
    },
    settingLabel: {
      fontSize: dynamicFontSize,
      color: nightMode ? '#ccc' : '#444',
      fontFamily,
    },
    buttonGroup: {
      flexDirection: 'row',
    },
    button: {
      padding: 10,
      marginRight: 10,
      backgroundColor: nightMode ? '#333' : '#e0e0e0',
      borderRadius: 5,
    },
    selectedButton: {
      backgroundColor: '#007AFF',
    },
    buttonText: {
      color: nightMode ? '#fff' : '#000000',
      fontFamily,
    },
    timePicker: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 10,
    },
    timePickerText: {
      fontSize: dynamicFontSize,
      marginRight: 10,
      color: nightMode ? '#ccc' : '#444',
      fontFamily,
    },
    timeInput: {
      borderWidth: 1,
      borderColor: nightMode ? '#666' : '#ccc',
      padding: 5,
      width: 80,
      textAlign: 'center',
      color: nightMode ? '#fff' : '#000',
      backgroundColor: nightMode ? '#333' : '#fff',
      fontFamily,
      fontSize: dynamicFontSize,
    },
    aboutText: {
      fontSize: dynamicFontSize,
      color: nightMode ? '#ccc' : '#666',
      marginBottom: 5,
      fontFamily,
    },
  };
};

export default SettingsScreen;