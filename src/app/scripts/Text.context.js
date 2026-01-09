'use client';

import React, { createContext, useContext, useState, useCallback, useRef } from 'react';

// Create the context
const TextEditorContext = createContext(undefined);

// Provider Component
export const TextEditorProvider = ({ children }) => {
  const [editors, setEditors] = useState({});
  const [submissions, setSubmissions] = useState({});
  const [loading, setLoading] = useState({});
  const [errors, setErrors] = useState({});
  const [drafts, setDrafts] = useState({});
  const [history, setHistory] = useState({});
  const apiRef = useRef(null);

  // Register editor instance
  const registerEditor = useCallback((editorId, initialContent = '') => {
    setEditors((prev) => ({
      ...prev,
      [editorId]: {
        content: initialContent,
        lastSaved: new Date(),
        isDirty: false,
      },
    }));
  }, []);

  // Update editor content
  const updateEditorContent = useCallback((editorId, content) => {
    setEditors((prev) => ({
      ...prev,
      [editorId]: {
        ...prev[editorId],
        content,
        isDirty: true,
      },
    }));
  }, []);

  // Save draft locally
  const saveDraft = useCallback((editorId, content) => {
    setDrafts((prev) => ({
      ...prev,
      [editorId]: {
        content,
        savedAt: new Date().toISOString(),
      },
    }));

    // Also save to localStorage for persistence
    try {
      localStorage.setItem(
        `editor_draft_${editorId}`,
        JSON.stringify({
          content,
          savedAt: new Date().toISOString(),
        })
      );
    } catch (err) {
      console.warn('Failed to save draft to localStorage:', err);
    }
  }, []);

  // Load draft from localStorage
  const loadDraft = useCallback((editorId) => {
    try {
      const savedDraft = localStorage.getItem(`editor_draft_${editorId}`);
      if (savedDraft) {
        const draft = JSON.parse(savedDraft);
        setDrafts((prev) => ({
          ...prev,
          [editorId]: draft,
        }));
        return draft;
      }
    } catch (err) {
      console.warn('Failed to load draft from localStorage:', err);
    }
    return null;
  }, []);

  // Clear draft
  const clearDraft = useCallback((editorId) => {
    setDrafts((prev) => ({
      ...prev,
      [editorId]: null,
    }));

    try {
      localStorage.removeItem(`editor_draft_${editorId}`);
    } catch (err) {
      console.warn('Failed to clear draft from localStorage:', err);
    }
  }, []);

  // Submit content via API
  const submitContent = useCallback(
    async (editorId, content, apiEndpoint, options = {}) => {
      const {
        method = 'POST',
        headers = {},
        payload = {},
        timeout = 30000,
        onSuccess = () => {},
        onError = () => {},
      } = options;

      setLoading((prev) => ({ ...prev, [editorId]: true }));
      setErrors((prev) => ({ ...prev, [editorId]: null }));

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        const response = await fetch(apiEndpoint, {
          method,
          headers: {
            'Content-Type': 'application/json',
            ...headers,
          },
          body: JSON.stringify({
            ...payload,
            content,
            html: content,
            text: extractText(content),
            submittedAt: new Date().toISOString(),
          }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        // Store submission
        setSubmissions((prev) => ({
          ...prev,
          [editorId]: {
            content,
            response: data,
            submittedAt: new Date().toISOString(),
            status: 'success',
          },
        }));

        // Clear draft on success
        clearDraft(editorId);

        // Update editor state
        setEditors((prev) => ({
          ...prev,
          [editorId]: {
            ...prev[editorId],
            isDirty: false,
            lastSaved: new Date(),
          },
        }));

        onSuccess(data);
        return data;
      } catch (err) {
        const errorMessage = err.message || 'Failed to submit content';

        setErrors((prev) => ({
          ...prev,
          [editorId]: errorMessage,
        }));

        setSubmissions((prev) => ({
          ...prev,
          [editorId]: {
            content,
            error: errorMessage,
            submittedAt: new Date().toISOString(),
            status: 'error',
          },
        }));

        onError(err);
        throw err;
      } finally {
        setLoading((prev) => ({ ...prev, [editorId]: false }));
      }
    },
    []
  );

  // Auto-save to draft periodically
  const setupAutoSave = useCallback((editorId, interval = 30000) => {
    const intervalId = setInterval(() => {
      const editor = editors[editorId];
      if (editor?.isDirty) {
        saveDraft(editorId, editor.content);
      }
    }, interval);

    return () => clearInterval(intervalId);
  }, [editors, saveDraft]);

  // Add to history for tracking changes
  const addToHistory = useCallback((editorId, content) => {
    setHistory((prev) => ({
      ...prev,
      [editorId]: [
        ...(prev[editorId] || []),
        {
          content,
          timestamp: new Date().toISOString(),
        },
      ],
    }));
  }, []);

  // Get history for an editor
  const getHistory = useCallback((editorId) => {
    return history[editorId] || [];
  }, [history]);

  // Reset editor
  const resetEditor = useCallback((editorId) => {
    setEditors((prev) => ({
      ...prev,
      [editorId]: {
        content: '',
        lastSaved: new Date(),
        isDirty: false,
      },
    }));
    setErrors((prev) => ({ ...prev, [editorId]: null }));
    setLoading((prev) => ({ ...prev, [editorId]: false }));
  }, []);

  // Unregister editor (cleanup)
  const unregisterEditor = useCallback((editorId) => {
    setEditors((prev) => {
      const updated = { ...prev };
      delete updated[editorId];
      return updated;
    });
    setSubmissions((prev) => {
      const updated = { ...prev };
      delete updated[editorId];
      return updated;
    });
    setLoading((prev) => {
      const updated = { ...prev };
      delete updated[editorId];
      return updated;
    });
    setErrors((prev) => {
      const updated = { ...prev };
      delete updated[editorId];
      return updated;
    });
    setDrafts((prev) => {
      const updated = { ...prev };
      delete updated[editorId];
      return updated;
    });
    setHistory((prev) => {
      const updated = { ...prev };
      delete updated[editorId];
      return updated;
    });
  }, []);

  // Set API instance for advanced integrations
  const setApiInstance = useCallback((api) => {
    apiRef.current = api;
  }, []);

  const value = {
    editors,
    submissions,
    loading,
    errors,
    drafts,
    history,
    registerEditor,
    updateEditorContent,
    saveDraft,
    loadDraft,
    clearDraft,
    submitContent,
    setupAutoSave,
    addToHistory,
    getHistory,
    resetEditor,
    unregisterEditor,
    setApiInstance,
    apiRef,
  };

  return (
    <TextEditorContext.Provider value={value}>
      {children}
    </TextEditorContext.Provider>
  );
};

// Hook to use the context
export const useTextEditor = (editorId) => {
  const context = useContext(TextEditorContext);

  if (!context) {
    throw new Error('useTextEditor must be used within TextEditorProvider');
  }

  const {
    editors,
    submissions,
    loading,
    errors,
    drafts,
    history,
    registerEditor,
    updateEditorContent,
    saveDraft,
    loadDraft,
    clearDraft,
    submitContent,
    setupAutoSave,
    addToHistory,
    getHistory,
    resetEditor,
    unregisterEditor,
    setApiInstance,
  } = context;

  // Memoized return for the specific editor
  return {
    // State
    content: editors[editorId]?.content || '',
    isDirty: editors[editorId]?.isDirty || false,
    isLoading: loading[editorId] || false,
    error: errors[editorId] || null,
    draft: drafts[editorId] || null,
    submission: submissions[editorId] || null,
    editorHistory: getHistory(editorId),

    // Methods
    updateContent: (content) => updateEditorContent(editorId, content),
    saveDraft: (content) => saveDraft(editorId, content),
    loadDraft: () => loadDraft(editorId),
    clearDraft: () => clearDraft(editorId),
    submit: (content, apiEndpoint, options) =>
      submitContent(editorId, content, apiEndpoint, options),
    setupAutoSave: (interval) => setupAutoSave(editorId, interval),
    addToHistory: (content) => addToHistory(editorId, content),
    reset: () => resetEditor(editorId),
    register: (initialContent) => registerEditor(editorId, initialContent),
    unregister: () => unregisterEditor(editorId),
    setApi: setApiInstance,
  };
};

// Utility function to extract plain text from HTML
export const extractText = (html) => {
  if (!html) return '';
  const div = document.createElement('div');
  div.innerHTML = html;
  return div.textContent || div.innerText || '';
};

// Utility function to sanitize HTML (basic)
export const sanitizeHtml = (html) => {
  const div = document.createElement('div');
  div.innerHTML = html;
  
  // Remove script tags
  const scripts = div.querySelectorAll('script');
  scripts.forEach((script) => script.remove());
  
  // Remove event handlers
  const elements = div.querySelectorAll('*');
  elements.forEach((el) => {
    Array.from(el.attributes).forEach((attr) => {
      if (attr.name.startsWith('on')) {
        el.removeAttribute(attr.name);
      }
    });
  });
  
  return div.innerHTML;
};

// Utility function to validate content
export const validateContent = (content, options = {}) => {
  const {
    minLength = 0,
    maxLength = Infinity,
    required = false,
    allowedTags = [],
  } = options;

  const text = extractText(content);
  const errors = [];

  if (required && text.trim().length === 0) {
    errors.push('Content is required');
  }

  if (text.length < minLength) {
    errors.push(`Content must be at least ${minLength} characters`);
  }

  if (text.length > maxLength) {
    errors.push(`Content must not exceed ${maxLength} characters`);
  }

  return {
    isValid: errors.length === 0,
    errors,
    textLength: text.length,
  };
};