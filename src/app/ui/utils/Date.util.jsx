"use client";
import React, { useState, useRef, useEffect } from "react";
import {
  Calendar,
  Clock,
  ChevronLeft,
  ChevronRight,
  X,
  Search,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const getDaysInMonth = (year, month) =>
  new Date(year, month + 1, 0).getDate();
export const getFirstDayOfMonth = (year, month) =>
  new Date(year, month, 1).getDay();

export const formatDate = (date) => {
  if (!date) return "";
  const d = new Date(date);
  return `${String(d.getMonth() + 1).padStart(2, "0")}/${String(
    d.getDate()
  ).padStart(2, "0")}/${d.getFullYear()}`;
};

export const formatTime = (hours, minutes) => {
  const h = hours % 12 || 12;
  const period = hours >= 12 ? "PM" : "AM";
  return `${String(h).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0"
  )} ${period}`;
};

const SearchableDropdown = ({
  options,
  value,
  onChange,
  label,
  formatLabel = (val) => val,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const filtered = options.filter((opt) =>
    String(opt).toLowerCase().includes(search.toLowerCase())
  );

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      if (filtered.length > 0) {
        onChange(filtered[0]);
        setIsOpen(false);
        setSearch("");
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
      setSearch("");
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
        setSearch("");
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  return (
    <div ref={dropdownRef} className="relative">
      <motion.button
        whileHover={{ scale: 1.02 }}
        onClick={() => setIsOpen(!isOpen)}
        className="px-3 py-1.5 border border-gray-300 rounded-md font-medium text-sm bg-white hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-black"
      >
        {formatLabel(value)}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.12 }}
            className="absolute top-full mt-2 left-0 z-50 bg-white border border-gray-200 rounded-lg shadow-lg"
          >
            <div className="p-2 border-b border-gray-200">
              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-2.5 top-2.5" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder={`Search ${label}...`}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full pl-8 pr-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>
            </div>

            <div className="max-h-48 overflow-y-auto">
              {filtered.length > 0 ? (
                filtered.map((opt, idx) => (
                  <motion.button
                    key={idx}
                    whileHover={{ backgroundColor: "#f3f4f6" }}
                    onClick={() => {
                      onChange(opt);
                      setIsOpen(false);
                      setSearch("");
                    }}
                    className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                      opt === value
                        ? "bg-black text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {formatLabel(opt)}
                  </motion.button>
                ))
              ) : (
                <div className="px-3 py-2 text-sm text-gray-500">
                  No results
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const DateTimePicker = ({
  value = null,
  onChange = () => {},
  placeholder = "Select date & time",
  disabled = false,
  readOnly = false,
  showTime = true,
  minDate = null,
  maxDate = null,
  className = "",
  label = "",
  helperText = "",
  required = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    value ? new Date(value) : null
  );
  const [currentMonth, setCurrentMonth] = useState(
    value ? new Date(value).getMonth() : new Date().getMonth()
  );
  const [currentYear, setCurrentYear] = useState(
    value ? new Date(value).getFullYear() : new Date().getFullYear()
  );
  const [selectedHours, setSelectedHours] = useState(
    value ? new Date(value).getHours() : 12
  );
  const [selectedMinutes, setSelectedMinutes] = useState(
    value ? new Date(value).getMinutes() : 0
  );
  const [position, setPosition] = useState("bottom");
  const [activeView, setActiveView] = useState("date");

  const containerRef = useRef(null);
  const pickerRef = useRef(null);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const weekDays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  useEffect(() => {
    if (isOpen && containerRef.current && pickerRef.current) {
      const container = containerRef.current.getBoundingClientRect();
      const picker = pickerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;

      const spaceBelow = viewportHeight - container.bottom;
      const spaceAbove = container.top;
      const spaceRight = viewportWidth - container.right;
      const spaceLeft = container.left;

      let newPosition = "bottom";

      if (spaceBelow < 400 && spaceAbove > spaceBelow) {
        newPosition = "top";
      }

      if (spaceRight < picker.width && spaceLeft > spaceRight) {
        newPosition = newPosition === "top" ? "top-left" : "bottom-left";
      }

      setPosition(newPosition);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  const handleDateSelect = (day) => {
    const newDate = new Date(
      currentYear,
      currentMonth,
      day,
      selectedHours,
      selectedMinutes
    );

    if (minDate && newDate < new Date(minDate)) return;
    if (maxDate && newDate > new Date(maxDate)) return;

    setSelectedDate(newDate);

    if (!showTime) {
      onChange(newDate);
      setIsOpen(false);
    } else {
      setActiveView("time");
    }
  };

  const handleTimeConfirm = () => {
    if (selectedDate) {
      const newDate = new Date(selectedDate);
      newDate.setHours(selectedHours);
      newDate.setMinutes(selectedMinutes);
      onChange(newDate);
      setIsOpen(false);
      setActiveView("date");
    }
  };

  const handleClear = (e) => {
    e.stopPropagation();
    setSelectedDate(null);
    onChange(null);
    setIsOpen(false);
  };

  const navigateMonth = (direction) => {
    let newMonth = currentMonth + direction;
    let newYear = currentYear;

    if (newMonth > 11) {
      newMonth = 0;
      newYear++;
    } else if (newMonth < 0) {
      newMonth = 11;
      newYear--;
    }

    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
  };

  const isDateDisabled = (day) => {
    const date = new Date(currentYear, currentMonth, day);
    if (minDate && date < new Date(minDate)) return true;
    if (maxDate && date > new Date(maxDate)) return true;
    return false;
  };

  const isToday = (day) => {
    const today = new Date();
    return (
      today.getDate() === day &&
      today.getMonth() === currentMonth &&
      today.getFullYear() === currentYear
    );
  };

  const isSelected = (day) => {
    if (!selectedDate) return false;
    return (
      selectedDate.getDate() === day &&
      selectedDate.getMonth() === currentMonth &&
      selectedDate.getFullYear() === currentYear
    );
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-9" />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const disabled = isDateDisabled(day);
      const today = isToday(day);
      const selected = isSelected(day);

      days.push(
        <motion.button
          key={day}
          whileHover={!disabled ? { scale: 1.05 } : {}}
          whileTap={!disabled ? { scale: 0.95 } : {}}
          onClick={() => !disabled && handleDateSelect(day)}
          disabled={disabled}
          className={`
            h-9 rounded-lg text-sm font-medium transition-all
            ${
              disabled
                ? "text-gray-300 cursor-not-allowed"
                : "text-black hover:bg-gray-100 cursor-pointer"
            }
            ${today && !selected ? "border border-black" : ""}
            ${selected ? "bg-black text-white hover:bg-gray-800" : ""}
          `}
        >
          {day}
        </motion.button>
      );
    }

    return days;
  };

  const renderTimePicker = () => {
    return (
      <div className="p-4 space-y-4">
        <div className="text-center text-lg font-semibold mb-4">
          {formatDate(selectedDate)}
        </div>

        <div className="flex justify-center items-center space-x-4">
          <div className="flex flex-col items-center">
            <label className="text-xs text-gray-600 mb-2">Hours</label>
            <div className="relative">
              <select
                value={selectedHours}
                onChange={(e) => setSelectedHours(parseInt(e.target.value))}
                className="w-20 h-10 px-2 border border-gray-300 rounded-lg text-center font-medium focus:outline-none focus:ring-2 focus:ring-black appearance-none cursor-pointer"
              >
                {Array.from({ length: 24 }, (_, i) => (
                  <option key={i} value={i}>
                    {String(i).padStart(2, "0")}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="text-2xl font-bold mt-6">:</div>

          <div className="flex flex-col items-center">
            <label className="text-xs text-gray-600 mb-2">Minutes</label>
            <div className="relative">
              <select
                value={selectedMinutes}
                onChange={(e) => setSelectedMinutes(parseInt(e.target.value))}
                className="w-20 h-10 px-2 border border-gray-300 rounded-lg text-center font-medium focus:outline-none focus:ring-2 focus:ring-black appearance-none cursor-pointer"
              >
                {Array.from({ length: 60 }, (_, i) => (
                  <option key={i} value={i}>
                    {String(i).padStart(2, "0")}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="text-center text-2xl font-semibold mt-4">
          {formatTime(selectedHours, selectedMinutes)}
        </div>

        <div className="flex space-x-2 mt-6">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveView("date")}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Back
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleTimeConfirm}
            className="flex-1 px-4 py-2 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
          >
            Confirm
          </motion.button>
        </div>
      </div>
    );
  };

  const positionClasses = {
    bottom: "top-full mt-2 left-0",
    top: "bottom-full mb-2 left-0",
    "bottom-left": "top-full mt-2 right-0",
    "top-left": "bottom-full mb-2 right-0",
  };

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-black mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div
        onClick={() => !disabled && !readOnly && setIsOpen(!isOpen)}
        className={`
          relative flex items-center justify-between px-4 py-2.5 
          bg-white border border-gray-300 rounded-lg cursor-pointer
          transition-all
          ${disabled ? "bg-gray-100 cursor-not-allowed" : "hover:border-black"}
          ${readOnly ? "cursor-default" : ""}
          ${isOpen ? "border-black ring-2 ring-black ring-opacity-20" : ""}
        `}
      >
        <div className="flex items-center space-x-2 flex-1">
          <Calendar className="w-5 h-5 text-gray-600" />
          <span className={selectedDate ? "text-black" : "text-gray-400"}>
            {selectedDate ? (
              <>
                {formatDate(selectedDate)}
                {showTime && ` ${formatTime(selectedHours, selectedMinutes)}`}
              </>
            ) : (
              placeholder
            )}
          </span>
        </div>

        {selectedDate && !disabled && !readOnly && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleClear}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <X className="w-4 h-4 text-gray-600" />
          </motion.button>
        )}
      </div>

      {helperText && <p className="text-xs text-gray-600 mt-1">{helperText}</p>}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={pickerRef}
            initial={{ opacity: 0, y: position.includes("top") ? 10 : -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: position.includes("top") ? 10 : -10 }}
            transition={{ duration: 0.15 }}
            className={`
              absolute z-50 bg-white rounded-lg shadow-2xl border border-gray-200
              ${positionClasses[position] || positionClasses.bottom}
              w-80
            `}
          >
            {activeView === "date" ? (
              <div className="p-4">
                <div className="flex items-center justify-between mb-4 gap-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => navigateMonth(-1)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </motion.button>

                  <div className="flex items-center gap-2">
                    <SearchableDropdown
                      options={months}
                      value={months[currentMonth]}
                      onChange={(selectedMonth) => {
                        const idx = months.indexOf(selectedMonth);
                        if (idx !== -1) setCurrentMonth(idx);
                      }}
                      label="month"
                      formatLabel={(val) => val}
                    />

                    <SearchableDropdown
                      options={Array.from(
                        { length: 100 },
                        (_, i) => new Date().getFullYear() - 50 + i
                      )}
                      value={currentYear}
                      onChange={setCurrentYear}
                      label="year"
                      formatLabel={(val) => val}
                    />
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => navigateMonth(1)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </motion.button>
                </div>

                <div className="grid grid-cols-7 gap-1 mb-2">
                  {weekDays.map((day) => (
                    <div
                      key={day}
                      className="h-9 flex items-center justify-center text-xs font-semibold text-gray-600"
                    >
                      {day}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-1">{renderCalendar()}</div>

                {showTime && selectedDate && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveView("time")}
                    className="w-full mt-4 px-4 py-2 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Clock className="w-4 h-4" />
                    <span>Set Time</span>
                  </motion.button>
                )}
              </div>
            ) : (
              renderTimePicker()
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DateTimePicker;
