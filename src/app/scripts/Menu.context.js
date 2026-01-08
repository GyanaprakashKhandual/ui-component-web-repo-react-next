'use client'
import { createContext, useContext, useState } from 'react';

const ActionMenuContext = createContext(null);

export const useActionMenu = () => {
  const context = useContext(ActionMenuContext);
  if (!context) {
    throw new Error('useActionMenu must be used within ActionMenuProvider');
  }
  return context;
};

export const ActionMenuProvider = ({ children }) => {
  const [openMenuId, setOpenMenuId] = useState(null);

  const registerMenu = (id) => {
    return {
      isOpen: openMenuId === id,
      open: () => setOpenMenuId(id),
      close: () => setOpenMenuId(null),
      toggle: () => setOpenMenuId(openMenuId === id ? null : id),
    };
  };

  return (
    <ActionMenuContext.Provider value={{ registerMenu, openMenuId }}>
      {children}
    </ActionMenuContext.Provider>
  );
};