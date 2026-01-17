/* eslint-disable import/no-anonymous-default-export */
/**
 * Production-Grade Utility Library
 * A comprehensive collection of utility functions for modern JavaScript applications
 * @version 1.0.0
 */

// ============================================================================
// CLIPBOARD UTILITIES
// ============================================================================

/**
 * Copies text to clipboard with fallback support
 * @param {string} text - Text to copy
 * @param {Function} onSuccess - Success callback
 * @param {Function} onError - Error callback
 * @returns {Promise<boolean>} Success status
 */
export const copyToClipboard = async (text, onSuccess, onError) => {
    if (!text || typeof text !== 'string') {
        const error = new Error('Invalid text provided');
        onError?.(error);
        return false;
    }

    try {
        // Modern Clipboard API
        if (navigator?.clipboard?.writeText) {
            await navigator.clipboard.writeText(text);
            onSuccess?.();
            return true;
        }

        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.cssText = 'position:fixed;top:-9999px;left:-9999px;opacity:0';
        document.body.appendChild(textarea);
        textarea.select();
        textarea.setSelectionRange(0, text.length);

        const success = document.execCommand('copy');
        document.body.removeChild(textarea);

        if (success) {
            onSuccess?.();
            return true;
        }
        throw new Error('Copy command failed');
    } catch (error) {
        onError?.(error);
        return false;
    }
};

// ============================================================================
// STRING MANIPULATION UTILITIES
// ============================================================================

/**
 * Truncates text to specified length with ellipsis
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length (default: 100)
 * @param {string} suffix - Suffix to append (default: '...')
 * @returns {string} Truncated text
 */
export const truncate = (text, maxLength = 100, suffix = '...') => {
    if (!text || typeof text !== 'string') return '';
    if (text.length <= maxLength) return text;

    const truncatedLength = maxLength - suffix.length;
    return text.slice(0, Math.max(0, truncatedLength)).trim() + suffix;
};

/**
 * Removes extra whitespace from text
 * @param {string} text - Text to clean
 * @param {Object} options - Configuration options
 * @returns {string} Cleaned text
 */
export const removeExtraSpace = (text, options = {}) => {
    const {
        trim = true,
        multipleSpaces = true,
        newlines = false,
        tabs = true
    } = options;

    if (!text || typeof text !== 'string') return '';

    let result = text;

    if (tabs) result = result.replace(/\t+/g, ' ');
    if (newlines) result = result.replace(/\n+/g, ' ');
    if (multipleSpaces) result = result.replace(/\s+/g, ' ');
    if (trim) result = result.trim();

    return result;
};

/**
 * Converts text to URL-friendly slug
 * @param {string} text - Text to slugify
 * @param {Object} options - Configuration options
 * @returns {string} Slugified text
 */
export const slugify = (text, options = {}) => {
    const {
        separator = '-',
        lowercase = true,
        strict = false,
        trim = true
    } = options;

    if (!text || typeof text !== 'string') return '';

    let slug = text;

    // Normalize unicode characters
    slug = slug.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    if (lowercase) slug = slug.toLowerCase();

    // Replace special characters
    slug = slug.replace(/[^a-z0-9\s-]/gi, strict ? '' : ' ');

    // Replace spaces and multiple separators
    slug = slug.replace(/[\s_-]+/g, separator);

    // Remove leading/trailing separators
    if (trim) {
        const separatorRegex = new RegExp(`^${separator}+|${separator}+$`, 'g');
        slug = slug.replace(separatorRegex, '');
    }

    return slug;
};

/**
 * Masks sensitive text (email, phone, etc.)
 * @param {string} text - Text to mask
 * @param {Object} options - Masking options
 * @returns {string} Masked text
 */
export const maskText = (text, options = {}) => {
    const {
        type = 'default',
        maskChar = '*',
        visibleStart = 3,
        visibleEnd = 3,
        preserveDomain = true
    } = options;

    if (!text || typeof text !== 'string') return '';

    switch (type) {
        case 'email': {
            const [local, domain] = text.split('@');
            if (!domain) return text;

            const maskedLocal = local.length > 3
                ? local.slice(0, 2) + maskChar.repeat(Math.min(local.length - 2, 5))
                : local;

            return preserveDomain
                ? `${maskedLocal}@${domain}`
                : `${maskedLocal}@${maskChar.repeat(domain.length)}`;
        }

        case 'phone': {
            const digits = text.replace(/\D/g, '');
            if (digits.length < 4) return text;

            const visible = digits.slice(-4);
            const masked = maskChar.repeat(digits.length - 4);
            return masked + visible;
        }

        case 'card': {
            const digits = text.replace(/\s/g, '');
            if (digits.length < 4) return text;

            const visible = digits.slice(-4);
            const masked = maskChar.repeat(digits.length - 4);
            return masked.match(/.{1,4}/g)?.join(' ') + ' ' + visible;
        }

        default: {
            if (text.length <= visibleStart + visibleEnd) return text;

            const start = text.slice(0, visibleStart);
            const end = text.slice(-visibleEnd);
            const middle = maskChar.repeat(text.length - visibleStart - visibleEnd);

            return start + middle + end;
        }
    }
};

/**
 * Capitalizes text in various formats
 * @param {string} text - Text to capitalize
 * @param {string} mode - Capitalization mode
 * @returns {string} Capitalized text
 */
export const capitalize = (text, mode = 'first') => {
    if (!text || typeof text !== 'string') return '';

    switch (mode) {
        case 'first':
            return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();

        case 'words':
            return text.replace(/\b\w/g, char => char.toUpperCase());

        case 'sentences':
            return text.replace(/(^\w|\.\s+\w)/g, char => char.toUpperCase());

        case 'all':
            return text.toUpperCase();

        case 'toggle':
            return text.split('').map(char =>
                char === char.toUpperCase() ? char.toLowerCase() : char.toUpperCase()
            ).join('');

        default:
            return text.charAt(0).toUpperCase() + text.slice(1);
    }
};

// ============================================================================
// BROWSER UTILITIES
// ============================================================================

/**
 * Checks if code is running in browser environment
 * @returns {boolean} True if browser environment
 */
export const isBrowser = () => {
    return typeof window !== 'undefined' &&
        typeof document !== 'undefined' &&
        typeof navigator !== 'undefined';
};

/**
 * Smoothly scrolls to top of page
 * @param {Object} options - Scroll options
 */
export const scrollToTop = (options = {}) => {
    const { behavior = 'smooth', top = 0 } = options;

    if (!isBrowser()) return;

    window.scrollTo({
        top,
        behavior
    });
};

// ============================================================================
// IN-MEMORY STORAGE UTILITIES (No localStorage usage)
// ============================================================================

// In-memory storage object as replacement for localStorage
const memoryStorage = new Map();

/**
 * Saves data to in-memory storage
 * @param {string} key - Storage key
 * @param {*} value - Value to store
 * @returns {boolean} Success status
 */
export const saveToMemoryStorage = (key, value) => {
    try {
        if (!key) throw new Error('Key is required');

        const serialized = JSON.stringify(value);
        memoryStorage.set(key, serialized);
        return true;
    } catch (error) {
        console.error('Save to memory storage failed:', error);
        return false;
    }
};

/**
 * Retrieves data from in-memory storage
 * @param {string} key - Storage key
 * @param {*} defaultValue - Default value if key not found
 * @returns {*} Retrieved value
 */
