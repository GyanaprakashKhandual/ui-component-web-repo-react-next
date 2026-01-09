'use client'
import React, { createContext, useContext } from 'react';

const DropdownContext = createContext(null);

export const DropdownProvider = ({ children }) => {
  return (
    <DropdownContext.Provider value={{}}>
      {children}
    </DropdownContext.Provider>
  );
};

export const useDropdown = () => {
  const context = useContext(DropdownContext);
  if (!context) {
    throw new Error('useDropdown must be used within DropdownProvider');
  }
  return context;
};