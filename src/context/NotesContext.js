import React, { createContext, useState, useContext } from 'react';

const NotesContext = createContext();

export const NotesProvider = ({ children }) => {
  const [notes, setNotes] = useState({});

  const addNote = (book, chapter, verse, content) => {
    setNotes(prevNotes => ({
      ...prevNotes,
      [`${book}-${chapter}-${verse}`]: content
    }));
  };

  const getNote = (book, chapter, verse) => {
    return notes[`${book}-${chapter}-${verse}`] || '';
  };

  return (
    <NotesContext.Provider value={{ notes, addNote, getNote }}>
      {children}
    </NotesContext.Provider>
  );
};

export const useNotes = () => useContext(NotesContext);