export const getFromMemoryStorage = (key, defaultValue = null) => {
    try {
        if (!key) return defaultValue;

        const item = memoryStorage.get(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
        console.error('Get from memory storage failed:', error);
        return defaultValue;
    }
};

/**
 * Removes item from in-memory storage
 * @param {string} key - Storage key
 * @returns {boolean} Success status
 */
export const removeFromMemoryStorage = (key) => {
    try {
        if (!key) return false;
        return memoryStorage.delete(key);
    } catch (error) {
        console.error('Remove from memory storage failed:', error);
        return false;
    }
};

/**
 * Clears all in-memory storage
 * @returns {boolean} Success status
 */
export const clearMemoryStorage = () => {
    try {
        memoryStorage.clear();
        return true;
    } catch (error) {
        console.error('Clear memory storage failed:', error);
        return false;
    }
};

/**
 * Checks if key exists in in-memory storage
 * @param {string} key - Storage key
 * @returns {boolean} True if key exists
 */
export const hasMemoryStorageKey = (key) => {
    return memoryStorage.has(key);
};

/**
 * Sets memory storage item with expiry time
 * @param {string} key - Storage key
 * @param {*} value - Value to store
 * @param {number} ttl - Time to live in milliseconds
 * @returns {boolean} Success status
 */
export const setMemoryStorageWithExpiry = (key, value, ttl) => {
    try {
        if (!key || !ttl) throw new Error('Key and TTL are required');

        const item = {
            value,
            expiry: Date.now() + ttl
        };

        memoryStorage.set(key, JSON.stringify(item));
        return true;
    } catch (error) {
        console.error('Set memory storage with expiry failed:', error);
        return false;
    }
};

/**
 * Gets memory storage item with expiry check
 * @param {string} key - Storage key
 * @param {*} defaultValue - Default value if expired/not found
 * @returns {*} Retrieved value or default
 */
export const getMemoryStorageWithExpiry = (key, defaultValue = null) => {
    try {
        if (!key) return defaultValue;

        const itemStr = memoryStorage.get(key);
        if (!itemStr) return defaultValue;

        const item = JSON.parse(itemStr);

        if (Date.now() > item.expiry) {
            memoryStorage.delete(key);
            return defaultValue;
        }

        return item.value;
    } catch (error) {
        console.error('Get memory storage with expiry failed:', error);
        return defaultValue;
    }
};

/**
 * Safely gets from memory storage with error handling
 * @param {string} key - Storage key
 * @param {*} fallback - Fallback value
 * @returns {*} Retrieved value or fallback
 */
export const safeMemoryStorageGet = (key, fallback = null) => {
    return getFromMemoryStorage(key, fallback);
};

/**
 * Safely sets to memory storage with error handling
 * @param {string} key - Storage key
 * @param {*} value - Value to store
 * @returns {boolean} Success status
 */
export const safeMemoryStorageSet = (key, value) => {
    return saveToMemoryStorage(key, value);
};

// ============================================================================
// AUTHENTICATION & AUTHORIZATION UTILITIES
// ============================================================================

/**
 * Checks if user is authenticated
 * @param {Object} options - Authentication check options
 * @returns {boolean} Authentication status
 */
export const isAuthenticated = (options = {}) => {
    const { tokenKey = 'authToken', customValidator } = options;

    if (customValidator && typeof customValidator === 'function') {
        return customValidator();
    }

    const token = getFromMemoryStorage(tokenKey);
    if (!token) return false;

    // Basic JWT expiry check
    try {
        const payload = decodeJwt(token);
        if (!payload || !payload.exp) return true;

        return Date.now() < payload.exp * 1000;
    } catch {
        return !!token;
    }
};

/**
 * Checks if user has specific permission
 * @param {string|string[]} requiredPermission - Required permission(s)
 * @param {Object} options - Permission check options
 * @returns {boolean} Permission status
 */
export const hasPermission = (requiredPermission, options = {}) => {
    const {
        permissionsKey = 'userPermissions',
        mode = 'some', // 'some' or 'every'
        customGetter
    } = options;

    const userPermissions = customGetter
        ? customGetter()
        : getFromMemoryStorage(permissionsKey, []);

    if (!Array.isArray(userPermissions)) return false;

    const required = Array.isArray(requiredPermission)
        ? requiredPermission
        : [requiredPermission];

    return mode === 'every'
        ? required.every(perm => userPermissions.includes(perm))
        : required.some(perm => userPermissions.includes(perm));
};

/**
 * Decodes JWT token without verification
 * @param {string} token - JWT token
 * @returns {Object|null} Decoded payload
 */
export const decodeJwt = (token) => {
    try {
        if (!token || typeof token !== 'string') return null;

        const parts = token.split('.');
        if (parts.length !== 3) return null;

        const payload = parts[1].replace(/-/g, '+').replace(/_/g, '/');
        const decoded = decodeURIComponent(
            atob(payload)
                .split('')
                .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );

        return JSON.parse(decoded);
    } catch (error) {
        console.error('JWT decode failed:', error);
        return null;
    }
};

// ============================================================================
// VALIDATION UTILITIES
// ============================================================================

/**
 * Validates email address
 * @param {string} email - Email to validate
 * @param {Object} options - Validation options
 * @returns {boolean} Validation result
 */
export const isEmailValid = (email, options = {}) => {
    const {
        allowPlus = true,
        allowSubdomain = true,
        strict = false
    } = options;

    if (!email || typeof email !== 'string') return false;

    let pattern = strict
        ? /^[a-zA-Z0-9._-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
        : /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!pattern.test(email)) return false;
    if (!allowPlus && email.includes('+')) return false;
    if (!allowSubdomain && email.split('@')[1].split('.').length > 2) return false;

    return true;
};

/**
 * Validates phone number
 * @param {string} phone - Phone number to validate
 * @param {Object} options - Validation options
 * @returns {boolean} Validation result
 */
export const isPhoneNumberValid = (phone, options = {}) => {
    const {
        countryCode = 'US',
        strict = false,
        allowInternational = true
    } = options;

    if (!phone || typeof phone !== 'string') return false;

    const cleaned = phone.replace(/\D/g, '');

    if (strict) {
        const patterns = {
            US: /^1?[2-9]\d{9}$/,
            UK: /^(44)?[1-9]\d{9,10}$/,
            IN: /^(91)?[6-9]\d{9}$/,
            INTL: /^\d{7,15}$/
        };

        const pattern = allowInternational
            ? patterns.INTL
            : patterns[countryCode] || patterns.INTL;

        return pattern.test(cleaned);
    }

    return cleaned.length >= 10 && cleaned.length <= 15;
};

/**
 * Checks if value is empty
 * @param {*} value - Value to check
 * @param {Object} options - Check options
 * @returns {boolean} True if empty
 */
export const isEmpty = (value, options = {}) => {
    const { trim = true, checkZero = false } = options;

    if (value === null || value === undefined) return true;
    if (checkZero && value === 0) return true;

    if (typeof value === 'string') {
        return trim ? value.trim().length === 0 : value.length === 0;
    }

    if (Array.isArray(value)) return value.length === 0;
    if (typeof value === 'object') return Object.keys(value).length === 0;

    return false;
};

/**
 * Validates password strength
 * @param {string} password - Password to validate
 * @param {Object} options - Validation criteria
 * @returns {Object} Validation result with score and feedback
 */
export const isStrongPassword = (password, options = {}) => {
    const {
        minLength = 8,
        maxLength = 128,
        requireUppercase = true,
        requireLowercase = true,
        requireNumbers = true,
        requireSpecialChars = true,
        specialChars = '!@#$%^&*()_+-=[]{}|;:,.<>?'
    } = options;

    const result = {
        valid: false,
        score: 0,
        feedback: []
    };

    if (!password || typeof password !== 'string') {
        result.feedback.push('Password is required');
        return result;
    }

    if (password.length < minLength) {
        result.feedback.push(`Minimum ${minLength} characters required`);
    } else {
        result.score += 1;
    }

    if (password.length > maxLength) {
        result.feedback.push(`Maximum ${maxLength} characters allowed`);
    } else {
        result.score += 1;
    }

    if (requireUppercase && !/[A-Z]/.test(password)) {
        result.feedback.push('Include at least one uppercase letter');
    } else if (requireUppercase) {
        result.score += 1;
    }

    if (requireLowercase && !/[a-z]/.test(password)) {
        result.feedback.push('Include at least one lowercase letter');
    } else if (requireLowercase) {
        result.score += 1;
    }

    if (requireNumbers && !/\d/.test(password)) {
        result.feedback.push('Include at least one number');
    } else if (requireNumbers) {
        result.score += 1;
    }

    if (requireSpecialChars) {
        const specialRegex = new RegExp(`[${specialChars.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}]`);
        if (!specialRegex.test(password)) {
            result.feedback.push('Include at least one special character');
        } else {
            result.score += 1;
        }
    }

    result.valid = result.feedback.length === 0;
    return result;
};

// ============================================================================
// PERFORMANCE UTILITIES
// ============================================================================

/**
 * Debounces function execution
 * @param {Function} func - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @param {Object} options - Debounce options
 * @returns {Function} Debounced function
 */
export const debounce = (func, delay = 300, options = {}) => {
    const { leading = false, trailing = true, maxWait } = options;

    let timeoutId;
    let lastCallTime;
    let lastInvokeTime = 0;
    let lastArgs;
    let lastThis;
    let result;

    const invokeFunc = (time) => {
        const args = lastArgs;
        const thisArg = lastThis;

        lastArgs = lastThis = undefined;
        lastInvokeTime = time;
        result = func.apply(thisArg, args);
        return result;
    };

    const startTimer = (pendingFunc, wait) => {
        return setTimeout(pendingFunc, wait);
    };

    const cancelTimer = (id) => {
        clearTimeout(id);
    };

    const shouldInvoke = (time) => {
        const timeSinceLastCall = time - lastCallTime;
        const timeSinceLastInvoke = time - lastInvokeTime;

        return (
            lastCallTime === undefined ||
            timeSinceLastCall >= delay ||
            timeSinceLastCall < 0 ||
            (maxWait !== undefined && timeSinceLastInvoke >= maxWait)
        );
    };

    const trailingEdge = (time) => {
        timeoutId = undefined;

        if (trailing && lastArgs) {
            return invokeFunc(time);
        }
        lastArgs = lastThis = undefined;
        return result;
    };

    const timerExpired = () => {
        const time = Date.now();
        if (shouldInvoke(time)) {
            return trailingEdge(time);
        }

        const timeSinceLastCall = time - lastCallTime;
        const timeSinceLastInvoke = time - lastInvokeTime;
        const timeWaiting = delay - timeSinceLastCall;
        const remainingWait = maxWait !== undefined
            ? Math.min(timeWaiting, maxWait - timeSinceLastInvoke)
            : timeWaiting;

        timeoutId = startTimer(timerExpired, remainingWait);
    };

    const debounced = function (...args) {
        const time = Date.now();
        const isInvoking = shouldInvoke(time);

        lastArgs = args;
        lastThis = this;
        lastCallTime = time;

        if (isInvoking) {
            if (timeoutId === undefined && leading) {
                lastInvokeTime = lastCallTime;
                timeoutId = startTimer(timerExpired, delay);
                return invokeFunc(lastCallTime);
            }
            if (maxWait !== undefined) {
                timeoutId = startTimer(timerExpired, delay);
                return invokeFunc(lastCallTime);
            }
        }

        if (timeoutId === undefined) {
            timeoutId = startTimer(timerExpired, delay);
        }

        return result;
    };

    debounced.cancel = () => {
        if (timeoutId !== undefined) {
            cancelTimer(timeoutId);
        }
        lastInvokeTime = 0;
        lastArgs = lastCallTime = lastThis = timeoutId = undefined;
    };

    debounced.flush = () => {
        return timeoutId === undefined ? result : trailingEdge(Date.now());
    };

    debounced.pending = () => {
        return timeoutId !== undefined;
    };

    return debounced;
};

/**
 * Throttles function execution
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @param {Object} options - Throttle options
 * @returns {Function} Throttled function
 */
export const throttle = (func, limit = 300, options = {}) => {
    const { leading = true, trailing = true } = options;

    return debounce(func, limit, {
        leading,
        trailing,
        maxWait: limit
    });
};

/**
 * Delays execution for specified time
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise} Promise that resolves after delay
 */
export const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Project Management Utility Library
 * Specialized utilities for project management applications
 * (Jira, Trello, Asana, Zoho Projects, etc.)
 * @version 1.0.0
 */

// ============================================================================
// DATE & TIME UTILITIES
// ============================================================================

/**
 * Formats date to various common formats
 * @param {Date|string|number} date - Date to format
 * @param {string} format - Format type
 * @param {Object} options - Formatting options
 * @returns {string} Formatted date string
 */
export const formatDate = (date, format = 'default', options = {}) => {
    const { locale = 'en-US', timezone } = options;

    const d = date instanceof Date ? date : new Date(date);
    if (isNaN(d.getTime())) return 'Invalid Date';

    const formats = {
        default: { year: 'numeric', month: 'short', day: 'numeric' },
        short: { year: '2-digit', month: '2-digit', day: '2-digit' },
        long: { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' },
        time: { hour: '2-digit', minute: '2-digit' },
        datetime: { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' },
        iso: null // Special case
    };

    if (format === 'iso') return d.toISOString();

    const formatOptions = formats[format] || formats.default;
    return new Intl.DateTimeFormat(locale, { ...formatOptions, timeZone: timezone }).format(d);
};

/**
 * Gets relative time string (e.g., "2 hours ago", "in 3 days")
 * @param {Date|string|number} date - Date to compare
 * @param {Object} options - Options
 * @returns {string} Relative time string
 */
export const getRelativeTime = (date, options = {}) => {
    const { locale = 'en-US', baseDate = new Date() } = options;

    const d = date instanceof Date ? date : new Date(date);
    const base = baseDate instanceof Date ? baseDate : new Date(baseDate);

    if (isNaN(d.getTime())) return 'Invalid Date';

    const diffMs = d.getTime() - base.getTime();
    const diffSec = Math.round(diffMs / 1000);
    const diffMin = Math.round(diffSec / 60);
    const diffHour = Math.round(diffMin / 60);
    const diffDay = Math.round(diffHour / 24);

    const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

    if (Math.abs(diffSec) < 60) return rtf.format(diffSec, 'second');
    if (Math.abs(diffMin) < 60) return rtf.format(diffMin, 'minute');
    if (Math.abs(diffHour) < 24) return rtf.format(diffHour, 'hour');
    if (Math.abs(diffDay) < 30) return rtf.format(diffDay, 'day');
    if (Math.abs(diffDay) < 365) return rtf.format(Math.round(diffDay / 30), 'month');
    return rtf.format(Math.round(diffDay / 365), 'year');
};

/**
 * Calculates duration between two dates
 * @param {Date|string} startDate - Start date
 * @param {Date|string} endDate - End date
 * @param {string} unit - Unit to return (ms, seconds, minutes, hours, days)
 * @returns {number} Duration in specified unit
 */
export const calculateDuration = (startDate, endDate, unit = 'days') => {
    const start = startDate instanceof Date ? startDate : new Date(startDate);
    const end = endDate instanceof Date ? endDate : new Date(endDate);

    const diffMs = end.getTime() - start.getTime();

    const units = {
        ms: 1,
        seconds: 1000,
        minutes: 1000 * 60,
        hours: 1000 * 60 * 60,
        days: 1000 * 60 * 60 * 24,
        weeks: 1000 * 60 * 60 * 24 * 7
    };

    return diffMs / (units[unit] || units.days);
};

/**
 * Checks if a date is overdue
 * @param {Date|string} dueDate - Due date to check
 * @param {Object} options - Options
 * @returns {boolean} True if overdue
 */
export const isOverdue = (dueDate, options = {}) => {
    const { includeToday = false, referenceDate = new Date() } = options;

    const due = dueDate instanceof Date ? dueDate : new Date(dueDate);
    const ref = referenceDate instanceof Date ? referenceDate : new Date(referenceDate);

    if (isNaN(due.getTime())) return false;

    if (includeToday) {
        return due < ref;
    }

    // Compare dates without time
    const dueDay = new Date(due.getFullYear(), due.getMonth(), due.getDate());
    const refDay = new Date(ref.getFullYear(), ref.getMonth(), ref.getDate());

    return dueDay < refDay;
};

/**
 * Calculates business days between two dates
 * @param {Date|string} startDate - Start date
 * @param {Date|string} endDate - End date
 * @param {Array} holidays - Array of holiday dates
 * @returns {number} Number of business days
 */
export const getBusinessDays = (startDate, endDate, holidays = []) => {
    const start = startDate instanceof Date ? startDate : new Date(startDate);
    const end = endDate instanceof Date ? endDate : new Date(endDate);

    const holidaySet = new Set(holidays.map(h => {
        const d = h instanceof Date ? h : new Date(h);
        return d.toDateString();
    }));

    let count = 0;
    const current = new Date(start);

    while (current <= end) {
        const day = current.getDay();
        const isWeekend = day === 0 || day === 6;
        const isHoliday = holidaySet.has(current.toDateString());

        if (!isWeekend && !isHoliday) {
            count++;
        }

        current.setDate(current.getDate() + 1);
    }

    return count;
};

/**
 * Adds business days to a date
 * @param {Date|string} date - Starting date
 * @param {number} days - Number of business days to add
 * @param {Array} holidays - Array of holiday dates
 * @returns {Date} New date
 */
export const addBusinessDays = (date, days, holidays = []) => {
    const start = date instanceof Date ? new Date(date) : new Date(date);

    const holidaySet = new Set(holidays.map(h => {
        const d = h instanceof Date ? h : new Date(h);
        return d.toDateString();
    }));

    let count = 0;
    const direction = days < 0 ? -1 : 1;
    const remaining = Math.abs(days);

    while (count < remaining) {
        start.setDate(start.getDate() + direction);

        const day = start.getDay();
        const isWeekend = day === 0 || day === 6;
        const isHoliday = holidaySet.has(start.toDateString());

        if (!isWeekend && !isHoliday) {
            count++;
        }
    }

    return start;
};

/**
 * Checks if a date is a business day
 * @param {Date|string} date - Date to check
 * @param {Array} holidays - Array of holiday dates
 * @returns {boolean} True if business day
 */
export const isBusinessDay = (date, holidays = []) => {
    const d = date instanceof Date ? date : new Date(date);
    const day = d.getDay();

    if (day === 0 || day === 6) return false;

    const holidaySet = new Set(holidays.map(h => {
        const hd = h instanceof Date ? h : new Date(h);
        return hd.toDateString();
    }));

    return !holidaySet.has(d.toDateString());
};

/**
 * Gets ISO week number
 * @param {Date|string} date - Date
 * @returns {number} Week number
 */
export const getWeekNumber = (date) => {
    const d = date instanceof Date ? new Date(date) : new Date(date);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 4 - (d.getDay() || 7));
    const yearStart = new Date(d.getFullYear(), 0, 1);
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
};

/**
 * Gets quarter from date
 * @param {Date|string} date - Date
 * @returns {Object} Quarter info
 */
export const getQuarter = (date) => {
    const d = date instanceof Date ? date : new Date(date);
    const month = d.getMonth();
    const quarter = Math.floor(month / 3) + 1;

    return {
        quarter,
        year: d.getFullYear(),
        label: `Q${quarter} ${d.getFullYear()}`,
        startMonth: (quarter - 1) * 3,
        endMonth: quarter * 3 - 1
    };
};

// ============================================================================
// ARRAY & COLLECTION UTILITIES
// ============================================================================

/**
 * Groups array items by a key or function
 * @param {Array} array - Array to group
 * @param {string|Function} key - Property name or function
 * @returns {Object} Grouped object
 */
export const groupBy = (array, key) => {
    if (!Array.isArray(array)) return {};

    const getKey = typeof key === 'function' ? key : (item) => item[key];

    return array.reduce((result, item) => {
        const groupKey = getKey(item);
        if (!result[groupKey]) {
            result[groupKey] = [];
        }
        result[groupKey].push(item);
        return result;
    }, {});
};

/**
 * Sorts array by multiple fields
 * @param {Array} array - Array to sort
 * @param {Array} sortBy - Sort configuration [{key, order}]
 * @returns {Array} Sorted array
 */
export const sortBy = (array, sortBy = []) => {
    if (!Array.isArray(array)) return [];

    const sorted = [...array];

    sorted.sort((a, b) => {
        for (const { key, order = 'asc' } of sortBy) {
            const aVal = typeof key === 'function' ? key(a) : a[key];
            const bVal = typeof key === 'function' ? key(b) : b[key];

            if (aVal < bVal) return order === 'asc' ? -1 : 1;
            if (aVal > bVal) return order === 'asc' ? 1 : -1;
        }
        return 0;
    });

    return sorted;
};

/**
 * Filters array with advanced operators
 * @param {Array} array - Array to filter
 * @param {Object} filters - Filter criteria
 * @returns {Array} Filtered array
 */
export const filterBy = (array, filters = {}) => {
    if (!Array.isArray(array)) return [];

    return array.filter(item => {
        return Object.entries(filters).every(([key, condition]) => {
            const value = item[key];

            if (typeof condition === 'function') {
                return condition(value, item);
            }

            if (typeof condition === 'object' && condition !== null) {
                const { operator, value: filterValue } = condition;

                switch (operator) {
                    case 'eq': return value === filterValue;
                    case 'ne': return value !== filterValue;
                    case 'gt': return value > filterValue;
                    case 'gte': return value >= filterValue;
                    case 'lt': return value < filterValue;
                    case 'lte': return value <= filterValue;
                    case 'in': return Array.isArray(filterValue) && filterValue.includes(value);
                    case 'nin': return Array.isArray(filterValue) && !filterValue.includes(value);
                    case 'contains': return String(value).toLowerCase().includes(String(filterValue).toLowerCase());
                    case 'startsWith': return String(value).toLowerCase().startsWith(String(filterValue).toLowerCase());
                    case 'endsWith': return String(value).toLowerCase().endsWith(String(filterValue).toLowerCase());
                    default: return value === filterValue;
                }
            }

            return value === condition;
        });
    });
};

/**
 * Gets unique items by key
 * @param {Array} array - Array
 * @param {string|Function} key - Unique key
 * @returns {Array} Unique items
 */
export const uniqueBy = (array, key) => {
    if (!Array.isArray(array)) return [];

    const seen = new Set();
    const getKey = typeof key === 'function' ? key : (item) => item[key];

    return array.filter(item => {
        const k = getKey(item);
        if (seen.has(k)) return false;
        seen.add(k);
        return true;
    });
};

/**
 * Splits array into chunks
 * @param {Array} array - Array to chunk
 * @param {number} size - Chunk size
 * @returns {Array} Array of chunks
 */
export const chunk = (array, size = 1) => {
    if (!Array.isArray(array)) return [];

    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
        chunks.push(array.slice(i, i + size));
    }
    return chunks;
};

/**
 * Flattens nested arrays
 * @param {Array} array - Array to flatten
 * @param {number} depth - Depth to flatten
 * @returns {Array} Flattened array
 */
export const flatten = (array, depth = Infinity) => {
    if (!Array.isArray(array)) return [];

    return array.reduce((flat, item) => {
        if (Array.isArray(item) && depth > 0) {
            return flat.concat(flatten(item, depth - 1));
        }
        return flat.concat(item);
    }, []);
};

/**
 * Extracts specific property from array of objects
 * @param {Array} array - Array of objects
 * @param {string} key - Property key
 * @returns {Array} Array of values
 */
export const pluck = (array, key) => {
    if (!Array.isArray(array)) return [];
    return array.map(item => item[key]);
};

/**
 * Finds item by ID
 * @param {Array} array - Array to search
 * @param {*} id - ID to find
 * @param {string} idKey - ID property name
 * @returns {*} Found item or undefined
 */
export const findById = (array, id, idKey = 'id') => {
    if (!Array.isArray(array)) return undefined;
    return array.find(item => item[idKey] === id);
};

/**
 * Updates item in array by ID
 * @param {Array} array - Array to update
 * @param {*} id - ID to find
 * @param {Object|Function} updates - Updates to apply
 * @param {string} idKey - ID property name
 * @returns {Array} Updated array
 */
export const updateById = (array, id, updates, idKey = 'id') => {
    if (!Array.isArray(array)) return [];

    return array.map(item => {
        if (item[idKey] !== id) return item;

        const newData = typeof updates === 'function' ? updates(item) : updates;
        return { ...item, ...newData };
    });
};

/**
 * Removes item from array by ID
 * @param {Array} array - Array to modify
 * @param {*} id - ID to remove
 * @param {string} idKey - ID property name
 * @returns {Array} Array without item
 */
export const removeById = (array, id, idKey = 'id') => {
    if (!Array.isArray(array)) return [];
    return array.filter(item => item[idKey] !== id);
};

// ============================================================================
// OBJECT UTILITIES
// ============================================================================

/**
 * Deep clones an object
 * @param {*} obj - Object to clone
 * @returns {*} Cloned object
 */
export const deepClone = (obj) => {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj);
    if (obj instanceof RegExp) return new RegExp(obj);
    if (Array.isArray(obj)) return obj.map(deepClone);

    const cloned = {};
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            cloned[key] = deepClone(obj[key]);
        }
    }
    return cloned;
};

