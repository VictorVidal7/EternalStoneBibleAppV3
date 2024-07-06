import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BookmarksContext = createContext();

export const BookmarksProvider = ({ children }) => {
  const [bookmarks, setBookmarks] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    loadBookmarks();
  }, []);

  const loadBookmarks = useCallback(async () => {
    try {
      const savedBookmarks = await AsyncStorage.getItem('bookmarks');
      if (savedBookmarks !== null) {
        setBookmarks(JSON.parse(savedBookmarks));
      }
      setIsLoaded(true);
    } catch (error) {
      console.error('Error al cargar marcadores:', error);
      setIsLoaded(true);
    }
  }, []);

  const saveBookmarks = useCallback(async (newBookmarks) => {
    try {
      await AsyncStorage.setItem('bookmarks', JSON.stringify(newBookmarks));
      setBookmarks(newBookmarks);
    } catch (error) {
      console.error('Error al guardar marcadores:', error);
    }
  }, []);

  const addBookmark = useCallback((book, chapter, verse) => {
    const newBookmark = { book, chapter, verse };
    setBookmarks(prevBookmarks => {
      const updatedBookmarks = [...prevBookmarks, newBookmark];
      saveBookmarks(updatedBookmarks);
      return updatedBookmarks;
    });
  }, [saveBookmarks]);

  const removeBookmark = useCallback((book, chapter, verse) => {
    setBookmarks(prevBookmarks => {
      const updatedBookmarks = prevBookmarks.filter(
        b => !(b.book === book && b.chapter === chapter && b.verse === verse)
      );
      saveBookmarks(updatedBookmarks);
      return updatedBookmarks;
    });
  }, [saveBookmarks]);

  const value = {
    bookmarks,
    addBookmark,
    removeBookmark,
    isLoaded,
  };

  return (
    <BookmarksContext.Provider value={value}>
      {children}
    </BookmarksContext.Provider>
  );
};

export const useBookmarks = () => {
  const context = useContext(BookmarksContext);
  if (context === undefined) {
    throw new Error('useBookmarks debe ser usado dentro de un BookmarksProvider');
  }
  return context;
};