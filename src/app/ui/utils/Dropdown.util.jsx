'use client'
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, X, Search, Check } from 'lucide-react';

const Dropdown = ({
  options = [],
  value = [],
  onChange = () => {},
  placeholder = 'Select option',
  mode = 'single', // 'single' or 'multi'
  searchable = true,
  clearable = true,
  disabled = false,
  maxHeight = 300,
  className = '',
  label = '',
  helperText = '',
  required = false,
  position = 'bottom'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [calculatedPosition, setCalculatedPosition] = useState(position);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  
  const containerRef = useRef(null);
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);
  const optionsContainerRef = useRef(null);

  const selectedValue = mode === 'single' ? (Array.isArray(value) ? value[0] : value) : (Array.isArray(value) ? value : []);

  // Filter options based on search
  const filteredOptions = options.filter(opt => {
    const optLabel = typeof opt === 'string' ? opt : opt.label || opt;
    return String(optLabel).toLowerCase().includes(searchText.toLowerCase());
  });

  // Auto-positioning logic (same as DateTimePicker & ActionMenu)
  useEffect(() => {
    if (isOpen && containerRef.current && dropdownRef.current) {
      const trigger = containerRef.current.getBoundingClientRect();
      const dropdown = dropdownRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;

      const spaceBelow = viewportHeight - trigger.bottom;
      const spaceAbove = trigger.top;
      const spaceRight = viewportWidth - trigger.right;
      const spaceLeft = trigger.left;

      let newPosition = position;

      // Vertical positioning
      if (position === 'top' || position === 'top-left' || position === 'top-right') {
        if (spaceAbove < 60 && spaceBelow > spaceAbove) {
          newPosition = position === 'top' ? 'bottom' : position === 'top-left' ? 'bottom-left' : 'bottom-right';
        }
      } else if (position === 'bottom' || position === 'bottom-left' || position === 'bottom-right') {
        if (spaceBelow < 60 && spaceAbove > spaceBelow) {
          newPosition = position === 'bottom' ? 'top' : position === 'bottom-left' ? 'top-left' : position === 'bottom-right' ? 'top-right' : 'top';
        }
      }

      // Horizontal positioning
      if (newPosition.includes('left')) {
        if (spaceLeft < dropdown.width && spaceRight > spaceLeft) {
          newPosition = newPosition.replace('left', 'right');
        }
      } else if (newPosition.includes('right')) {
        if (spaceRight < dropdown.width && spaceLeft > spaceRight) {
          newPosition = newPosition.replace('right', 'left');
        }
      }

      setCalculatedPosition(newPosition);
    }
  }, [isOpen, position]);

  // Auto-focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
  }, [isOpen, searchable]);

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault();
        setIsOpen(true);
        setHighlightedIndex(0);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex((prev) => 
          prev < filteredOptions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (filteredOptions[highlightedIndex]) {
          handleSelectOption(filteredOptions[highlightedIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        setSearchText('');
        break;
      case 'Tab':
        setIsOpen(false);
        setSearchText('');
        break;
      default:
        break;
    }
  };

  // Handle option selection
  const handleSelectOption = (option) => {
    if (mode === 'single') {
      onChange(option);
      setIsOpen(false);
      setSearchText('');
    } else {
      const optionValue = typeof option === 'string' ? option : option.value || option;
      const newValue = Array.isArray(selectedValue) ? [...selectedValue] : [];
      
      if (newValue.some(v => (typeof v === 'string' ? v : v.value || v) === optionValue)) {
        const filtered = newValue.filter(v => (typeof v === 'string' ? v : v.value || v) !== optionValue);
        onChange(filtered);
      } else {
        onChange([...newValue, option]);
      }
    }
  };

  // Handle clear
  const handleClear = (e) => {
    e.stopPropagation();
    onChange(mode === 'single' ? null : []);
    setSearchText('');
  };

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
        setSearchText('');
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Check if option is selected
  const isOptionSelected = (option) => {
    const optionValue = typeof option === 'string' ? option : option.value || option;
    if (mode === 'single') {
      return selectedValue === optionValue;
    } else {
      return Array.isArray(selectedValue) && 
        selectedValue.some(v => (typeof v === 'string' ? v : v.value || v) === optionValue);
    }
  };

  // Get display text
  const getDisplayText = () => {
    if (mode === 'single') {
      if (!selectedValue) return placeholder;
      return typeof selectedValue === 'string' ? selectedValue : selectedValue.label || selectedValue;
    } else {
      if (!Array.isArray(selectedValue) || selectedValue.length === 0) return placeholder;
      return `${selectedValue.length} selected`;
    }
  };

  const positionClasses = {
    top: 'bottom-full mb-2 left-0 right-0',
    bottom: 'top-full mt-2 left-0 right-0',
    'top-left': 'bottom-full mb-2 right-0',
    'top-right': 'bottom-full mb-2 left-0',
    'bottom-left': 'top-full mt-2 right-0',
    'bottom-right': 'top-full mt-2 left-0',
  };

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-900 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Dropdown Trigger */}
      <motion.div
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`
          flex items-center justify-between px-4 py-3
          bg-white border border-gray-300 rounded-lg cursor-pointer
          transition-all
          ${disabled ? 'bg-gray-100 cursor-not-allowed opacity-60' : 'hover:border-gray-400'}
          ${isOpen ? 'border-blue-500 ring-2 ring-blue-200' : ''}
        `}
      >
        <div className="flex items-center gap-2 flex-1 flex-wrap">
          {mode === 'multi' && Array.isArray(selectedValue) && selectedValue.length > 0 ? (
            selectedValue.map((item, idx) => {
              const label = typeof item === 'string' ? item : item.label || item;
              return (
                <motion.span
                  key={idx}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium flex items-center gap-2"
                >
                  {label}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectOption(item);
                    }}
                    className="hover:text-blue-900"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </motion.span>
              );
            })
          ) : (
            <span className={selectedValue ? 'text-gray-900' : 'text-gray-500'}>
              {getDisplayText()}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 ml-2">
          {(mode === 'single' ? selectedValue : Array.isArray(selectedValue) && selectedValue.length > 0) && 
            clearable && !disabled && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              onClick={handleClear}
              className="p-1 hover:bg-gray-200 rounded transition-colors"
            >
              <X className="w-4 h-4 text-gray-600" />
            </motion.button>
          )}
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="w-5 h-5 text-gray-600" />
          </motion.div>
        </div>
      </motion.div>

      {helperText && (
        <p className="text-xs text-gray-600 mt-1">{helperText}</p>
      )}

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={dropdownRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className={`
              absolute z-50 bg-white rounded-lg shadow-lg border border-gray-200
              ${positionClasses[calculatedPosition] || positionClasses.bottom}
              w-full
            `}
            onKeyDown={handleKeyDown}
          >
            {/* Search Input */}
            {searchable && (
              <div className="p-3 border-b border-gray-200">
                <div className="relative">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search options..."
                    value={searchText}
                    onChange={(e) => {
                      setSearchText(e.target.value);
                      setHighlightedIndex(0);
                    }}
                    onKeyDown={handleKeyDown}
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm
                      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            )}

            {/* Options List */}
            <div
              ref={optionsContainerRef}
              className="overflow-y-auto"
              style={{ maxHeight: `${maxHeight}px` }}
            >
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option, idx) => {
                  const optLabel = typeof option === 'string' ? option : option.label || option;
                  const isSelected = isOptionSelected(option);
                  const isHighlighted = idx === highlightedIndex;

                  return (
                    <motion.button
                      key={idx}
                      onClick={() => handleSelectOption(option)}
                      onMouseEnter={() => setHighlightedIndex(idx)}
                      whileHover={{ backgroundColor: '#f3f4f6' }}
                      className={`
                        w-full flex items-center gap-3 px-4 py-3 text-sm text-left transition-colors
                        ${isHighlighted ? 'bg-blue-50' : ''}
                        ${isSelected ? 'bg-blue-100 text-blue-700 font-medium' : 'text-gray-900'}
                      `}
                    >
                      <div className={`
                        w-5 h-5 rounded border-2 flex items-center justify-center transition-all
                        ${isSelected 
                          ? 'bg-blue-600 border-blue-600' 
                          : 'border-gray-300 hover:border-blue-500'
                        }
                      `}>
                        {isSelected && <Check className="w-3 h-3 text-white" />}
                      </div>
                      <span className="flex-1">{optLabel}</span>
                    </motion.button>
                  );
                })
              ) : (
                <div className="px-4 py-8 text-center text-gray-500 text-sm">
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

const Demo = () => {
  const [singleValue, setSingleValue] = useState(null);
  const [multiValue, setMultiValue] = useState([]);
  const [singleValue2, setSingleValue2] = useState(null);
  const [multiValue2, setMultiValue2] = useState([]);
  const [singleValue3, setSingleValue3] = useState(null);
  const [multiValue3, setMultiValue3] = useState([]);

  const basicOptions = [
    'JavaScript',
    'Python',
    'React',
    'Vue',
    'Angular',
    'Node.js',
    'TypeScript',
    'Java',
    'C++',
    'Go'
  ];

  const countryOptions = [
    { label: 'United States', value: 'us' },
    { label: 'United Kingdom', value: 'uk' },
    { label: 'Canada', value: 'ca' },
    { label: 'Australia', value: 'au' },
    { label: 'Germany', value: 'de' },
    { label: 'France', value: 'fr' },
    { label: 'Japan', value: 'jp' },
    { label: 'India', value: 'in' },
    { label: 'Brazil', value: 'br' },
    { label: 'Mexico', value: 'mx' }
  ];

  const statusOptions = [
    'Active',
    'Inactive',
    'Pending',
    'Archived',
    'Deleted',
    'Suspended',
    'On Hold',
    'Waiting'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Smart Dropdown Select</h1>
          <p className="text-gray-600 text-lg">Single & Multi-Select with Search, Auto-Positioning & Full Keyboard Navigation</p>
        </div>

        {/* Single Select Examples */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Single Select Dropdown</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <Dropdown
                label="Programming Language"
                options={basicOptions}
                value={singleValue}
                onChange={setSingleValue}
                placeholder="Select a language"
                mode="single"
                searchable={true}
                required={true}
                helperText="Choose your preferred programming language"
              />
              <div className="mt-4 p-4 bg-gray-50 rounded text-sm">
                <p className="text-gray-600"><span className="font-semibold">Selected:</span> {singleValue || 'None'}</p>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <Dropdown
                label="Country"
                options={countryOptions}
                value={singleValue2}
                onChange={setSingleValue2}
                placeholder="Select a country"
                mode="single"
                searchable={true}
                helperText="Search and select your country"
              />
              <div className="mt-4 p-4 bg-gray-50 rounded text-sm">
                <p className="text-gray-600">
                  <span className="font-semibold">Selected:</span> {
                    singleValue2 ? (typeof singleValue2 === 'string' ? singleValue2 : singleValue2.label) : 'None'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Multi Select Examples */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Multi-Select Dropdown</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <Dropdown
                label="Skills"
                options={basicOptions}
                value={multiValue}
                onChange={setMultiValue}
                placeholder="Select skills"
                mode="multi"
                searchable={true}
                helperText="Select one or more skills"
              />
              <div className="mt-4 p-4 bg-gray-50 rounded text-sm">
                <p className="text-gray-600"><span className="font-semibold">Selected ({multiValue.length}):</span></p>
                <p className="text-gray-600 mt-1">{multiValue.length > 0 ? multiValue.join(', ') : 'None'}</p>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <Dropdown
                label="Countries"
                options={countryOptions}
                value={multiValue2}
                onChange={setMultiValue2}
                placeholder="Select countries"
                mode="multi"
                searchable={true}
                helperText="Select multiple countries"
              />
              <div className="mt-4 p-4 bg-gray-50 rounded text-sm">
                <p className="text-gray-600"><span className="font-semibold">Selected ({multiValue2.length}):</span></p>
                <p className="text-gray-600 mt-1">
                  {multiValue2.length > 0 
                    ? multiValue2.map(v => typeof v === 'string' ? v : v.label).join(', ')
                    : 'None'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Edge Cases */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Edge Cases & Positioning</h2>
          <div className="grid grid-cols-1 gap-6">
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-4">Top Position - Auto-Repositions on Bottom if Space Low</h3>
              <Dropdown
                label="Status (Top Position)"
                options={statusOptions}
                value={singleValue3}
                onChange={setSingleValue3}
                placeholder="Select status"
                mode="single"
                searchable={true}
                position="top"
                helperText="Opens upward but repositions downward if needed"
              />
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-4">Multi-Select with Many Options</h3>
              <Dropdown
                label="Select Multiple"
                options={multiValue3.length > 0 ? statusOptions : ['Option 1', 'Option 2', 'Option 3', 'Option 4', 'Option 5', 'Option 6', 'Option 7', 'Option 8']}
                value={multiValue3}
                onChange={setMultiValue3}
                placeholder="Select multiple items"
                mode="multi"
                searchable={true}
                maxHeight={250}
                helperText="Scroll to see all options, select as many as needed"
              />
            </div>
          </div>
        </div>

        {/* Keyboard Navigation Guide */}
        <div className="bg-blue-50 rounded-xl p-8 border border-blue-200 shadow-sm">
          <h2 className="text-xl font-semibold text-blue-900 mb-4">⌨️ Keyboard Navigation Guide</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-blue-800">
            <div>
              <p className="font-semibold mb-3">When Dropdown is Closed:</p>
              <ul className="space-y-2">
                <li><kbd className="px-2 py-1 bg-white rounded border border-blue-300">Enter</kbd> - Open dropdown</li>
                <li><kbd className="px-2 py-1 bg-white rounded border border-blue-300">Space</kbd> - Open dropdown</li>
                <li><kbd className="px-2 py-1 bg-white rounded border border-blue-300">↓</kbd> - Open & highlight first option</li>
              </ul>
            </div>
            <div>
              <p className="font-semibold mb-3">When Dropdown is Open:</p>
              <ul className="space-y-2">
                <li><kbd className="px-2 py-1 bg-white rounded border border-blue-300">↓</kbd> - Navigate down</li>
                <li><kbd className="px-2 py-1 bg-white rounded border border-blue-300">↑</kbd> - Navigate up</li>
                <li><kbd className="px-2 py-1 bg-white rounded border border-blue-300">Enter</kbd> - Select highlighted option</li>
                <li><kbd className="px-2 py-1 bg-white rounded border border-blue-300">Esc</kbd> - Close dropdown</li>
                <li><kbd className="px-2 py-1 bg-white rounded border border-blue-300">Tab</kbd> - Close dropdown</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-start gap-3">
              <span className="text-green-600 font-bold">✓</span>
              <span className="text-gray-700">Single & Multi-Select modes</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-600 font-bold">✓</span>
              <span className="text-gray-700">Smart auto-positioning with viewport detection</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-600 font-bold">✓</span>
              <span className="text-gray-700">Search with instant filtering</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-600 font-bold">✓</span>
              <span className="text-gray-700">Auto-focus search input on open</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-600 font-bold">✓</span>
              <span className="text-gray-700">Full keyboard navigation (Arrow keys, Enter, Esc)</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-600 font-bold">✓</span>
              <span className="text-gray-700">Highlighted keyboard selection</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-600 font-bold">✓</span>
              <span className="text-gray-700">Multi-select with removable tags</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-600 font-bold">✓</span>
              <span className="text-gray-700">Clear button for reset</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-600 font-bold">✓</span>
              <span className="text-gray-700">Customizable options (string or object)</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-600 font-bold">✓</span>
              <span className="text-gray-700">Click outside to close</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-600 font-bold">✓</span>
              <span className="text-gray-700">Smooth animations</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-600 font-bold">✓</span>
              <span className="text-gray-700">Fully responsive design</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Demo;