/**
 * Deep merges objects
 * @param {Object} target - Target object
 * @param {...Object} sources - Source objects
 * @returns {Object} Merged object
 */
export const deepMerge = (target, ...sources) => {
    if (!sources.length) return target;

    const result = { ...target };

    sources.forEach(source => {
        if (!source || typeof source !== 'object') return;

        Object.keys(source).forEach(key => {
            const sourceValue = source[key];
            const targetValue = result[key];

            if (Array.isArray(sourceValue)) {
                result[key] = [...sourceValue];
            } else if (sourceValue && typeof sourceValue === 'object' && !Array.isArray(sourceValue)) {
                result[key] = targetValue && typeof targetValue === 'object'
                    ? deepMerge(targetValue, sourceValue)
                    : { ...sourceValue };
            } else {
                result[key] = sourceValue;
            }
        });
    });

    return result;
};

/**
 * Picks specific properties from object
 * @param {Object} obj - Source object
 * @param {Array} keys - Keys to pick
 * @returns {Object} Object with picked keys
 */
export const pick = (obj, keys) => {
    if (!obj || typeof obj !== 'object') return {};

    return keys.reduce((result, key) => {
        if (key in obj) {
            result[key] = obj[key];
        }
        return result;
    }, {});
};

/**
 * Omits specific properties from object
 * @param {Object} obj - Source object
 * @param {Array} keys - Keys to omit
 * @returns {Object} Object without omitted keys
 */
