import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import CustomIcon from './CustomIcon';

const ListItem = ({ title, subtitle, onPress, iconName, rightIconName, theme }) => {
  // Memoize styles to avoid recreation on every render
  const styles = useMemo(() => StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      backgroundColor: theme.colors.card,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    iconContainer: {
      marginRight: 16,
    },
    textContainer: {
      flex: 1,
    },
    title: {
      fontSize: 16,
      fontWeight: 'bold',
      color: theme.colors.text,
    },
    subtitle: {
      fontSize: 14,
      color: theme.colors.secondary,
      marginTop: 4,
    },
  }), [theme.colors.card, theme.colors.border, theme.colors.text, theme.colors.secondary]);

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.iconContainer}>
        <CustomIcon name={iconName} size={24} color={theme.colors.primary} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
      <CustomIcon name={rightIconName || 'chevron-right'} size={24} color={theme.colors.secondary} />
    </TouchableOpacity>
  );
};

// Optimize re-renders with React.memo
export default React.memo(ListItem);