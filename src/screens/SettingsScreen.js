import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Switch, TouchableOpacity, ScrollView, StyleSheet, TextInput } from 'react-native';
import { useUserPreferences } from '../context/UserPreferencesContext';
import { useTheme } from '../context/ThemeContext';
import NotificationService from '../services/NotificationService';
import { FONT_SIZES, FONT_FAMILIES } from '../constants/appConstants';
import { withTheme } from '../hoc/withTheme';

const SettingsScreen = ({ theme }) => {
  const { 
    fontSize, 
    fontFamily, 
    lineSpacing,
    changeFontSize, 
    changeFontFamily,
    changeLineSpacing,
  } = useUserPreferences();

  const { isDarkMode, toggleTheme, colors } = theme;

  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [notificationTimeInput, setNotificationTimeInput] = useState('12:00');

  const styles = React.useMemo(() => createStyles(colors, fontSize, fontFamily), [colors, fontSize, fontFamily]);

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
        }
      }
    }
  }, [notificationsEnabled]);

  const renderSectionTitle = (title) => (
    <Text style={styles.sectionTitle}>{title}</Text>
  );

  const renderToggleOption = (title, value, onToggle) => (
    <View style={styles.settingRow}>
      <Text style={styles.settingLabel}>{title}</Text>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: colors.secondary, true: colors.primary }}
        thumbColor={value ? colors.accent : colors.text}
      />
    </View>
  );

  const renderButtonGroup = (title, options, currentValue, onChange) => (
    <View style={styles.settingRow}>
      <Text style={styles.settingLabel}>{title}</Text>
      <View style={styles.buttonGroup}>
        {options.map((option) => (
          <TouchableOpacity
            key={option}
            style={[
              styles.button,
              currentValue === option && styles.selectedButton
            ]}
            onPress={() => onChange(option)}
          >
            <Text style={[
              styles.buttonText,
              currentValue === option && styles.selectedButtonText
            ]}>
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      {renderSectionTitle("Apariencia")}
      {renderToggleOption("Modo Oscuro", isDarkMode, toggleTheme)}
      {renderButtonGroup("Tamaño de Fuente", Object.values(FONT_SIZES), fontSize, changeFontSize)}
      {renderButtonGroup("Tipo de Fuente", Object.values(FONT_FAMILIES), fontFamily, changeFontFamily)}
      {renderButtonGroup("Espaciado de Línea", ['1.0', '1.5', '2.0'], lineSpacing, changeLineSpacing)}

      {renderSectionTitle("Notificaciones")}
      {renderToggleOption("Notificaciones de Lectura Diaria", notificationsEnabled, toggleNotifications)}
      {notificationsEnabled && (
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Hora de notificación:</Text>
          <TextInput
            style={[styles.timeInput, { color: colors.text, borderColor: colors.secondary }]}
            value={notificationTimeInput}
            onChangeText={handleTimeChange}
            placeholder="HH:MM"
            keyboardType="numeric"
            placeholderTextColor={colors.secondary}
          />
        </View>
      )}
    </ScrollView>
  );
};

const createStyles = (colors, fontSize, fontFamily) => {
  const dynamicFontSize = fontSize === 'small' ? 14 : fontSize === 'large' ? 18 : 16;

  return StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
    },
    sectionTitle: {
      fontSize: dynamicFontSize + 4,
      fontWeight: 'bold',
      color: colors.text,
      marginTop: 20,
      marginBottom: 10,
      fontFamily,
    },
    settingRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.secondary,
      flexWrap: 'wrap',
    },
    settingLabel: {
      fontSize: dynamicFontSize,
      color: colors.text,
      fontFamily,
      flex: 1,
      marginRight: 10,
    },
    buttonGroup: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'flex-end',
    },
    button: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      marginLeft: 8,
      marginBottom: 8,
      borderRadius: 4,
      backgroundColor: colors.secondary,
    },
    selectedButton: {
      backgroundColor: colors.primary,
    },
    buttonText: {
      color: colors.text,
      fontSize: dynamicFontSize - 2,
      fontFamily,
    },
    selectedButtonText: {
      color: colors.background,
    },
    timeInput: {
      borderWidth: 1,
      borderRadius: 4,
      padding: 8,
      fontSize: dynamicFontSize,
      fontFamily,
      minWidth: 80,
    },
  });
};

export default withTheme(React.memo(SettingsScreen));