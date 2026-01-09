'use client';

import { useEffect, useRef, useState, cloneElement } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useActionMenu } from '@/app/scripts/Action.context';

const MENU_PADDING = 10;

const calculatePosition = (x, y, menuWidth, menuHeight, preferredPosition) => {
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  const positions = {
    top: { x: x - menuWidth / 2, y: y - menuHeight - MENU_PADDING },
    bottom: { x: x - menuWidth / 2, y: y + MENU_PADDING },
    left: { x: x - menuWidth - MENU_PADDING, y: y - menuHeight / 2 },
    right: { x: x + MENU_PADDING, y: y - menuHeight / 2 },
    'top-left': { x: x - menuWidth - MENU_PADDING, y: y - menuHeight - MENU_PADDING },
    'top-right': { x: x + MENU_PADDING, y: y - menuHeight - MENU_PADDING },
    'bottom-left': { x: x - menuWidth - MENU_PADDING, y: y + MENU_PADDING },
    'bottom-right': { x: x + MENU_PADDING, y: y + MENU_PADDING },
    'middle-left': { x: x - menuWidth - MENU_PADDING, y: y - menuHeight / 2 },
    'middle-right': { x: x + MENU_PADDING, y: y - menuHeight / 2 },
    center: { x: x - menuWidth / 2, y: y - menuHeight / 2 },
  };

  if (preferredPosition !== 'auto' && positions[preferredPosition]) {
    const pos = positions[preferredPosition];
    if (
      pos.x >= 0 &&
      pos.x + menuWidth <= viewportWidth &&
      pos.y >= 0 &&
      pos.y + menuHeight <= viewportHeight
    ) {
      return pos;
    }
  }

  // Auto-calculate best position
  const spaceTop = y;
  const spaceBottom = viewportHeight - y;
  const spaceLeft = x;
  const spaceRight = viewportWidth - x;

  let finalX = x;
  let finalY = y;

  // Determine vertical position
  if (spaceBottom >= menuHeight + MENU_PADDING) {
    finalY = y + MENU_PADDING;
  } else if (spaceTop >= menuHeight + MENU_PADDING) {
    finalY = y - menuHeight - MENU_PADDING;
  } else {
    finalY = Math.max(MENU_PADDING, Math.min(y - menuHeight / 2, viewportHeight - menuHeight - MENU_PADDING));
  }

  // Determine horizontal position
  if (spaceRight >= menuWidth + MENU_PADDING) {
    finalX = x + MENU_PADDING;
  } else if (spaceLeft >= menuWidth + MENU_PADDING) {
    finalX = x - menuWidth - MENU_PADDING;
  } else {
    finalX = Math.max(MENU_PADDING, Math.min(x - menuWidth / 2, viewportWidth - menuWidth - MENU_PADDING));
  }

  return { x: finalX, y: finalY };
};

// Main ActionMenu Component
export const ActionMenu = () => {
  const { menuState, closeMenu } = useActionMenu();
  const menuRef = useRef(null);
  const [calculatedPosition, setCalculatedPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (menuState.isOpen && menuRef.current) {
      const rect = menuRef.current.getBoundingClientRect();
      const pos = calculatePosition(
        menuState.position.x,
        menuState.position.y,
        rect.width,
        rect.height,
        menuState.preferredPosition
      );
      setCalculatedPosition(pos);
    }
  }, [menuState.isOpen, menuState.position, menuState.preferredPosition]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        closeMenu();
      }
    };

    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        closeMenu();
      }
    };

    if (menuState.isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [menuState.isOpen, closeMenu]);

  return (
    <AnimatePresence>
      {menuState.isOpen && (
        <motion.div
          ref={menuRef}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.15 }}
          className="fixed z-[9999] bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 min-w-[200px] max-w-[300px]"
          style={{
            left: `${calculatedPosition.x}px`,
            top: `${calculatedPosition.y}px`,
          }}
        >
          <div className="py-2">
            {menuState.actions.map((action, index) => (
              <motion.button
                key={index}
                whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  action.onClick?.();
                  closeMenu();
                }}
                disabled={action.disabled}
                className="w-full px-4 py-2.5 text-left flex items-center gap-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {action.icon && (
                  <span className="text-gray-500 dark:text-gray-400">
                    {action.icon}
                  </span>
                )}
                <span className="flex-1">{action.label}</span>
                {action.shortcut && (
                  <span className="text-xs text-gray-400 dark:text-gray-500">
                    {action.shortcut}
                  </span>
                )}
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// ActionMenuWrapper Component (integrated in same file)
export const ActionMenuWrapper = ({ 
  children, 
  actions, 
  position = 'auto',
  disabled = false 
}) => {
  const { openMenu } = useActionMenu();
  const elementRef = useRef(null);

  const handleDoubleClick = (e) => {
    if (disabled || !actions || actions.length === 0) return;

    e.preventDefault();
    e.stopPropagation();

    const x = e.clientX;
    const y = e.clientY;

    openMenu({
      x,
      y,
      targetElement: elementRef.current,
      actions,
      position,
    });
  };

  const handleClick = (e) => {
    if (disabled) return;
    
    // Pass through single clicks to the original element
    if (children.props.onClick) {
      children.props.onClick(e);
    }
  };

  return (
    <div
      ref={elementRef}
      onDoubleClick={handleDoubleClick}
      style={{
        userSelect: 'none',
        cursor: disabled ? 'default' : 'pointer',
        display: 'inline-block',
      }}
    >
      {cloneElement(children, {
        onClick: handleClick,
      })}
    </div>
  );
};