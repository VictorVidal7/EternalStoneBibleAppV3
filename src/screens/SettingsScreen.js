import React, { useState, useCallback } from 'react';
import { View, Text, Switch, TouchableOpacity, ScrollView, StyleSheet, TextInput } from 'react-native';
import Slider from '@react-native-community/slider';
import { useUserPreferences } from '../context/UserPreferencesContext';
import { useTheme } from '../context/ThemeContext';
import NotificationService from '../services/NotificationService';
import { FONT_SIZES, FONT_FAMILIES } from '../constants/appConstants';
import { withTheme } from '../hoc/withTheme';
import { useTranslation } from 'react-i18next';
import { AnalyticsService } from '../services/AnalyticsService';

const SettingsScreen = () => {
  const { 
    nightMode, 
    fontSize, 
    fontFamily, 
    lineSpacing,
    textZoom,
    colorTheme,
    toggleNightMode,
    changeFontSize,
    changeFontFamily,
    changeLineSpacing,
    changeTextZoom,
    changeColorTheme,
    COLOR_THEMES
  } = useUserPreferences();
  
  const { colors } = useTheme();
  const { t } = useTranslation();

  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [notificationTimeInput, setNotificationTimeInput] = useState('12:00');

  const styles = React.useMemo(() => createStyles(colors, fontSize, fontFamily), [colors, fontSize, fontFamily]);

  const loadNotificationSettings = useCallback(async () => {
    const scheduledTime = await NotificationService.getScheduledNotificationTime();
    if (scheduledTime) {
      setNotificationsEnabled(true);
      setNotificationTimeInput(`${scheduledTime.hour.toString().padStart(2, '0')}:${scheduledTime.minute.toString().padStart(2, '0')}`);
    }
  }, []);

  React.useEffect(() => {
    loadNotificationSettings();
  }, [loadNotificationSettings]);

  const handleSettingChange = (settingName, newValue) => {
    switch (settingName) {
      case 'nightMode':
        toggleNightMode();
        break;
      case 'fontSize':
        changeFontSize(newValue);
        break;
      case 'fontFamily':
        changeFontFamily(newValue);
        break;
      case 'lineSpacing':
        changeLineSpacing(newValue);
        break;
      case 'textZoom':
        changeTextZoom(newValue);
        break;
      case 'colorTheme':
        changeColorTheme(newValue);
        break;
    }
    AnalyticsService.logEvent('settings_changed', { setting: settingName, value: newValue });
  };

  const toggleNotifications = useCallback(async (value) => {
    try {
      setNotificationsEnabled(value);
      if (value) {
        const [hours, minutes] = notificationTimeInput.split(':').map(Number);
        await NotificationService.scheduleNotification(hours, minutes);
        AnalyticsService.logEvent('notifications_enabled', { time: notificationTimeInput });
      } else {
        await NotificationService.cancelAllNotifications();
        AnalyticsService.logEvent('notifications_disabled');
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
          AnalyticsService.logEvent('notification_time_changed', { newTime: text });
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
    <ScrollView style={styles.container}>
      {renderSectionTitle(t("appearance"))}
      {renderToggleOption(t("darkMode"), nightMode, () => handleSettingChange('nightMode', !nightMode))}
      {renderButtonGroup(t("fontSize"), Object.values(FONT_SIZES), fontSize, (size) => handleSettingChange('fontSize', size))}
      {renderButtonGroup(t("fontFamily"), Object.values(FONT_FAMILIES), fontFamily, (family) => handleSettingChange('fontFamily', family))}
      {renderButtonGroup(t("lineSpacing"), ['1.0', '1.5', '2.0'], lineSpacing, (spacing) => handleSettingChange('lineSpacing', spacing))}
      
      <View style={styles.settingRow}>
        <Text style={styles.settingLabel}>{t("textZoom")}</Text>
        <Slider
          style={{width: 200, height: 40}}
          minimumValue={50}
          maximumValue={200}
          step={10}
          value={textZoom}
          onValueChange={(value) => handleSettingChange('textZoom', value)}
          minimumTrackTintColor={colors.primary}
          maximumTrackTintColor={colors.secondary}
        />
        <Text style={styles.settingLabel}>{textZoom}%</Text>
      </View>

      <View style={styles.settingRow}>
        <Text style={styles.settingLabel}>{t("colorTheme")}</Text>
        <View style={styles.colorThemeContainer}>
          {Object.keys(COLOR_THEMES).map((theme) => (
            <TouchableOpacity
              key={theme}
              style={[
                styles.colorThemeButton,
                { backgroundColor: COLOR_THEMES[theme].primary },
                colorTheme === theme && styles.selectedColorTheme,
              ]}
              onPress={() => handleSettingChange('colorTheme', theme)}
            />
          ))}
        </View>
      </View>

      {renderSectionTitle(t("notifications"))}
      {renderToggleOption(t("dailyReadingNotifications"), notificationsEnabled, toggleNotifications)}
      {notificationsEnabled && (
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>{t("notificationTime")}:</Text>
          <TextInput
            style={styles.timeInput}
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
      backgroundColor: colors.background,
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
      borderColor: colors.secondary,
      borderRadius: 4,
      padding: 8,
      fontSize: dynamicFontSize,
      fontFamily,
      minWidth: 80,
      color: colors.text,
    },
    colorThemeContainer: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
    },
    colorThemeButton: {
      width: 30,
      height: 30,
      borderRadius: 15,
      marginLeft: 10,
    },
    selectedColorTheme: {
      borderWidth: 2,
      borderColor: colors.text,
    },
  });
};

export default withTheme(React.memo(SettingsScreen));