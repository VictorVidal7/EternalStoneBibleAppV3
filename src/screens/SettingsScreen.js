import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Switch, TouchableOpacity, ScrollView, StyleSheet, TextInput } from 'react-native';
import Slider from '@react-native-community/slider';
import { useUserPreferences } from '../context/UserPreferencesContext';
import { useTheme } from '../context/ThemeContext';
import NotificationService from '../services/NotificationService';
import { FONT_SIZES, FONT_FAMILIES } from '../constants/appConstants';
import { withTheme } from '../hoc/withTheme';
import ColorPicker from '../components/ColorPicker';
import { useTranslation } from 'react-i18next';
import { AnalyticsService } from '../services/AnalyticsService';

const SettingsScreen = ({ theme }) => {
  const { 
    fontSize, 
    fontFamily, 
    lineSpacing,
    textZoom,
    accentColor,
    changeFontSize, 
    changeFontFamily,
    changeLineSpacing,
    changeTextZoom,
    changeAccentColor
  } = useUserPreferences();

  const { isDarkMode, toggleTheme, colors } = theme;
  const { t } = useTranslation();

  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [notificationTimeInput, setNotificationTimeInput] = useState('12:00');

  const styles = React.useMemo(() => createStyles(colors, fontSize, fontFamily, textZoom, accentColor), [colors, fontSize, fontFamily, textZoom, accentColor]);

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

  const handleTextZoomChange = useCallback((value) => {
    changeTextZoom(value);
    AnalyticsService.logEvent('text_zoom_changed', { newZoom: value });
  }, [changeTextZoom]);

  const handleFontSizeChange = useCallback((size) => {
    changeFontSize(size);
    AnalyticsService.logEvent('font_size_changed', { newSize: size });
  }, [changeFontSize]);

  const handleFontFamilyChange = useCallback((family) => {
    changeFontFamily(family);
    AnalyticsService.logEvent('font_family_changed', { newFamily: family });
  }, [changeFontFamily]);

  const handleLineSpacingChange = useCallback((spacing) => {
    changeLineSpacing(spacing);
    AnalyticsService.logEvent('line_spacing_changed', { newSpacing: spacing });
  }, [changeLineSpacing]);

  const handleAccentColorChange = useCallback((color) => {
    changeAccentColor(color);
    AnalyticsService.logEvent('accent_color_changed', { newColor: color });
  }, [changeAccentColor]);

  const renderSectionTitle = (title) => (
    <Text style={styles.sectionTitle}>{title}</Text>
  );

  const renderToggleOption = (title, value, onToggle) => (
    <View style={styles.settingRow}>
      <Text style={styles.settingLabel}>{title}</Text>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: colors.secondary, true: accentColor }}
        thumbColor={value ? colors.background : colors.text}
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
      {renderToggleOption(t("darkMode"), isDarkMode, toggleTheme)}
      {renderButtonGroup(t("fontSize"), Object.values(FONT_SIZES), fontSize, handleFontSizeChange)}
      {renderButtonGroup(t("fontFamily"), Object.values(FONT_FAMILIES), fontFamily, handleFontFamilyChange)}
      {renderButtonGroup(t("lineSpacing"), ['1.0', '1.5', '2.0'], lineSpacing, handleLineSpacingChange)}
      
      <View style={styles.settingRow}>
        <Text style={styles.settingLabel}>{t("textZoom")}</Text>
        <View style={styles.sliderContainer}>
          <Slider
            style={styles.slider}
            minimumValue={50}
            maximumValue={200}
            step={10}
            value={textZoom}
            onValueChange={handleTextZoomChange}
            minimumTrackTintColor={accentColor}
            maximumTrackTintColor={colors.secondary}
            thumbTintColor={accentColor}
          />
          <Text style={styles.sliderValue}>{textZoom}%</Text>
        </View>
      </View>

      <View style={styles.settingRow}>
        <Text style={styles.settingLabel}>{t("accentColor")}</Text>
        <ColorPicker
          selectedColor={accentColor}
          onColorChange={handleAccentColorChange}
        />
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

const createStyles = (colors, fontSize, fontFamily, textZoom, accentColor) => {
  const zoomFactor = textZoom / 100;
  const baseFontSize = fontSize === 'small' ? 14 : fontSize === 'large' ? 18 : 16;
  const dynamicFontSize = baseFontSize * zoomFactor;

  return StyleSheet.create({
    container: {
      flex: 1,
      padding: 16 * zoomFactor,
      backgroundColor: colors.background,
    },
    sectionTitle: {
      fontSize: dynamicFontSize * 1.2,
      fontWeight: 'bold',
      color: accentColor,
      marginTop: 20 * zoomFactor,
      marginBottom: 10 * zoomFactor,
      fontFamily,
    },
    settingRow: {
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      paddingVertical: 12 * zoomFactor,
      borderBottomWidth: 1,
      borderBottomColor: colors.secondary,
    },
    settingLabel: {
      fontSize: dynamicFontSize,
      color: colors.text,
      fontFamily,
      marginBottom: 5 * zoomFactor,
    },
    buttonGroup: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'flex-start',
      marginTop: 5 * zoomFactor,
    },
    button: {
      paddingHorizontal: 12 * zoomFactor,
      paddingVertical: 6 * zoomFactor,
      marginRight: 8 * zoomFactor,
      marginBottom: 8 * zoomFactor,
      borderRadius: 4 * zoomFactor,
      backgroundColor: colors.secondary,
    },
    selectedButton: {
      backgroundColor: accentColor,
    },
    buttonText: {
      color: colors.text,
      fontSize: dynamicFontSize * 0.9,
      fontFamily,
    },
    selectedButtonText: {
      color: colors.background,
    },
    sliderContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      width: '100%',
    },
    slider: {
      flex: 1,
      height: 40 * zoomFactor,
    },
    sliderValue: {
      marginLeft: 10 * zoomFactor,
      fontSize: dynamicFontSize,
      color: colors.text,
      fontFamily,
    },
    timeInput: {
      borderWidth: 1,
      borderRadius: 4 * zoomFactor,
      padding: 8 * zoomFactor,
      fontSize: dynamicFontSize,
      fontFamily,
      minWidth: 80 * zoomFactor,
      borderColor: accentColor,
      color: colors.text,
    },
  });
};

export default withTheme(React.memo(SettingsScreen));