export const omit = (obj, keys) => {
    if (!obj || typeof obj !== 'object') return {};

    const keysSet = new Set(keys);
    return Object.keys(obj).reduce((result, key) => {
        if (!keysSet.has(key)) {
            result[key] = obj[key];
        }
        return result;
    }, {});
};

/**
 * Compares two objects and returns differences
 * @param {Object} obj1 - First object
 * @param {Object} obj2 - Second object
 * @returns {Object} Differences
 */
export const diff = (obj1, obj2) => {
    const changes = {};

    const allKeys = new Set([
        ...Object.keys(obj1 || {}),
        ...Object.keys(obj2 || {})
    ]);

    allKeys.forEach(key => {
        const val1 = obj1?.[key];
        const val2 = obj2?.[key];

        if (val1 !== val2) {
            changes[key] = { from: val1, to: val2 };
        }
    });

    return changes;
};

/**
 * Flattens nested object
 * @param {Object} obj - Object to flatten
 * @param {string} separator - Key separator
 * @returns {Object} Flattened object
 */
export const flattenObject = (obj, separator = '.') => {
    const flattened = {};

    const flatten = (current, prefix = '') => {
        Object.keys(current).forEach(key => {
            const value = current[key];
            const newKey = prefix ? `${prefix}${separator}${key}` : key;

            if (value && typeof value === 'object' && !Array.isArray(value)) {
                flatten(value, newKey);
            } else {
                flattened[newKey] = value;
            }
        });
    };

    flatten(obj);
    return flattened;
};

