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
    sleep
};