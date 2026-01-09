'use client';

import { createContext, useContext, useState, useCallback } from 'react';

const ActionMenuContext = createContext(undefined);

export const ActionMenuProvider = ({ children }) => {
  const [menuState, setMenuState] = useState({
    isOpen: false,
    position: { x: 0, y: 0 },
    targetElement: null,
    actions: [],
    preferredPosition: 'auto',
  });

  const openMenu = useCallback((config) => {
    const { x, y, targetElement, actions, position = 'auto' } = config;
    
    setMenuState({
      isOpen: true,
      position: { x, y },
      targetElement,
      actions,
      preferredPosition: position,
    });
  }, []);

  const closeMenu = useCallback(() => {
    setMenuState(prev => ({ ...prev, isOpen: false }));
  }, []);

  return (
    <ActionMenuContext.Provider value={{ menuState, openMenu, closeMenu }}>
      {children}
    </ActionMenuContext.Provider>
  );
};

export const useActionMenu = () => {
  const context = useContext(ActionMenuContext);
  if (!context) {
    throw new Error('useActionMenu must be used within ActionMenuProvider');
  }
  return context;
};