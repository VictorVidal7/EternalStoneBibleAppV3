import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NotesContext = createContext();

export const NotesProvider = ({ children }) => {
  const [notes, setNotes] = useState({});

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      const savedNotes = await AsyncStorage.getItem('notes');
      if (savedNotes !== null) {
        setNotes(JSON.parse(savedNotes));
      }
    } catch (error) {
      console.error('Error loading notes:', error);
    }
  };

  const saveNotes = async (newNotes) => {
    try {
      await AsyncStorage.setItem('notes', JSON.stringify(newNotes));
      setNotes(newNotes);
    } catch (error) {
      console.error('Error saving notes:', error);
    }
  };

  const addNote = (book, chapter, verse, content) => {
    const key = `${book}-${chapter}-${verse}`;
    const newNotes = { ...notes, [key]: content };
    saveNotes(newNotes);
  };

  const getNote = (book, chapter, verse) => {
    const key = `${book}-${chapter}-${verse}`;
    return notes[key] || '';
  };

  return (
    <NotesContext.Provider value={{ notes, addNote, getNote }}>
      {children}
    </NotesContext.Provider>
  );
};

export const useNotes = () => {
  const context = useContext(NotesContext);
  if (context === undefined) {
    throw new Error('useNotes must be used within a NotesProvider');
  }
  return context;
};