/**
 * Gets nested property value
 * @param {Object} obj - Object
 * @param {string} path - Property path
 * @param {*} defaultValue - Default value
 * @returns {*} Property value
 */
export const getPath = (obj, path, defaultValue = undefined) => {
    if (!obj || typeof obj !== 'object') return defaultValue;

    const keys = path.split('.');
    let result = obj;

    for (const key of keys) {
        if (result === null || result === undefined) return defaultValue;
        result = result[key];
    }

    return result === undefined ? defaultValue : result;
};

/**
 * Sets nested property value
 * @param {Object} obj - Object
 * @param {string} path - Property path
 * @param {*} value - Value to set
 * @returns {Object} Modified object
 */
export const setPath = (obj, path, value) => {
    const result = { ...obj };
    const keys = path.split('.');
    let current = result;

    for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        if (!current[key] || typeof current[key] !== 'object') {
            current[key] = {};
        } else {
            current[key] = { ...current[key] };
        }
        current = current[key];
    }

    current[keys[keys.length - 1]] = value;
    return result;
};

// ============================================================================
// ID & KEY GENERATION
// ============================================================================

/**
 * Generates unique ID
 * @param {string} type - ID type (uuid, short, timestamp)
 * @returns {string} Generated ID
 */
export const generateId = (type = 'uuid') => {
    switch (type) {
        case 'uuid':
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
                const r = Math.random() * 16 | 0;
                const v = c === 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });

        case 'short':
            return Math.random().toString(36).substring(2, 11);

        case 'timestamp':
            return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

        default:
            return generateId('uuid');
    }
};

