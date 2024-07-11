import React, { createContext, useContext } from 'react';

const ErrorContext = createContext();

export const ErrorProvider = ({ children, value }) => {
  return (
    <ErrorContext.Provider value={value}>
      {children}
    </ErrorContext.Provider>
  );
};

export const useError = () => {
  const context = useContext(ErrorContext);
  if (context === undefined) {
    throw new Error('useError must be used within an ErrorProvider');
  }
  return context;
};