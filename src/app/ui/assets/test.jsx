'use client';

import React, { useState, useEffect } from 'react';
import { useTextEditor, validateContent, extractText, sanitizeHtml } from '../../scripts/Text.context';
import Text from '../utils/Text.util';
import { AlertCircle, CheckCircle, Clock, Trash2, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ============================================================================
// EXAMPLE 1: Simple Comment Input
// ============================================================================
export const SimpleCommentExample = () => {
  const editor = useTextEditor('simple-comment');
  const [submitted, setSubmitted] = useState(null);

  useEffect(() => {
    editor.register('');
    return () => editor.unregister();
  }, []);

  const handleSubmit = async (html) => {
    try {
      const validation = validateContent(html, {
        minLength: 10,
        maxLength: 5000,
        required: true,
      });

      if (!validation.isValid) {
        alert(validation.errors.join('\n'));
        return;
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSubmitted({
        html,
        text: extractText(html),
        timestamp: new Date(),
      });
    } catch (err) {
      console.error('Submission failed:', err);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 space-y-4">
      <h2 className="text-2xl font-bold text-gray-800">Simple Comment</h2>

      <Text
        placeholder="Share your thoughts..."
        value={editor.content}
        onChange={(content) => editor.updateContent(content)}
        onSubmit={handleSubmit}
        onCancel={() => editor.reset()}
        minHeight="min-h-40"
        submitLabel="Post Comment"
        showActions={true}
      />

      <AnimatePresence>
        {submitted && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3"
          >
            <CheckCircle className="text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-green-800">Comment Posted!</h3>
              <p className="text-sm text-green-700 mt-1">
                {extractText(submitted.html).substring(0, 100)}...
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ============================================================================
// EXAMPLE 2: Advanced Resolution Tracker
// ============================================================================
export const ResolutionTrackerExample = () => {
  const editor = useTextEditor('resolution-tracker');
  const [resolutions, setResolutions] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    editor.register('');
    // Load draft if exists
    const draft = editor.loadDraft();
    if (draft) {
      editor.updateContent(draft.content);
    }
  }, []);

  const handleSubmit = async (html) => {
    const validation = validateContent(html, {
      minLength: 5,
      required: true,
    });

    if (!validation.isValid) {
      alert(validation.errors.join('\n'));
      return;
    }

    const newResolution = {
      id: Date.now(),
      content: html,
      text: extractText(html),
      status: 'open',
      priority: 'medium',
      createdAt: new Date(),
      updatedAt: new Date(),
      comments: [],
    };

    setResolutions((prev) => [newResolution, ...prev]);
    editor.reset();
    editor.clearDraft();
  };

  const updateResolutionStatus = (id, status) => {
    setResolutions((prev) =>
      prev.map((res) =>
        res.id === id ? { ...res, status, updatedAt: new Date() } : res
      )
    );
  };

  const deleteResolution = (id) => {
    setResolutions((prev) => prev.filter((res) => res.id !== id));
  };

  const filteredResolutions = resolutions.filter((res) => {
    if (filter === 'all') return true;
    return res.status === filter;
  });

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Resolution Tracker</h2>
        <p className="text-gray-600">Add and track resolutions with detailed comments</p>
      </div>

      {/* Editor */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700">
          Add New Resolution
        </label>
        <Text
          placeholder="Describe the resolution..."
          value={editor.content}
          onChange={(content) => editor.updateContent(content)}
          onSubmit={handleSubmit}
          onCancel={() => editor.reset()}
          minHeight="min-h-32"
          submitLabel="Add Resolution"
          cancelLabel="Clear"
          showActions={true}
          containerClass="shadow-md"
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap">
        {['all', 'open', 'in-progress', 'resolved'].map((status) => (
          <motion.button
            key={status}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              filter === status
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </motion.button>
        ))}
      </div>

      {/* Resolutions List */}
      <div className="space-y-3">
        <h3 className="font-semibold text-gray-800">
          Resolutions ({filteredResolutions.length})
        </h3>
        <AnimatePresence>
          {filteredResolutions.length > 0 ? (
            filteredResolutions.map((resolution, idx) => (
              <motion.div
                key={resolution.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: idx * 0.05 }}
                className="p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="space-y-3">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <p
                        className="text-sm text-gray-700 line-clamp-2"
                        dangerouslySetInnerHTML={{ __html: resolution.content }}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        {resolution.createdAt.toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => deleteResolution(resolution.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </motion.button>
                    </div>
                  </div>

                  {/* Status Buttons */}
                  <div className="flex gap-2 flex-wrap">
                    {['open', 'in-progress', 'resolved'].map((status) => (
                      <motion.button
                        key={status}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => updateResolutionStatus(resolution.id, status)}
                        className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                          resolution.status === status
                            ? 'bg-blue-100 text-blue-700 border border-blue-300'
                            : 'bg-gray-100 text-gray-600 border border-gray-200'
                        }`}
                      >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-8 text-center text-gray-500 bg-gray-50 rounded-lg"
            >
              <Clock size={32} className="mx-auto mb-2 opacity-50" />
              <p>No resolutions yet. Add one to get started!</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// ============================================================================
// EXAMPLE 3: API Integration with Auto-Save
// ============================================================================
export const APIIntegrationExample = () => {
  const editor = useTextEditor('api-integration');
  const [apiResponse, setApiResponse] = useState(null);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);

  useEffect(() => {
    editor.register('');

    // Setup auto-save every 10 seconds
    if (autoSaveEnabled) {
      const cleanup = editor.setupAutoSave(10000);
      return cleanup;
    }
  }, [autoSaveEnabled]);

  const handleSubmit = async (html) => {
    try {
      // Example API endpoint - replace with your actual endpoint
      const result = await editor.submit(
        html,
        '/api/comments',
        {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer YOUR_TOKEN',
          },
          payload: {
            postId: '123',
            userId: 'user-456',
          },
          timeout: 30000,
          onSuccess: (data) => {
            setApiResponse({
              status: 'success',
              message: 'Comment submitted successfully!',
              data,
            });
          },
          onError: (err) => {
            setApiResponse({
              status: 'error',
              message: err.message,
            });
          },
        }
      );

      return result;
    } catch (err) {
      console.error('Submit error:', err);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">API Integration Example</h2>
        <p className="text-gray-600">Submit to API with auto-save capability</p>
      </div>

      {/* Auto-Save Toggle */}
      <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <input
          type="checkbox"
          checked={autoSaveEnabled}
          onChange={(e) => setAutoSaveEnabled(e.target.checked)}
          className="w-4 h-4"
          id="autosave"
        />
        <label htmlFor="autosave" className="text-sm font-medium text-blue-900">
          Enable Auto-Save (every 10 seconds)
        </label>
      </div>

      {/* Draft Indicator */}
      <AnimatePresence>
        {editor.draft && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center gap-2"
          >
            <Clock size={16} className="text-yellow-600" />
            <p className="text-sm text-yellow-800">
              Draft saved at {new Date(editor.draft.savedAt).toLocaleTimeString()}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Editor */}
      <Text
        placeholder="Write your comment..."
        value={editor.content}
        onChange={(content) => editor.updateContent(content)}
        onSubmit={handleSubmit}
        onCancel={() => editor.reset()}
        minHeight="min-h-40"
        submitLabel={editor.isLoading ? 'Submitting...' : 'Submit to API'}
        disabled={editor.isLoading}
        characterLimit={1000}
        showActions={true}
        containerClass="shadow-lg"
      />

      {/* Error Display */}
      <AnimatePresence>
        {editor.error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3"
          >
            <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-800">Submission Error</h3>
              <p className="text-sm text-red-700">{editor.error}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Display */}
      <AnimatePresence>
        {apiResponse?.status === 'success' && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3"
          >
            <CheckCircle className="text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-green-800">Success!</h3>
              <p className="text-sm text-green-700">{apiResponse.message}</p>
              <pre className="mt-2 text-xs bg-white p-2 rounded overflow-auto max-h-32">
                {JSON.stringify(apiResponse.data, null, 2)}
              </pre>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Submission History */}
      {editor.submission && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-4 bg-gray-50 border border-gray-200 rounded-lg"
        >
          <h3 className="font-semibold text-gray-800 mb-2">Last Submission</h3>
          <p className="text-xs text-gray-600">
            Status: <span className="font-medium">{editor.submission.status}</span>
          </p>
          <p className="text-xs text-gray-600 mt-1">
            Time: {new Date(editor.submission.submittedAt).toLocaleString()}
          </p>
        </motion.div>
      )}
    </div>
  );
};

// ============================================================================
// EXAMPLE 4: Form Integration
// ============================================================================
export const FormIntegrationExample = () => {
  const editor = useTextEditor('form-integration');
  const [formData, setFormData] = useState({
    title: '',
    priority: 'medium',
    tags: '',
  });
  const [submitted, setSubmitted] = useState(null);

  useEffect(() => {
    editor.register('');
  }, []);

  const handleSubmit = async (html) => {
    const validation = validateContent(html, {
      minLength: 20,
      required: true,
    });

    if (!validation.isValid) {
      alert(validation.errors.join('\n'));
      return;
    }

    const payload = {
      ...formData,
      description: html,
      descriptionText: extractText(html),
      tags: formData.tags.split(',').map((t) => t.trim()),
      submittedAt: new Date().toISOString(),
    };

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setSubmitted(payload);
      editor.reset();
      setFormData({ title: '', priority: 'medium', tags: '' });
    } catch (err) {
      console.error('Form submission failed:', err);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Form Integration</h2>
        <p className="text-gray-600">Complete form with rich text editor</p>
      </div>

      <div className="space-y-4">
        {/* Title Input */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Title *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
            placeholder="Enter title"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Priority Select */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Priority
          </label>
          <select
            value={formData.priority}
            onChange={(e) => setFormData((prev) => ({ ...prev, priority: e.target.value }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>

        {/* Tags Input */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Tags (comma-separated)
          </label>
          <input
            type="text"
            value={formData.tags}
            onChange={(e) => setFormData((prev) => ({ ...prev, tags: e.target.value }))}
            placeholder="bug, feature, documentation"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Rich Text Editor */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Description *
          </label>
          <Text
            placeholder="Enter detailed description..."
            value={editor.content}
            onChange={(content) => editor.updateContent(content)}
            onSubmit={handleSubmit}
            onCancel={() => editor.reset()}
            minHeight="min-h-48"
            submitLabel="Submit Form"
            cancelLabel="Reset"
            showActions={true}
            characterLimit={5000}
            containerClass="shadow-md"
          />
        </div>
      </div>

      {/* Submitted Data */}
      <AnimatePresence>
        {submitted && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 bg-green-50 border border-green-200 rounded-lg"
          >
            <h3 className="font-semibold text-green-800 mb-3">Form Submitted!</h3>
            <pre className="bg-white p-3 rounded text-xs overflow-auto max-h-40">
              {JSON.stringify(submitted, null, 2)}
            </pre>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ============================================================================
// EXAMPLE 5: Main Demo Component (Shows All Examples)
// ============================================================================
export default function DemoPage() {
  const [activeExample, setActiveExample] = useState('simple');

  const examples = [
    { id: 'simple', label: 'Simple Comment', component: SimpleCommentExample },
    { id: 'resolution', label: 'Resolution Tracker', component: ResolutionTrackerExample },
    { id: 'api', label: 'API Integration', component: APIIntegrationExample },
    { id: 'form', label: 'Form Integration', component: FormIntegrationExample },
  ];

  const ActiveComponent = examples.find((ex) => ex.id === activeExample)?.component;

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-gray-900">Rich Text Editor Examples</h1>
          <p className="text-gray-600">Explore different use cases and integrations</p>
        </div>

        {/* Example Tabs */}
        <div className="flex gap-2 flex-wrap justify-center">
          {examples.map((example) => (
            <motion.button
              key={example.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveExample(example.id)}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                activeExample === example.id
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-blue-300'
              }`}
            >
              {example.label}
            </motion.button>
          ))}
        </div>

        {/* Active Example */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          key={activeExample}
        >
          {ActiveComponent && <ActiveComponent />}
        </motion.div>
      </div>
    </div>
  );
}