/**
 * Generates short readable ID
 * @param {number} length - Length of ID
 * @returns {string} Short ID
 */
export const generateShortId = (length = 8) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
};

/**
 * Generates task key (e.g., PROJ-123)
 * @param {string} projectCode - Project code
 * @param {number} number - Task number
 * @returns {string} Task key
 */
export const generateTaskKey = (projectCode, number) => {
    const code = projectCode.toUpperCase().replace(/[^A-Z0-9]/g, '');
    return `${code}-${number}`;
};

/**
 * Hashes string to consistent number
 * @param {string} str - String to hash
 * @returns {number} Hash value
 */
export const hashString = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return Math.abs(hash);
};

// ============================================================================
// COLOR & UI UTILITIES
// ============================================================================

/**
 * Generates consistent color from string
 * @param {string} str - String to generate color from
 * @param {Object} options - Options
 * @returns {string} Hex color
 */
export const generateColorFromString = (str, options = {}) => {
    const { saturation = 70, lightness = 60 } = options;

    const hash = hashString(str);
    const hue = hash % 360;

    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};

/**
 * Gets contrast color (black or white)
 * @param {string} hexColor - Hex color
 * @returns {string} '#000000' or '#ffffff'
 */
export const getContrastColor = (hexColor) => {
    const hex = hexColor.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    return luminance > 0.5 ? '#000000' : '#ffffff';
};

/**
 * Converts hex to RGB
 * @param {string} hex - Hex color
 * @returns {Object} RGB object
 */
export const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
};

/**
 * Converts RGB to hex
 * @param {number} r - Red
 * @param {number} g - Green
 * @param {number} b - Blue
 * @returns {string} Hex color
 */
export const rgbToHex = (r, g, b) => {
    return '#' + [r, g, b].map(x => {
        const hex = x.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    }).join('');
};

/**
 * Gets color for task status
 * @param {string} status - Task status
 * @returns {string} Color
 */
export const getStatusColor = (status) => {
    const colors = {
        todo: '#94a3b8',
        'in-progress': '#3b82f6',
        'in-review': '#f59e0b',
        done: '#10b981',
        blocked: '#ef4444',
        cancelled: '#6b7280'
    };

    return colors[status?.toLowerCase()] || colors.todo;
};

/**
 * Gets color for priority
 * @param {string} priority - Priority level
 * @returns {string} Color
 */
export const getPriorityColor = (priority) => {
    const colors = {
        critical: '#dc2626',
        high: '#f97316',
        medium: '#eab308',
        low: '#3b82f6',
        trivial: '#94a3b8'
    };

    return colors[priority?.toLowerCase()] || colors.medium;
};

/**
 * Gets initials from name
 * @param {string} name - Full name
 * @param {number} maxChars - Max characters
 * @returns {string} Initials
 */
export const getInitials = (name, maxChars = 2) => {
    if (!name) return '';

    const parts = name.trim().split(/\s+/);

    if (parts.length === 1) {
        return parts[0].substring(0, maxChars).toUpperCase();
    }

    return parts
        .map(part => part[0])
        .join('')
        .substring(0, maxChars)
        .toUpperCase();
};

// ============================================================================
// FILE & UPLOAD UTILITIES
// ============================================================================

/**
 * Formats file size to readable format
 * @param {number} bytes - File size in bytes
 * @param {number} decimals - Decimal places
 * @returns {string} Formatted size
 */
export const formatFileSize = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i];
};

/**
 * Gets file extension
 * @param {string} filename - File name
 * @returns {string} Extension
 */
export const getFileExtension = (filename) => {
    if (!filename) return '';
    const parts = filename.split('.');
    return parts.length > 1 ? parts.pop().toLowerCase() : '';
};

/**
 * Validates file type
 * @param {File} file - File object
 * @param {Array} allowedTypes - Allowed MIME types or extensions
 * @returns {boolean} Valid or not
 */
export const validateFileType = (file, allowedTypes = []) => {
    if (!file) return false;
    if (allowedTypes.length === 0) return true;

    return allowedTypes.some(type => {
        if (type.startsWith('.')) {
            return file.name.toLowerCase().endsWith(type.toLowerCase());
        }
        return file.type === type || file.type.startsWith(type.split('/')[0] + '/');
    });
};

/**
 * Validates file size
 * @param {File} file - File object
 * @param {number} maxSize - Max size in bytes
 * @returns {boolean} Valid or not
 */
export const validateFileSize = (file, maxSize) => {
    if (!file) return false;
    return file.size <= maxSize;
};

/**
 * Checks if file is an image
 * @param {File|string} file - File object or filename
 * @returns {boolean} True if image
 */
export const isImageFile = (file) => {
    if (file instanceof File) {
        return file.type.startsWith('image/');
    }
    const ext = getFileExtension(file);
    return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'].includes(ext);
};

/**
 * Checks if file is a document
 * @param {File|string} file - File object or filename
 * @returns {boolean} True if document
 */
export const isDocumentFile = (file) => {
    if (file instanceof File) {
        const docTypes = ['application/pdf', 'application/msword',
            'application/vnd.openxmlformats-officedocument', 'text/'];
        return docTypes.some(type => file.type.startsWith(type));
    }
    const ext = getFileExtension(file);
    return ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'csv'].includes(ext);
};

/**
 * Generates unique filename
 * @param {string} originalName - Original filename
 * @param {Object} options - Options
 * @returns {string} Unique filename
 */
export const generateFileName = (originalName, options = {}) => {
    const { prefix = '', suffix = '', addTimestamp = true } = options;

    const ext = getFileExtension(originalName);
    const nameWithoutExt = originalName.substring(0, originalName.lastIndexOf('.')) || originalName;
    const cleanName = nameWithoutExt.replace(/[^a-zA-Z0-9-_]/g, '_');

    const parts = [prefix, cleanName];
    if (addTimestamp) parts.push(Date.now());
    if (suffix) parts.push(suffix);

    const finalName = parts.filter(Boolean).join('_');
    return ext ? `${finalName}.${ext}` : finalName;
};

// ============================================================================
// NUMBER & MATH UTILITIES
// ============================================================================

/**
 * Formats currency
 * @param {number} amount - Amount to format
 * @param {Object} options - Format options
 * @returns {string} Formatted currency
 */
