import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useUserPreferences } from '../context/UserPreferencesContext';

const NoteModal = ({ visible, onClose, verse, onSave }) => {
  const [note, setNote] = useState('');
  const { nightMode, fontSize, fontFamily } = useUserPreferences();
  const styles = createStyles(nightMode, fontSize, fontFamily);

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
            placeholderTextColor={styles.placeholderColor}
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

const createStyles = (nightMode, fontSize, fontFamily) => {
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
      backgroundColor: nightMode ? '#2c2c2e' : 'white',
      borderRadius: 10,
      padding: 20,
    },
    modalTitle: {
      fontSize: dynamicFontSize + 2,
      fontWeight: 'bold',
      marginBottom: 10,
      color: nightMode ? '#fff' : '#333',
      fontFamily,
    },
    noteInput: {
      borderWidth: 1,
      borderColor: nightMode ? '#555' : '#ccc',
      borderRadius: 5,
      padding: 10,
      minHeight: 100,
      color: nightMode ? '#fff' : '#333',
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
      backgroundColor: nightMode ? '#0a84ff' : '#007AFF',
    },
    buttonText: {
      color: nightMode ? '#fff' : '#007AFF',
      fontWeight: 'bold',
      fontFamily,
      fontSize: dynamicFontSize,
    },
    placeholderColor: nightMode ? '#999' : '#999',
  });
};

export default NoteModal;