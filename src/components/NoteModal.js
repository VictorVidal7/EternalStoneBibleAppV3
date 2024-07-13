import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useUserPreferences } from '../context/UserPreferencesContext';
import { withTheme } from '../hoc/withTheme';

const NoteModal = ({ visible, onClose, verse, onSave, theme }) => {
  const [note, setNote] = useState('');
  const { fontSize, fontFamily } = useUserPreferences();
  const { colors } = theme;
  const styles = createStyles(colors, fontSize, fontFamily);

  useEffect(() => {
    if (verse && verse.note) {
      setNote(verse.note);
    } else {
      setNote('');
    }
  }, [verse]);

  const handleSave = () => {
    onSave(note);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>
            {verse ? `Nota para ${verse.book} ${verse.chapter}:${verse.number}` : 'Nueva Nota'}
          </Text>
          <TextInput
            style={styles.noteInput}
            multiline
            value={note}
            onChangeText={setNote}
            placeholder="Escribe tu nota aquí..."
            placeholderTextColor={colors.secondary}
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={onClose}>
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={handleSave}>
              <Text style={styles.buttonText}>Guardar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const createStyles = (colors, fontSize, fontFamily) => {
  const dynamicFontSize = fontSize === 'small' ? 14 : fontSize === 'large' ? 18 : 16;

  return StyleSheet.create({
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
      width: '80%',
      backgroundColor: colors.background,
      borderRadius: 10,
      padding: 20,
    },
    modalTitle: {
      fontSize: dynamicFontSize + 2,
      fontWeight: 'bold',
      marginBottom: 10,
      color: colors.text,
      fontFamily,
    },
    noteInput: {
      borderWidth: 1,
      borderColor: colors.secondary,
      borderRadius: 5,
      padding: 10,
      minHeight: 100,
      color: colors.text,
      fontFamily,
      fontSize: dynamicFontSize,
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 20,
    },
    button: {
      padding: 10,
      borderRadius: 5,
      width: '45%',
      alignItems: 'center',
    },
    saveButton: {
      backgroundColor: colors.primary,
    },
    buttonText: {
      color: colors.text,
      fontWeight: 'bold',
      fontFamily,
      fontSize: dynamicFontSize,
    },
  });
};

export default withTheme(NoteModal);