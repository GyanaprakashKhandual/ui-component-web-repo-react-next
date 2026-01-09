'use client';

import React, { useRef, useCallback, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';
import Color from '@tiptap/extension-color';
import {TextStyle} from '@tiptap/extension-text-style';
import { 
  Bold, 
  Italic, 
  Underline as UnderlineIcon, 
  List, 
  ListOrdered, 
  Link as LinkIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Strikethrough as StrikethroughIcon,
  Code as CodeIcon,
  Quote,
  Undo2,
  Redo2,
  X,
  HighlighterIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Text = ({
  placeholder = 'Add Description',
  value = '',
  onChange = () => {},
  onSubmit = () => {},
  disabled = false,
  minHeight = 'min-h-48',
  maxHeight = 'max-h-96',
  containerClass = '',
  editorClass = '',
  toolbarClass = '',
  buttonClass = '',
  submitButtonClass = '',
  cancelButtonClass = '',
  showActions = true,
  submitLabel = 'Submit',
  cancelLabel = 'Cancel',
  onCancel = () => {},
  characterLimit = null,
}) => {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        bulletList: {
          HTMLAttributes: {
            class: 'list-disc list-inside ml-4',
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: 'list-decimal list-inside ml-4',
          },
        },
        heading: {
          levels: [1, 2, 3],
          HTMLAttributes: {
            class: 'font-bold',
          },
        },
        codeBlock: {
          HTMLAttributes: {
            class: 'bg-gray-100 rounded p-2 font-mono text-sm',
          },
        },
        blockquote: {
          HTMLAttributes: {
            class: 'border-l-4 border-gray-300 pl-4 italic text-gray-600',
          },
        },
      }),
      Underline,
      Link.configure({
        openOnClick: true,
        HTMLAttributes: {
          class: 'text-blue-500 underline cursor-pointer',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Highlight.configure({
        multicolor: true,
        HTMLAttributes: {
          class: 'bg-yellow-200',
        },
      }),
      Color.configure({
        types: ['textStyle'],
      }),
      TextStyle,
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: `prose prose-sm max-w-none focus:outline-none ${editorClass}`,
      },
    },
  });

  const handleLinkClick = useCallback(() => {
    const url = window.prompt('Enter URL:');
    if (url && editor) {
      editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    }
  }, [editor]);

  const handleColorChange = useCallback((color) => {
    if (editor) {
      editor.chain().focus().setColor(color).run();
    }
  }, [editor]);

  const handleHighlight = useCallback((color) => {
    if (editor) {
      editor.chain().focus().toggleHighlight({ color }).run();
    }
  }, [editor]);

  const handleSubmit = () => {
    if (editor) {
      onSubmit(editor.getHTML());
    }
  };

  const handleCancel = () => {
    onCancel();
  };

  if (!editor) {
    return null;
  }

  const charCount = editor.getText().length;
  const isNearLimit = characterLimit && charCount >= characterLimit * 0.8;
  const isAtLimit = characterLimit && charCount >= characterLimit;

  const ToolbarButton = ({ 
    icon: Icon, 
    onClick, 
    isActive = false, 
    tooltip = '',
    disabled: isDisabled = false 
  }) => (
    <motion.button
      whileHover={{ scale: !isDisabled ? 1.05 : 1 }}
      whileTap={{ scale: !isDisabled ? 0.95 : 1 }}
      onClick={onClick}
      disabled={isDisabled}
      className={`
        p-2 rounded transition-all duration-200
        ${isActive 
          ? 'bg-blue-100 text-blue-600 border border-blue-300' 
          : 'text-gray-600 hover:bg-gray-100 border border-transparent'
        }
        ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${buttonClass}
      `}
      title={tooltip}
    >
      <Icon size={18} />
    </motion.button>
  );

  const ColorPickerButton = ({ 
    icon: Icon, 
    colors, 
    onColorSelect,
    tooltip = ''
  }) => {
    const [showPicker, setShowPicker] = React.useState(false);

    return (
      <div className="relative group">
        <ToolbarButton
          icon={Icon}
          onClick={() => setShowPicker(!showPicker)}
          tooltip={tooltip}
        />
        <AnimatePresence>
          {showPicker && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              className="absolute top-full mt-2 left-0 z-50 bg-white rounded-lg shadow-lg p-3 border border-gray-200"
            >
              <div className="grid grid-cols-4 gap-2">
                {colors.map((color) => (
                  <motion.button
                    key={color}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      onColorSelect(color);
                      setShowPicker(false);
                    }}
                    className={`w-6 h-6 rounded border-2 transition-all ${
                      color === 'transparent' 
                        ? 'border-gray-300 bg-white' 
                        : `border-gray-400 ${color}`
                    }`}
                    style={color !== 'transparent' ? { backgroundColor: color } : {}}
                    title={color}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
        w-full border border-gray-200 rounded-lg overflow-hidden 
        bg-white shadow-sm hover:shadow-md transition-shadow duration-200
        ${containerClass}
      `}
      style={{ pointerEvents: disabled ? 'none' : 'auto', opacity: disabled ? 0.6 : 1 }}
    >
      {/* Toolbar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className={`
          flex flex-wrap items-center gap-1 p-3 bg-gray-50 border-b border-gray-200
          overflow-x-auto ${toolbarClass}
        `}
      >
        {/* Formatting Group */}
        <div className="flex items-center gap-1 p-1 bg-white rounded border border-gray-200">
          <ToolbarButton
            icon={Bold}
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive('bold')}
            tooltip="Bold (Ctrl+B)"
          />
          <ToolbarButton
            icon={Italic}
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive('italic')}
            tooltip="Italic (Ctrl+I)"
          />
          <ToolbarButton
            icon={UnderlineIcon}
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            isActive={editor.isActive('underline')}
            tooltip="Underline (Ctrl+U)"
          />
          <ToolbarButton
            icon={StrikethroughIcon}
            onClick={() => editor.chain().focus().toggleStrike().run()}
            isActive={editor.isActive('strike')}
            tooltip="Strikethrough"
          />
        </div>

        {/* Color & Highlight Group */}
        <div className="flex items-center gap-1 p-1 bg-white rounded border border-gray-200">
          <ColorPickerButton
            icon={Bold}
            colors={['#000000', '#FF0000', '#00AA00', '#0000FF', '#FF6600']}
            onColorSelect={handleColorChange}
            tooltip="Text Color"
          />
          <ColorPickerButton
            icon={HighlighterIcon}
            colors={['#FFFF00', '#FFB3BA', '#BAE1FF', '#BAFFC9', '#FFFFBA']}
            onColorSelect={handleHighlight}
            tooltip="Highlight"
          />
        </div>

        {/* Alignment Group */}
        <div className="flex items-center gap-1 p-1 bg-white rounded border border-gray-200">
          <ToolbarButton
            icon={AlignLeft}
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            isActive={editor.isActive({ textAlign: 'left' })}
            tooltip="Align Left"
          />
          <ToolbarButton
            icon={AlignCenter}
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            isActive={editor.isActive({ textAlign: 'center' })}
            tooltip="Align Center"
          />
          <ToolbarButton
            icon={AlignRight}
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            isActive={editor.isActive({ textAlign: 'right' })}
            tooltip="Align Right"
          />
        </div>

        {/* List Group */}
        <div className="flex items-center gap-1 p-1 bg-white rounded border border-gray-200">
          <ToolbarButton
            icon={List}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            isActive={editor.isActive('bulletList')}
            tooltip="Bullet List"
          />
          <ToolbarButton
            icon={ListOrdered}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            isActive={editor.isActive('orderedList')}
            tooltip="Numbered List"
          />
        </div>

        {/* Block Group */}
        <div className="flex items-center gap-1 p-1 bg-white rounded border border-gray-200">
          <ToolbarButton
            icon={CodeIcon}
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            isActive={editor.isActive('codeBlock')}
            tooltip="Code Block"
          />
          <ToolbarButton
            icon={Quote}
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            isActive={editor.isActive('blockquote')}
            tooltip="Quote"
          />
        </div>

        {/* Link Group */}
        <div className="flex items-center gap-1 p-1 bg-white rounded border border-gray-200">
          <ToolbarButton
            icon={LinkIcon}
            onClick={handleLinkClick}
            isActive={editor.isActive('link')}
            tooltip="Add Link"
          />
        </div>

        {/* Undo/Redo Group */}
        <div className="flex items-center gap-1 p-1 bg-white rounded border border-gray-200 ml-auto">
          <ToolbarButton
            icon={Undo2}
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            tooltip="Undo"
          />
          <ToolbarButton
            icon={Redo2}
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            tooltip="Redo"
          />
        </div>
      </motion.div>

      {/* Editor */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
        className={`
          ${minHeight} ${maxHeight} overflow-y-auto p-4
          ${editorClass}
        `}
      >
        <EditorContent 
          editor={editor} 
          className="text-sm text-gray-700 leading-relaxed"
        />
        {value === '<p></p>' && (
          <p className="text-gray-400 text-sm">{placeholder}</p>
        )}
      </motion.div>

      {/* Footer with Character Count & Actions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          {characterLimit && (
            <motion.div
              animate={{ scale: isAtLimit ? [1, 1.05, 1] : 1 }}
              className={`text-xs font-medium ${
                isAtLimit 
                  ? 'text-red-600' 
                  : isNearLimit 
                  ? 'text-yellow-600' 
                  : 'text-gray-500'
              }`}
            >
              {charCount}/{characterLimit}
            </motion.div>
          )}
        </div>

        {showActions && (
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCancel}
              className={`
                px-4 py-2 rounded text-sm font-medium transition-all
                bg-gray-200 text-gray-700 hover:bg-gray-300
                ${cancelButtonClass}
              `}
            >
              {cancelLabel}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSubmit}
              disabled={isAtLimit}
              className={`
                px-4 py-2 rounded text-sm font-medium transition-all
                bg-blue-500 text-white hover:bg-blue-600 disabled:bg-gray-400
                ${submitButtonClass}
              `}
            >
              {submitLabel}
            </motion.button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default Text;