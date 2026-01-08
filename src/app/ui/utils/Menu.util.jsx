'use client'
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MoreVertical } from "lucide-react";

export const calculateOptimalPosition = (
  triggerRect,
  menuRect,
  preferredPosition
) => {
  const viewport = {
    width: window.innerWidth,
    height: window.innerHeight,
  };

  const spacing = 8;
  const menuPadding = 8;

  const spaces = {
    top: triggerRect.top,
    bottom: viewport.height - triggerRect.bottom,
    left: triggerRect.left,
    right: viewport.width - triggerRect.right,
  };

  const fitsInPreferred = checkPositionFit(
    preferredPosition,
    triggerRect,
    menuRect,
    spaces,
    spacing,
    menuPadding
  );

  if (fitsInPreferred) {
    return preferredPosition;
  }

  return findBestPosition(triggerRect, menuRect, spaces, spacing, menuPadding);
};

const checkPositionFit = (
  position,
  triggerRect,
  menuRect,
  spaces,
  spacing,
  menuPadding
) => {
  const parts = position.split("-");
  const primary = parts[0];
  const secondary = parts[1];

  if (primary === "top" && spaces.top < menuRect.height + menuPadding + spacing)
    return false;
  if (
    primary === "bottom" &&
    spaces.bottom < menuRect.height + menuPadding + spacing
  )
    return false;
  if (
    primary === "left" &&
    spaces.left < menuRect.width + menuPadding + spacing
  )
    return false;
  if (
    primary === "right" &&
    spaces.right < menuRect.width + menuPadding + spacing
  )
    return false;

  if (secondary === "left" && spaces.left < menuRect.width + spacing)
    return false;
  if (secondary === "right" && spaces.right < menuRect.width + spacing)
    return false;
  if (secondary === "top" && spaces.top < menuRect.height + spacing)
    return false;
  if (secondary === "bottom" && spaces.bottom < menuRect.height + spacing)
    return false;

  return true;
};

const findBestPosition = (
  triggerRect,
  menuRect,
  spaces,
  spacing,
  menuPadding
) => {
  const positions = [
    { name: "bottom", score: spaces.bottom, vertical: true },
    { name: "top", score: spaces.top, vertical: true },
    { name: "right", score: spaces.right, vertical: false },
    { name: "left", score: spaces.left, vertical: false },
  ];

  positions.sort((a, b) => b.score - a.score);

  for (const pos of positions) {
    const requiredSpace = pos.vertical ? menuRect.height : menuRect.width;
    if (pos.score >= requiredSpace + menuPadding + spacing) {
      if (pos.vertical) {
        if (spaces.left > spaces.right && spaces.left >= menuRect.width) {
          return `${pos.name}-left`;
        } else if (spaces.right >= menuRect.width) {
          return `${pos.name}-right`;
        }
      } else {
        if (spaces.top > spaces.bottom && spaces.top >= menuRect.height) {
          return `${pos.name}-top`;
        } else if (spaces.bottom >= menuRect.height) {
          return `${pos.name}-bottom`;
        }
      }
      return pos.name;
    }
  }

  return positions[0].name;
};

export const getPositionClasses = (position) => {
  const positionMap = {
    top: "bottom-full mb-2 left-1/2 -translate-x-1/2",
    bottom: "top-full mt-2 left-1/2 -translate-x-1/2",
    left: "right-full mr-2 top-1/2 -translate-y-1/2",
    right: "left-full ml-2 top-1/2 -translate-y-1/2",
    "top-left": "bottom-full mb-2 right-0",
    "top-right": "bottom-full mb-2 left-0",
    "bottom-left": "top-full mt-2 right-0",
    "bottom-right": "top-full mt-2 left-0",
    "left-top": "right-full mr-2 bottom-0",
    "left-bottom": "right-full mr-2 top-0",
    "right-top": "left-full ml-2 bottom-0",
    "right-bottom": "left-full ml-2 top-0",
  };

  return positionMap[position] || positionMap.bottom;
};

const ActionMenu = ({
  items = [],
  position = "bottom",
  trigger = "click",
  icon: TriggerIcon = MoreVertical,
  showArrow = false,
  maxWidth = 200,
  className = "",
  id = Math.random().toString(36).substr(2, 9),
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [calculatedPosition, setCalculatedPosition] = useState(position);
  const triggerRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    if (isOpen && triggerRef.current && menuRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const menuRect = menuRef.current.getBoundingClientRect();

      const optimalPosition = calculateOptimalPosition(
        triggerRect,
        menuRect,
        position
      );
      setCalculatedPosition(optimalPosition);
    }
  }, [isOpen, position]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        triggerRef.current &&
        !triggerRef.current.contains(e.target) &&
        menuRef.current &&
        !menuRef.current.contains(e.target)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  const handleItemClick = (callback) => {
    callback?.();
    setIsOpen(false);
  };

  const animationVariants = {
    hidden: { opacity: 0, scale: 0.95, y: -5 },
    visible: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.95, y: -5 },
  };

  return (
    <div className={`relative inline-block ${className}`}>
      <motion.button
        ref={triggerRef}
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={trigger === "hover" ? () => setIsOpen(true) : undefined}
        onMouseLeave={trigger === "hover" ? () => setIsOpen(false) : undefined}
        className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-700 hover:text-gray-900"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Open menu"
        aria-expanded={isOpen}
      >
        <TriggerIcon className="w-5 h-5" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={menuRef}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={animationVariants}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className={`
              absolute z-50 bg-white rounded-lg shadow-lg border border-gray-200
              ${getPositionClasses(calculatedPosition)}
              min-w-[200px] overflow-hidden
            `}
            style={{ maxWidth: maxWidth }}
          >
            {items.map((item, idx) => (
              <div key={idx}>
                {item.type === "separator" ? (
                  <div className="h-px bg-gray-200 my-1" />
                ) : item.type === "label" ? (
                  <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide bg-gray-50">
                    {item.label}
                  </div>
                ) : (
                  <motion.button
                    onClick={() => handleItemClick(item.onClick)}
                    className={`
                      w-full flex items-center gap-3 px-4 py-2.5 text-sm
                      transition-colors
                      ${
                        item.variant === "danger"
                          ? "text-red-600 hover:bg-red-50"
                          : item.variant === "success"
                          ? "text-green-600 hover:bg-green-50"
                          : "text-gray-700 hover:bg-gray-100"
                      }
                      ${
                        item.disabled
                          ? "opacity-50 cursor-not-allowed"
                          : "cursor-pointer"
                      }
                    `}
                    disabled={item.disabled}
                    whileHover={!item.disabled ? { x: 2 } : {}}
                  >
                    {item.icon && (
                      <item.icon className="w-4 h-4 flex-shrink-0" />
                    )}
                    <span className="flex-1 text-left font-medium">
                      {item.label}
                    </span>
                    {item.badge && (
                      <span className="ml-2 px-2 py-0.5 text-xs font-semibold bg-blue-100 text-blue-700 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </motion.button>
                )}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ActionMenu;
