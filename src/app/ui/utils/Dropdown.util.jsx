'use client'
import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search } from 'lucide-react';

// Arrow Icons
const GoogleArrowDown = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
    <path d="M5 7l5 5 5-5z" fill="currentColor" />
  </svg>
);

// Utility: Get option value
const getValue = (option) => {
  if (typeof option === 'string') return option;
  return option?.value ?? option;
};

// Utility: Get option label
const getLabel = (option) => {
  if (typeof option === 'string') return option;
  return option?.label ?? option;
};

// Utility: Check if selected
const isSelected = (option, selected, multi) => {
  const val = getValue(option);
  if (multi) {
    return Array.isArray(selected) && selected.some(s => getValue(s) === val);
  }
  return getValue(selected) === val;
};

// Utility: Filter options
const filterOptions = (options, query) => {
  if (!query.trim()) return options;
  const lower = query.toLowerCase();
  return options.filter(opt => getLabel(opt).toLowerCase().includes(lower));
};

// Auto-position calculator
const useAutoPosition = (triggerRef, menuRef, isOpen, preferredPosition = 'bottom') => {
  const [position, setPosition] = useState(preferredPosition);

  useEffect(() => {
    if (!isOpen || !triggerRef.current || !menuRef.current) return;

    const calculate = () => {
      const trigger = triggerRef.current.getBoundingClientRect();
      const menu = menuRef.current.getBoundingClientRect();
      const viewport = {
        width: window.innerWidth,
        height: window.innerHeight
      };

      const spaceBelow = viewport.height - trigger.bottom;
      const spaceAbove = trigger.top;
      const menuHeight = menu.height || 300;

      let newPos = preferredPosition;

      if (preferredPosition === 'bottom' && spaceBelow < menuHeight && spaceAbove > spaceBelow) {
        newPos = 'top';
      } else if (preferredPosition === 'top' && spaceAbove < menuHeight && spaceBelow > spaceAbove) {
        newPos = 'bottom';
      }

      setPosition(newPos);
    };

    calculate();
    window.addEventListener('resize', calculate);
    window.addEventListener('scroll', calculate, true);

    return () => {
      window.removeEventListener('resize', calculate);
      window.removeEventListener('scroll', calculate, true);
    };
  }, [isOpen, preferredPosition, triggerRef, menuRef]);

  return position;
};

