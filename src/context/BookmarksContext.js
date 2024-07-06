import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BookmarksContext = createContext();

export const BookmarksProvider = ({ children }) => {
  console.log('BookmarksProvider iniciado');
  const [bookmarks, setBookmarks] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    loadBookmarks();
  }, []);

  const loadBookmarks = async () => {
    try {
      console.log('Cargando marcadores...');
      const savedBookmarks = await AsyncStorage.getItem('bookmarks');
      if (savedBookmarks !== null) {
        setBookmarks(JSON.parse(savedBookmarks));
      }
      console.log('Marcadores cargados:', bookmarks);
      setIsLoaded(true);
    } catch (error) {
      console.error('Error al cargar marcadores:', error);
      setIsLoaded(true);
    }
  };

  const saveBookmarks = async (newBookmarks) => {
    try {
      await AsyncStorage.setItem('bookmarks', JSON.stringify(newBookmarks));
      setBookmarks(newBookmarks);
    } catch (error) {
      console.error('Error al guardar marcadores:', error);
    }
  };

  const addBookmark = (book, chapter, verse) => {
    const newBookmark = { book, chapter, verse };
    const newBookmarks = [...bookmarks, newBookmark];
    saveBookmarks(newBookmarks);
  };

  const removeBookmark = (book, chapter, verse) => {
    const newBookmarks = bookmarks.filter(
      b => !(b.book === book && b.chapter === chapter && b.verse === verse)
    );
    saveBookmarks(newBookmarks);
  };

  console.log('BookmarksProvider renderizando');

  return (
    <BookmarksContext.Provider
      value={{
        bookmarks,
        addBookmark,
        removeBookmark,
        isLoaded,
      }}
    >
      {children}
    </BookmarksContext.Provider>
  );
};

export const useBookmarks = () => {
  const context = useContext(BookmarksContext);
  if (context === undefined) {
    console.error('useBookmarks debe ser usado dentro de un BookmarksProvider');
    return { bookmarks: [], addBookmark: () => {}, removeBookmark: () => {}, isLoaded: true };
  }
  return context;
};