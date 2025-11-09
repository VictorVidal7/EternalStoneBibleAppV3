import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Linking,
} from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/hooks/useTheme';
import { useBibleVersion } from '../../src/hooks/useBibleVersion';
import { resetBibleData } from '../../src/lib/database/data-loader';
import * as Haptics from 'expo-haptics';

type ThemeOption = 'light' | 'dark' | 'auto';

export default function SettingsScreen() {
  const { mode, setThemeMode, isDark, colors } = useTheme();
  const { selectedVersion, setVersion, availableVersions } = useBibleVersion();
  const [isResetting, setIsResetting] = useState(false);

  async function handleThemeChange(newMode: ThemeOption) {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await setThemeMode(newMode);
  }

  async function handleResetData() {
    Alert.alert(
      'Resetear Datos',
      '¿Estás seguro de que quieres resetear todos los datos de la Biblia? La app se recargará automáticamente.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Resetear',
          style: 'destructive',
          onPress: async () => {
            setIsResetting(true);
            try {
              await resetBibleData();
              Alert.alert(
                'Datos Reseteados',
                'Por favor, cierra y vuelve a abrir la aplicación para recargar los datos.',
                [{ text: 'OK' }]
              );
            } catch (error) {
              Alert.alert('Error', 'Hubo un error al resetear los datos.');
            } finally {
              setIsResetting(false);
            }
          },
        },
      ]
    );
  }

  function handleOpenGitHub() {
    Linking.openURL('https://github.com/VictorVidal7/EternalStoneBibleAppV3');
  }

  const themedStyles = createThemedStyles(colors, isDark);

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Appearance Section */}
      <View style={themedStyles.section}>
        <View style={themedStyles.sectionHeader}>
          <Ionicons name="color-palette-outline" size={22} color={colors.primary} />
          <Text style={themedStyles.sectionTitle}>Apariencia</Text>
        </View>

        <View style={themedStyles.card}>
          <Text style={themedStyles.settingLabel}>Tema</Text>
          <Text style={themedStyles.settingDescription}>
            Elige el tema de la aplicación
          </Text>

          <View style={themedStyles.themeOptions}>
            <TouchableOpacity
              style={[
                themedStyles.themeOption,
                mode === 'light' && themedStyles.themeOptionActive,
              ]}
              onPress={() => handleThemeChange('light')}
            >
              <Ionicons
                name="sunny"
                size={24}
                color={mode === 'light' ? '#FFFFFF' : colors.text}
              />
              <Text
                style={[
                  themedStyles.themeOptionText,
                  mode === 'light' && themedStyles.themeOptionTextActive,
                ]}
              >
                Claro
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                themedStyles.themeOption,
                mode === 'dark' && themedStyles.themeOptionActive,
              ]}
              onPress={() => handleThemeChange('dark')}
            >
              <Ionicons
                name="moon"
                size={24}
                color={mode === 'dark' ? '#FFFFFF' : colors.text}
              />
              <Text
                style={[
                  themedStyles.themeOptionText,
                  mode === 'dark' && themedStyles.themeOptionTextActive,
                ]}
              >
                Oscuro
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                themedStyles.themeOption,
                mode === 'auto' && themedStyles.themeOptionActive,
              ]}
              onPress={() => handleThemeChange('auto')}
            >
              <Ionicons
                name="phone-portrait-outline"
                size={24}
                color={mode === 'auto' ? '#FFFFFF' : colors.text}
              />
              <Text
                style={[
                  themedStyles.themeOptionText,
                  mode === 'auto' && themedStyles.themeOptionTextActive,
                ]}
              >
                Auto
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Bible Version Section */}
      <View style={themedStyles.section}>
        <View style={themedStyles.sectionHeader}>
          <Ionicons name="book-outline" size={22} color={colors.primary} />
          <Text style={themedStyles.sectionTitle}>Versión de la Biblia</Text>
        </View>

        <View style={themedStyles.card}>
          <Text style={themedStyles.settingLabel}>Selecciona tu versión</Text>
          <Text style={themedStyles.settingDescription}>
            Elige la traducción de la Biblia que prefieres
          </Text>

          <View style={themedStyles.versionOptions}>
            {availableVersions.map((version) => (
              <TouchableOpacity
                key={version.id}
                style={[
                  themedStyles.versionOption,
                  selectedVersion.id === version.id && themedStyles.versionOptionActive,
                ]}
                onPress={async () => {
                  await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  await setVersion(version.id);
                }}
              >
                <View style={styles.versionOptionContent}>
                  <View style={styles.versionHeader}>
                    <Text
                      style={[
                        themedStyles.versionAbbr,
                        selectedVersion.id === version.id && themedStyles.versionAbbrActive,
                      ]}
                    >
                      {version.abbreviation}
                    </Text>
                    {selectedVersion.id === version.id && (
                      <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
                    )}
                  </View>
                  <Text
                    style={[
                      themedStyles.versionName,
                      selectedVersion.id === version.id && themedStyles.versionNameActive,
                    ]}
                  >
                    {version.name}
                  </Text>
                  <View style={styles.versionMeta}>
                    <Ionicons
                      name="language-outline"
                      size={12}
                      color={selectedVersion.id === version.id ? colors.primary : colors.textTertiary}
                    />
                    <Text
                      style={[
                        themedStyles.versionMetaText,
                        selectedVersion.id === version.id && themedStyles.versionMetaActive,
                      ]}
                    >
                      {version.language === 'es' ? 'Español' : 'English'}
                    </Text>
                    {version.year && (
                      <>
                        <Text style={themedStyles.versionMetaText}> • </Text>
                        <Text
                          style={[
                            themedStyles.versionMetaText,
                            selectedVersion.id === version.id && themedStyles.versionMetaActive,
                          ]}
                        >
                          {version.year}
                        </Text>
                      </>
                    )}
                  </View>
                  {version.id !== 'RVR1960' && (
                    <View style={themedStyles.comingSoonBadge}>
                      <Text style={themedStyles.comingSoonBadgeText}>Próximamente</Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      {/* Data Section */}
      <View style={themedStyles.section}>
        <View style={themedStyles.sectionHeader}>
          <Ionicons name="server-outline" size={22} color={colors.primary} />
          <Text style={themedStyles.sectionTitle}>Datos</Text>
        </View>

        <TouchableOpacity
          style={themedStyles.card}
          onPress={handleResetData}
          disabled={isResetting}
        >
          <View style={themedStyles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={[themedStyles.settingLabel, { color: colors.error }]}>
                {isResetting ? 'Reseteando...' : 'Resetear Datos de la Biblia'}
              </Text>
              <Text style={themedStyles.settingDescription}>
                Elimina y recarga todos los versículos
              </Text>
            </View>
            <Ionicons name="trash-outline" size={20} color={colors.error} />
          </View>
        </TouchableOpacity>
      </View>

      {/* About Section */}
      <View style={themedStyles.section}>
        <View style={themedStyles.sectionHeader}>
          <Ionicons name="information-circle-outline" size={22} color={colors.primary} />
          <Text style={themedStyles.sectionTitle}>Acerca de</Text>
        </View>

        <View style={themedStyles.card}>
          <View style={themedStyles.aboutRow}>
            <Text style={themedStyles.settingLabel}>Eternal Bible</Text>
            <Text style={themedStyles.settingValue}>v3.0.0</Text>
          </View>

          <View style={themedStyles.aboutRow}>
            <Text style={themedStyles.settingDescription}>
              Una aplicación de lectura de la Biblia diseñada para acercarte a la Palabra de Dios.
            </Text>
          </View>

          <TouchableOpacity style={themedStyles.linkButton} onPress={handleOpenGitHub}>
            <Ionicons name="logo-github" size={20} color={colors.primary} />
            <Text style={themedStyles.linkText}>Ver en GitHub</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Footer */}
      <View style={themedStyles.footer}>
        <Text style={themedStyles.footerText}>
          Hecho con ❤️ para la gloria de Dios
        </Text>
        <Text style={themedStyles.footerVerse}>
          "Toda la Escritura es inspirada por Dios"{'\n'}
          - 2 Timoteo 3:16
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  settingInfo: {
    flex: 1,
  },
  versionOptionContent: {
    flex: 1,
  },
  versionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  versionMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
});

function createThemedStyles(colors: any, isDark: boolean) {
  return StyleSheet.create({
    section: {
      marginTop: 24,
      paddingHorizontal: 16,
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
      paddingHorizontal: 4,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.text,
      marginLeft: 8,
    },
    card: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDark ? 0.3 : 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    settingRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    settingLabel: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 4,
    },
    settingValue: {
      fontSize: 15,
      color: colors.primary,
      fontWeight: '600',
    },
    settingDescription: {
      fontSize: 14,
      color: colors.textSecondary,
      marginTop: 4,
      lineHeight: 20,
    },
    themeOptions: {
      flexDirection: 'row',
      marginTop: 16,
      gap: 12,
    },
    themeOption: {
      flex: 1,
      alignItems: 'center',
      padding: 16,
      borderRadius: 12,
      backgroundColor: colors.surfaceVariant,
      borderWidth: 2,
      borderColor: colors.border,
    },
    themeOptionActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    themeOptionText: {
      fontSize: 13,
      fontWeight: '600',
      color: colors.text,
      marginTop: 8,
    },
    themeOptionTextActive: {
      color: '#FFFFFF',
    },
    comingSoon: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 12,
      padding: 12,
      backgroundColor: colors.warning + '15',
      borderRadius: 8,
    },
    comingSoonText: {
      fontSize: 13,
      color: colors.warning,
      marginLeft: 8,
      flex: 1,
      lineHeight: 18,
    },
    versionOptions: {
      marginTop: 16,
      gap: 12,
    },
    versionOption: {
      padding: 16,
      borderRadius: 12,
      backgroundColor: colors.surfaceVariant,
      borderWidth: 2,
      borderColor: colors.border,
    },
    versionOptionActive: {
      backgroundColor: colors.primaryLight,
      borderColor: colors.primary,
    },
    versionAbbr: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.text,
    },
    versionAbbrActive: {
      color: colors.primary,
    },
    versionName: {
      fontSize: 14,
      color: colors.textSecondary,
      marginTop: 4,
    },
    versionNameActive: {
      color: colors.text,
      fontWeight: '500',
    },
    versionMetaText: {
      fontSize: 12,
      color: colors.textTertiary,
      marginLeft: 4,
    },
    versionMetaActive: {
      color: colors.primary,
    },
    comingSoonBadge: {
      marginTop: 10,
      paddingVertical: 4,
      paddingHorizontal: 10,
      backgroundColor: colors.warning + '20',
      borderRadius: 6,
      alignSelf: 'flex-start',
    },
    comingSoonBadgeText: {
      fontSize: 11,
      fontWeight: '600',
      color: colors.warning,
    },
    aboutRow: {
      marginBottom: 12,
    },
    linkButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 12,
      padding: 12,
      backgroundColor: colors.primaryLight,
      borderRadius: 8,
    },
    linkText: {
      fontSize: 15,
      color: colors.primary,
      fontWeight: '600',
      marginLeft: 8,
    },
    footer: {
      alignItems: 'center',
      paddingVertical: 32,
      paddingHorizontal: 16,
    },
    footerText: {
      fontSize: 14,
      color: colors.textSecondary,
      textAlign: 'center',
      marginBottom: 16,
    },
    footerVerse: {
      fontSize: 13,
      color: colors.textTertiary,
      textAlign: 'center',
      fontStyle: 'italic',
      lineHeight: 20,
    },
  });
}