export const formatCurrency = (amount, options = {}) => {
    const {
        currency = 'USD',
        locale = 'en-US',
        decimals = 2,
        symbol = true
    } = options;

    const formatted = new Intl.NumberFormat(locale, {
        style: symbol ? 'currency' : 'decimal',
        currency: symbol ? currency : undefined,
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    }).format(amount);

    return formatted;
};

/**
 * Formats number with thousand separators
 * @param {number} num - Number to format
 * @param {Object} options - Format options
 * @returns {string} Formatted number
 */
export const formatNumber = (num, options = {}) => {
    const { locale = 'en-US', decimals = 0 } = options;

    return new Intl.NumberFormat(locale, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    }).format(num);
};

/**
 * Formats as percentage
 * @param {number} value - Value (0-1 or 0-100)
 * @param {Object} options - Format options
 * @returns {string} Formatted percentage
 */
export const formatPercentage = (value, options = {}) => {
    const { decimals = 0, normalize = false } = options;

    const normalized = normalize ? value : value / 100;

    return new Intl.NumberFormat('en-US', {
        style: 'percent',
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    }).format(normalized);
};

/**
 * Calculates percentage
 * @param {number} value - Current value
 * @param {number} total - Total value
 * @param {number} decimals - Decimal places
 * @returns {number} Percentage
 */
export const calculatePercentage = (value, total, decimals = 2) => {
    if (total === 0) return 0;
    return parseFloat(((value / total) * 100).toFixed(decimals));
};

/**
 * Rounds to decimal places
 * @param {number} num - Number to round
 * @param {number} decimals - Decimal places
 * @returns {number} Rounded number
 */
export const roundToDecimal = (num, decimals = 2) => {
    const multiplier = Math.pow(10, decimals);
    return Math.round(num * multiplier) / multiplier;
};

/**
 * Clamps number to range
 * @param {number} num - Number to clamp
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Clamped number
 */
export const clamp = (num, min, max) => {
    return Math.min(Math.max(num, min), max);
};

/**
 * Generates random integer
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Random integer
 */
export const randomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Calculates average
 * @param {Array} numbers - Array of numbers
 * @returns {number} Average
 */
export const average = (numbers) => {
    if (!Array.isArray(numbers) || numbers.length === 0) return 0;
    return numbers.reduce((sum, num) => sum + num, 0) / numbers.length;
};

/**
 * Calculates sum
 * @param {Array} numbers - Array of numbers
 * @returns {number} Sum
 */
export const sum = (numbers) => {
    if (!Array.isArray(numbers)) return 0;
    return numbers.reduce((total, num) => total + num, 0);
};

// ============================================================================
// SEARCH & FILTER UTILITIES
// ============================================================================

/**
 * Fuzzy search in string
 * @param {string} search - Search query
 * @param {string} text - Text to search in
 * @returns {boolean} Match found
 */
export const fuzzySearch = (search, text) => {
    if (!search || !text) return false;

    const searchLower = search.toLowerCase();
    const textLower = text.toLowerCase();

    let searchIndex = 0;

    for (let i = 0; i < textLower.length; i++) {
        if (textLower[i] === searchLower[searchIndex]) {
            searchIndex++;
            if (searchIndex === searchLower.length) return true;
        }
    }

    return false;
};

/**
 * Highlights search terms in text
 * @param {string} text - Text to highlight
 * @param {string} search - Search term
 * @param {string} className - CSS class for highlight
 * @returns {string} HTML with highlights
 */
export const highlightText = (text, search, className = 'highlight') => {
    if (!search || !text) return text;

    const regex = new RegExp(`(${search})`, 'gi');
    return text.replace(regex, `<span class="${className}">$1</span>`);
};

/**
 * Deep searches in object
 * @param {Object} obj - Object to search
 * @param {string} query - Search query
 * @returns {boolean} Match found
 */
export const searchInObject = (obj, query) => {
    if (!query) return true;

    const search = query.toLowerCase();

    const searchRecursive = (value) => {
        if (value === null || value === undefined) return false;

        if (typeof value === 'string') {
            return value.toLowerCase().includes(search);
        }

        if (typeof value === 'number') {
            return value.toString().includes(search);
        }

        if (Array.isArray(value)) {
            return value.some(searchRecursive);
        }

        if (typeof value === 'object') {
            return Object.values(value).some(searchRecursive);
        }

        return false;
    };

    return searchRecursive(obj);
};

// ============================================================================
// STATUS & PROGRESS UTILITIES
// ============================================================================

/**
 * Calculates task progress
 * @param {Array} tasks - Array of tasks
 * @param {Object} options - Options
 * @returns {Object} Progress info
 */
export const calculateProgress = (tasks, options = {}) => {
    const { completedStatuses = ['done', 'completed'] } = options;

    if (!Array.isArray(tasks) || tasks.length === 0) {
        return { total: 0, completed: 0, percentage: 0 };
    }

    const total = tasks.length;
    const completed = tasks.filter(task =>
        completedStatuses.includes(task.status?.toLowerCase())
    ).length;

    return {
        total,
        completed,
        remaining: total - completed,
        percentage: calculatePercentage(completed, total)
    };
};

/**
 * Gets task status based on dates and completion
 * @param {Object} task - Task object
 * @returns {string} Status
 */
export const getTaskStatus = (task) => {
    if (!task) return 'unknown';

    if (task.completed || task.status === 'done') return 'completed';

    const now = new Date();
    const dueDate = task.dueDate ? new Date(task.dueDate) : null;
    const startDate = task.startDate ? new Date(task.startDate) : null;

    if (dueDate && dueDate < now) return 'overdue';
    if (startDate && startDate > now) return 'scheduled';
    if (task.status === 'in-progress') return 'in-progress';

    return 'pending';
};

/**
 * Checks if status transition is valid
 * @param {string} currentStatus - Current status
 * @param {string} newStatus - New status
 * @param {Object} workflow - Workflow configuration
 * @returns {boolean} Valid transition
 */
export const canTransitionStatus = (currentStatus, newStatus, workflow = {}) => {
    const defaultWorkflow = {
        'todo': ['in-progress', 'cancelled'],
        'in-progress': ['in-review', 'blocked', 'todo'],
        'in-review': ['done', 'in-progress'],
        'blocked': ['in-progress', 'cancelled'],
        'done': ['in-progress'],
        'cancelled': ['todo']
    };

    const transitions = workflow[currentStatus] || defaultWorkflow[currentStatus] || [];
    return transitions.includes(newStatus);
};

/**
 * Gets available next statuses
 * @param {string} currentStatus - Current status
 * @param {Object} workflow - Workflow configuration
 * @returns {Array} Available statuses
 */
export const getNextStatuses = (currentStatus, workflow = {}) => {
    const defaultWorkflow = {
        'todo': ['in-progress', 'cancelled'],
        'in-progress': ['in-review', 'blocked', 'todo'],
        'in-review': ['done', 'in-progress'],
        'blocked': ['in-progress', 'cancelled'],
        'done': ['in-progress'],
        'cancelled': ['todo']
    };

    return workflow[currentStatus] || defaultWorkflow[currentStatus] || [];
};

/**
 * Calculates sprint velocity
 * @param {Array} sprints - Array of completed sprints
 * @returns {Object} Velocity metrics
 */