// Main Dropdown Component
const Dropdown = ({
  options = [],
  value = null,
  onChange = () => {},
  placeholder = 'Select option',
  mode = 'single',
  searchable = false,
  clearable = false,
  disabled = false,
  maxHeight = 320,
  className = '',
  dropdownClassName = '',
  optionClassName = '',
  label = '',
  error = '',
  required = false,
  position = 'bottom',
  theme = 'light',
  showDot = true,
  dotColor = 'blue',
  size = 'md'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [focusedIndex, setFocusedIndex] = useState(-1);

  const triggerRef = useRef(null);
  const menuRef = useRef(null);
  const searchRef = useRef(null);
  const optionsRef = useRef(null);

  const calculatedPosition = useAutoPosition(triggerRef, menuRef, isOpen, position);
  const filtered = filterOptions(options, search);

  const isMulti = mode === 'multi';
  const selected = isMulti ? (Array.isArray(value) ? value : []) : value;

  // Theme classes
  const isDark = theme === 'dark';
  const themeClasses = {
    trigger: isDark
      ? 'bg-gray-800 border-gray-700 text-gray-100 hover:border-gray-600'
      : 'bg-white border-gray-300 text-gray-900 hover:border-gray-400',
    triggerFocus: isDark
      ? 'border-blue-500 ring-blue-500/20'
      : 'border-blue-500 ring-blue-500/20',
    menu: isDark
      ? 'bg-gray-800 border-gray-700'
      : 'bg-white border-gray-200',
    search: isDark
      ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400'
      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500',
    option: isDark
      ? 'text-gray-100 hover:bg-gray-700'
      : 'text-gray-900 hover:bg-gray-50',
    optionSelected: isDark
      ? 'bg-gray-700 text-blue-400'
      : 'bg-blue-50 text-blue-600',
    chip: isDark
      ? 'bg-gray-700 text-gray-200'
      : 'bg-gray-100 text-gray-700',
    label: isDark ? 'text-gray-200' : 'text-gray-700',
    error: 'text-red-500',
    placeholder: isDark ? 'text-gray-500' : 'text-gray-500'
  };

  // Size classes
  const sizeClasses = {
    sm: { trigger: 'px-3 py-1.5 text-sm', option: 'px-3 py-2 text-sm', chip: 'px-2 py-0.5 text-xs' },
    md: { trigger: 'px-4 py-2.5 text-sm', option: 'px-4 py-2.5 text-sm', chip: 'px-2.5 py-1 text-sm' },
    lg: { trigger: 'px-5 py-3 text-base', option: 'px-5 py-3 text-base', chip: 'px-3 py-1.5 text-sm' }
  };

  const currentSize = sizeClasses[size] || sizeClasses.md;

  // Auto-focus search
  useEffect(() => {
    if (isOpen && searchable && searchRef.current) {
      setTimeout(() => searchRef.current?.focus(), 100);
    }
  }, [isOpen, searchable]);

  // Scroll focused option into view
  useEffect(() => {
    if (focusedIndex >= 0 && optionsRef.current) {
      const options = optionsRef.current.children;
      if (options[focusedIndex]) {
        options[focusedIndex].scrollIntoView({ block: 'nearest' });
      }
    }
  }, [focusedIndex]);

  // Handle selection
  const handleSelect = useCallback((option) => {
    if (isMulti) {
      const val = getValue(option);
      const isCurrentlySelected = selected.some(s => getValue(s) === val);
      const newValue = isCurrentlySelected
        ? selected.filter(s => getValue(s) !== val)
        : [...selected, option];
      onChange(newValue);
    } else {
      onChange(option);
      setIsOpen(false);
      setSearch('');
    }
  }, [isMulti, selected, onChange]);

  // Handle clear
  const handleClear = useCallback((e) => {
    e.stopPropagation();
    onChange(isMulti ? [] : null);
    setSearch('');
  }, [isMulti, onChange]);

  // Handle keyboard
  const handleKeyDown = useCallback((e) => {
    if (disabled) return;

    if (!isOpen) {
      if (['Enter', ' ', 'ArrowDown'].includes(e.key)) {
        e.preventDefault();
        setIsOpen(true);
        setFocusedIndex(0);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex(prev => Math.min(prev + 1, filtered.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex(prev => Math.max(prev - 1, 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (focusedIndex >= 0 && filtered[focusedIndex]) {
          handleSelect(filtered[focusedIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        setSearch('');
        triggerRef.current?.focus();
        break;
      case 'Tab':
        setIsOpen(false);
        setSearch('');
        break;
    }
  }, [isOpen, filtered, focusedIndex, handleSelect, disabled]);

  // Click outside
  useEffect(() => {
    if (!isOpen) return;

    const handleClick = (e) => {
      if (triggerRef.current && !triggerRef.current.contains(e.target) &&
          menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
        setSearch('');
      }
    };

    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [isOpen]);

  // Display text
  const getDisplayText = () => {
    if (isMulti) {
      return Array.isArray(selected) && selected.length > 0
        ? `${selected.length} selected`
        : placeholder;
    }
    return selected ? getLabel(selected) : placeholder;
  };

  const hasValue = isMulti ? (Array.isArray(selected) && selected.length > 0) : selected !== null;

  return (
    <div className={`relative w-full ${className}`}>
      {label && (
        <label className={`block text-sm font-medium mb-1.5 ${themeClasses.label}`}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Trigger */}
      <div
        ref={triggerRef}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        tabIndex={disabled ? -1 : 0}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        className={`
          flex items-center justify-between rounded-lg border transition-all cursor-pointer
          ${currentSize.trigger}
          ${themeClasses.trigger}
          ${isOpen ? `ring-2 ${themeClasses.triggerFocus}` : ''}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          ${error ? 'border-red-500' : ''}
        `}
      >
        <div className="flex items-center gap-2 flex-1 flex-wrap min-w-0">
          {isMulti && Array.isArray(selected) && selected.length > 0 ? (
            selected.map((item, idx) => (
              <motion.span
                key={idx}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                className={`
                  inline-flex items-center gap-1.5 rounded-md font-medium
                  ${currentSize.chip} ${themeClasses.chip}
                `}
              >
                {getLabel(item)}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelect(item);
                  }}
                  className="hover:opacity-70 transition-opacity"
                  aria-label="Remove"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </motion.span>
            ))
          ) : (
            <span className={hasValue ? '' : themeClasses.placeholder}>
              {getDisplayText()}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 ml-2 flex-shrink-0">
          {clearable && hasValue && !disabled && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleClear}
              className="p-1 rounded hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
              aria-label="Clear"
            >
              <X className="w-4 h-4 opacity-60" />
            </motion.button>
          )}
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="opacity-60"
          >
            <GoogleArrowDown />
          </motion.div>
        </div>
      </div>

      {error && <p className={`text-xs mt-1 ${themeClasses.error}`}>{error}</p>}

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={menuRef}
            initial={{ opacity: 0, scale: 0.95, y: calculatedPosition === 'top' ? 10 : -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: calculatedPosition === 'top' ? 10 : -10 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className={`
              absolute z-50 rounded-lg border shadow-xl
              ${calculatedPosition === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'}
              w-full min-w-[200px]
              ${themeClasses.menu}
              ${dropdownClassName}
            `}
          >
            {searchable && (
              <div className="p-2 border-b border-inherit">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 opacity-40" />
                  <input
                    ref={searchRef}
                    type="text"
                    placeholder="Search..."
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setFocusedIndex(0);
                    }}
                    onKeyDown={handleKeyDown}
                    className={`
                      w-full pl-9 pr-3 py-2 rounded-md border text-sm
                      focus:outline-none focus:ring-2 focus:ring-blue-500/40
                      ${themeClasses.search}
                    `}
                  />
                </div>
              </div>
            )}

            <div
              ref={optionsRef}
              role="listbox"
              className="overflow-y-auto py-1"
              style={{ maxHeight: `${maxHeight}px` }}
            >
              {filtered.length > 0 ? (
                filtered.map((option, idx) => {
                  const optSelected = isSelected(option, selected, isMulti);
                  const isFocused = idx === focusedIndex;
                  const dotColorClass = {
                    blue: 'bg-blue-500',
                    green: 'bg-green-500',
                    red: 'bg-red-500',
                    purple: 'bg-purple-500',
                    orange: 'bg-orange-500',
                    gray: 'bg-gray-500'
                  }[dotColor] || 'bg-blue-500';

                  return (
                    <motion.div
                      key={idx}
                      role="option"
                      aria-selected={optSelected}
                      onClick={() => handleSelect(option)}
                      onMouseEnter={() => setFocusedIndex(idx)}
                      whileHover={{ x: 2 }}
                      className={`
                        flex items-center gap-3 cursor-pointer transition-colors
                        ${currentSize.option}
                        ${isFocused ? (isDark ? 'bg-gray-700' : 'bg-gray-100') : ''}
                        ${optSelected ? themeClasses.optionSelected : themeClasses.option}
                        ${optionClassName}
                      `}
                    >
                      {showDot && (
                        <div className="flex-shrink-0">
                          {optSelected ? (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className={`w-2 h-2 rounded-full ${dotColorClass}`}
                            />
                          ) : (
                            <div className="w-2 h-2" />
                          )}
                        </div>
                      )}
                      <span className="flex-1 truncate font-medium">
                        {getLabel(option)}
                      </span>
                    </motion.div>
                  );
                })
              ) : (
                <div className={`${currentSize.option} text-center opacity-50`}>
                  No options found
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Demo
export default function Demo() {
  const [single, setSingle] = useState(null);
  const [multi, setMulti] = useState([]);
  const [theme, setTheme] = useState('light');

  const options = [
    'JavaScript',
    'TypeScript',
    'Python',
    'Java',
    'C++',
    'Ruby',
    'Go',
    'Rust',
    'Swift',
    'Kotlin'
  ];

  return (
    <div className={`min-h-screen p-8 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Modern Dropdown Component
          </h1>
          <button
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors
              ${theme === 'dark' 
                ? 'bg-gray-800 text-white hover:bg-gray-700' 
                : 'bg-white text-gray-900 hover:bg-gray-100'
              }`}
          >
            Toggle {theme === 'light' ? 'Dark' : 'Light'}
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className={`p-6 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
            <Dropdown
              label="Single Select"
              placeholder="Choose a language"
              options={options}
              value={single}
              onChange={setSingle}
              searchable
              clearable
              theme={theme}
              size="md"
            />
          </div>

          <div className={`p-6 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
            <Dropdown
              label="Multi Select"
              placeholder="Choose languages"
              options={options}
              value={multi}
              onChange={setMulti}
              mode="multi"
              searchable
              clearable
              theme={theme}
              dotColor="green"
            />
          </div>

          <div className={`p-6 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
            <Dropdown
              label="With Error"
              placeholder="Select option"
              options={options}
              value={null}
              onChange={() => {}}
              error="This field is required"
              required
              theme={theme}
            />
          </div>

          <div className={`p-6 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
            <Dropdown
              label="Disabled"
              placeholder="Cannot select"
              options={options}
              value={null}
              onChange={() => {}}
              disabled
              theme={theme}
            />
          </div>
        </div>

        <div className={`p-6 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
          <h2 className={`text-xl font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Features
          </h2>
          <ul className={`space-y-2 text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            <li>✓ Single & Multi-select modes</li>
            <li>✓ Searchable with keyboard navigation</li>
            <li>✓ Auto-positioning (top/bottom)</li>
            <li>✓ Dark theme support</li>
            <li>✓ Smooth Framer Motion animations</li>
            <li>✓ GitHub-inspired design</li>
            <li>✓ Fully customizable</li>
            <li>✓ Accessible (ARIA attributes)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}