export const calculateSprintVelocity = (sprints) => {
    if (!Array.isArray(sprints) || sprints.length === 0) {
        return { average: 0, trend: 'stable', values: [] };
    }

    const values = sprints.map(s => s.completedPoints || 0);
    const avg = average(values);

    let trend = 'stable';
    if (values.length >= 2) {
        const recent = values.slice(-3);
        const older = values.slice(-6, -3);

        if (older.length > 0) {
            const recentAvg = average(recent);
            const olderAvg = average(older);

            if (recentAvg > olderAvg * 1.1) trend = 'increasing';
            else if (recentAvg < olderAvg * 0.9) trend = 'decreasing';
        }
    }

    return {
        average: roundToDecimal(avg),
        trend,
        values,
        last: values[values.length - 1] || 0
    };
};

// ============================================================================
// DRAG & DROP UTILITIES
// ============================================================================

/**
 * Reorders items in a list
 * @param {Array} list - List to reorder
 * @param {number} startIndex - Start index
 * @param {number} endIndex - End index
 * @returns {Array} Reordered list
 */
export const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
};

/**
 * Moves item between lists
 * @param {Array} source - Source list
 * @param {Array} destination - Destination list
 * @param {number} sourceIndex - Source index
 * @param {number} destIndex - Destination index
 * @returns {Object} Updated lists
 */
export const move = (source, destination, sourceIndex, destIndex) => {
    const sourceClone = Array.from(source);
    const destClone = Array.from(destination);
    const [removed] = sourceClone.splice(sourceIndex, 1);

    destClone.splice(destIndex, 0, removed);

    return {
        source: sourceClone,
        destination: destClone
    };
};

// ============================================================================
// EXPORT & IMPORT UTILITIES
// ============================================================================

/**
 * Exports data to CSV
 * @param {Array} data - Data to export
 * @param {Object} options - Export options
 * @returns {string} CSV string
 */
export const exportToCSV = (data, options = {}) => {
    const { filename = 'export.csv', headers, delimiter = ',' } = options;

    if (!Array.isArray(data) || data.length === 0) return '';

    const cols = headers || Object.keys(data[0]);

    const csvHeaders = cols.join(delimiter);
    const csvRows = data.map(row =>
        cols.map(col => {
            let value = row[col];
            if (value === null || value === undefined) value = '';
            value = String(value).replace(/"/g, '""');
            return `"${value}"`;
        }).join(delimiter)
    );

    return [csvHeaders, ...csvRows].join('\n');
};

/**
 * Exports data to JSON
 * @param {*} data - Data to export
 * @param {Object} options - Export options
 * @returns {string} JSON string
 */
export const exportToJSON = (data, options = {}) => {
    const { pretty = true, indent = 2 } = options;

    return pretty
        ? JSON.stringify(data, null, indent)
        : JSON.stringify(data);
};

/**
 * Parses CSV string
 * @param {string} csv - CSV string
 * @param {Object} options - Parse options
 * @returns {Array} Parsed data
 */
export const parseCSV = (csv, options = {}) => {
    const { delimiter = ',', headers = true } = options;

    if (!csv) return [];

    const lines = csv.split('\n').filter(line => line.trim());
    if (lines.length === 0) return [];

    const parseRow = (row) => {
        const values = [];
        let current = '';
        let inQuotes = false;

        for (let i = 0; i < row.length; i++) {
            const char = row[i];

            if (char === '"') {
                if (inQuotes && row[i + 1] === '"') {
                    current += '"';
                    i++;
                } else {
                    inQuotes = !inQuotes;
                }
            } else if (char === delimiter && !inQuotes) {
                values.push(current);
                current = '';
            } else {
                current += char;
            }
        }
        values.push(current);

        return values;
    };

    const headerRow = headers ? parseRow(lines[0]) : null;
    const dataRows = lines.slice(headers ? 1 : 0).map(parseRow);

    if (!headers) return dataRows;

    return dataRows.map(row => {
        const obj = {};
        headerRow.forEach((header, index) => {
            obj[header.trim()] = row[index] || '';
        });
        return obj;
    });
};

// ============================================================================
// NOTIFICATION UTILITIES
// ============================================================================

/**
 * Extracts @mentions from text
 * @param {string} text - Text to parse
 * @returns {Array} Array of mentions
 */
export const getMentions = (text) => {
    if (!text) return [];

    const mentionRegex = /@(\w+)/g;
    const mentions = [];
    let match;

    while ((match = mentionRegex.exec(text)) !== null) {
        mentions.push(match[1]);
    }

    return [...new Set(mentions)];
};

/**
 * Sanitizes HTML to prevent XSS
 * @param {string} html - HTML to sanitize
 * @returns {string} Sanitized HTML
 */
export const sanitizeHtml = (html) => {
    if (!html) return '';

    const temp = document.createElement('div');
    temp.textContent = html;
    return temp.innerHTML;
};

// ============================================================================
// DEFAULT EXPORT
// ============================================================================

// ============================================================================
// DEFAULT EXPORT
// ============================================================================

export default {
    // Clipboard
    copyToClipboard,

    // String manipulation
    truncate,
    removeExtraSpace,
    slugify,
    maskText,
    capitalize,

    // Browser
    isBrowser,
    scrollToTop,

    // Memory storage (localStorage replacement)
    saveToMemoryStorage,
    getFromMemoryStorage,
    removeFromMemoryStorage,
    clearMemoryStorage,
    hasMemoryStorageKey,
    setMemoryStorageWithExpiry,
    getMemoryStorageWithExpiry,
    safeMemoryStorageGet,
    safeMemoryStorageSet,

    // Authentication & Authorization
    isAuthenticated,
    hasPermission,
    decodeJwt,

    // Validation
    isEmailValid,
    isPhoneNumberValid,
    isEmpty,
    isStrongPassword,

    // Performance
    debounce,
    throttle,
    sleep,

    // Date & Time
    formatDate,
    getRelativeTime,
    calculateDuration,
    isOverdue,
    getBusinessDays,
    addBusinessDays,
    isBusinessDay,
    getWeekNumber,
    getQuarter,

    // Array & Collection
    groupBy,
    sortBy,
    filterBy,
    uniqueBy,
    chunk,
    flatten,
    pluck,
    findById,
    updateById,
    removeById,

    // Object
    deepClone,
    deepMerge,
    pick,
    omit,
    diff,
    flattenObject,
    getPath,
    setPath,

    // ID & Key Generation
    generateId,
    generateShortId,
    generateTaskKey,
    hashString,

    // Color & UI
    generateColorFromString,
    getContrastColor,
    hexToRgb,
    rgbToHex,
    getStatusColor,
    getPriorityColor,
    getInitials,

    // File & Upload
    formatFileSize,
    getFileExtension,
    validateFileType,
    validateFileSize,
    isImageFile,
    isDocumentFile,
    generateFileName,

    // Number & Math
    formatCurrency,
    formatNumber,
    formatPercentage,
    calculatePercentage,
    roundToDecimal,
    clamp,
    randomInt,
    average,
    sum,

    // Search & Filter
    fuzzySearch,
    highlightText,
    searchInObject,

    // Status & Progress
    calculateProgress,
    getTaskStatus,
    canTransitionStatus,
    getNextStatuses,
    calculateSprintVelocity,

    // Drag & Drop
    reorder,
    move,

    // Export & Import
    exportToCSV,
    exportToJSON,
    parseCSV,

    // Notifications
    getMentions,
    sanitizeHtml
};

