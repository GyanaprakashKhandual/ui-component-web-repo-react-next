import React from 'react';

// Base Icon Component
const Icon = ({ children, size = 24, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    {children}
  </svg>
);

// Delete Icon
export const DeleteIcon = ({ size, className, strokeWidth = 2, ...props }) => (
  <Icon size={size} className={className} {...props}>
    <path
      d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14zM10 11v6m4-6v6"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Icon>
);

// Edit Icon
export const EditIcon = ({ size, className, strokeWidth = 2, ...props }) => (
  <Icon size={size} className={className} {...props}>
    <path
      d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Icon>
);

// Save Icon
export const SaveIcon = ({ size, className, strokeWidth = 2, ...props }) => (
  <Icon size={size} className={className} {...props}>
    <path
      d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M17 21v-8H7v8M7 3v5h8"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Icon>
);

// Close Icon
export const CloseIcon = ({ size, className, strokeWidth = 2, ...props }) => (
  <Icon size={size} className={className} {...props}>
    <path
      d="M18 6L6 18M6 6l12 12"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Icon>
);

// Arrow Icon (Filled)
export const ArrowIcon = ({ size, className, direction = 'right', ...props }) => {
  const rotation = {
    right: 0,
    down: 90,
    left: 180,
    up: 270
  };

  return (
    <Icon size={size} className={className} {...props}>
      <g transform={`rotate(${rotation[direction]} 12 12)`}>
        <path
          d="M5 12h14m-7-7l7 7-7 7"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="currentColor"
        />
      </g>
    </Icon>
  );
};

// Search Icon
export const SearchIcon = ({ size, className, strokeWidth = 2, ...props }) => (
  <Icon size={size} className={className} {...props}>
    <circle
      cx="11"
      cy="11"
      r="8"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M21 21l-4.35-4.35"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Icon>
);

// Calendar Icon
export const CalendarIcon = ({ size, className, strokeWidth = 2, ...props }) => (
  <Icon size={size} className={className} {...props}>
    <rect
      x="3"
      y="4"
      width="18"
      height="18"
      rx="2"
      ry="2"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M16 2v4M8 2v4M3 10h18"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Icon>
);

// Demo Component
export default function IconDemo() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-slate-800 mb-2">Icon Library</h1>
        <p className="text-slate-600 mb-8">Professional, customizable SVG icons for your application</p>
        
        {/* Size Variations */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">Size Variations</h2>
          <div className="flex items-center gap-6 flex-wrap">
            <div className="text-center">
              <SearchIcon size={16} className="text-blue-600 mx-auto mb-2" />
              <p className="text-xs text-slate-600">16px</p>
            </div>
            <div className="text-center">
              <SearchIcon size={24} className="text-blue-600 mx-auto mb-2" />
              <p className="text-xs text-slate-600">24px</p>
            </div>
            <div className="text-center">
              <SearchIcon size={32} className="text-blue-600 mx-auto mb-2" />
              <p className="text-xs text-slate-600">32px</p>
            </div>
            <div className="text-center">
              <SearchIcon size={48} className="text-blue-600 mx-auto mb-2" />
              <p className="text-xs text-slate-600">48px</p>
            </div>
          </div>
        </div>

        {/* Color Variations */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">Color Variations</h2>
          <div className="flex items-center gap-6 flex-wrap">
            <EditIcon size={32} className="text-blue-600" />
            <EditIcon size={32} className="text-green-600" />
            <EditIcon size={32} className="text-red-600" />
            <EditIcon size={32} className="text-purple-600" />
            <EditIcon size={32} className="text-amber-600" />
            <EditIcon size={32} className="text-slate-800" />
          </div>
        </div>

        {/* All Icons */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">All Icons</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            <div className="flex flex-col items-center p-4 rounded-lg hover:bg-slate-50 transition">
              <DeleteIcon size={32} className="text-slate-700 mb-2" />
              <p className="text-sm font-medium text-slate-700">Delete</p>
            </div>
            <div className="flex flex-col items-center p-4 rounded-lg hover:bg-slate-50 transition">
              <EditIcon size={32} className="text-slate-700 mb-2" />
              <p className="text-sm font-medium text-slate-700">Edit</p>
            </div>
            <div className="flex flex-col items-center p-4 rounded-lg hover:bg-slate-50 transition">
              <SaveIcon size={32} className="text-slate-700 mb-2" />
              <p className="text-sm font-medium text-slate-700">Save</p>
            </div>
            <div className="flex flex-col items-center p-4 rounded-lg hover:bg-slate-50 transition">
              <CloseIcon size={32} className="text-slate-700 mb-2" />
              <p className="text-sm font-medium text-slate-700">Close</p>
            </div>
            <div className="flex flex-col items-center p-4 rounded-lg hover:bg-slate-50 transition">
              <ArrowIcon size={32} className="text-slate-700 mb-2" />
              <p className="text-sm font-medium text-slate-700">Arrow</p>
            </div>
            <div className="flex flex-col items-center p-4 rounded-lg hover:bg-slate-50 transition">
              <SearchIcon size={32} className="text-slate-700 mb-2" />
              <p className="text-sm font-medium text-slate-700">Search</p>
            </div>
            <div className="flex flex-col items-center p-4 rounded-lg hover:bg-slate-50 transition">
              <CalendarIcon size={32} className="text-slate-700 mb-2" />
              <p className="text-sm font-medium text-slate-700">Calendar</p>
            </div>
          </div>
        </div>

        {/* Interactive Buttons */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">Interactive Buttons</h2>
          <div className="flex gap-3 flex-wrap">
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
              <SaveIcon size={20} />
              Save
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition">
              <EditIcon size={20} />
              Edit
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
              <DeleteIcon size={20} />
              Delete
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition">
              <SearchIcon size={20} />
              Search
            </button>
          </div>
        </div>

        {/* Arrow Directions */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">Arrow Directions</h2>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <ArrowIcon size={32} direction="up" className="text-slate-700 mx-auto mb-2" />
              <p className="text-sm text-slate-600">Up</p>
            </div>
            <div className="text-center">
              <ArrowIcon size={32} direction="right" className="text-slate-700 mx-auto mb-2" />
              <p className="text-sm text-slate-600">Right</p>
            </div>
            <div className="text-center">
              <ArrowIcon size={32} direction="down" className="text-slate-700 mx-auto mb-2" />
              <p className="text-sm text-slate-600">Down</p>
            </div>
            <div className="text-center">
              <ArrowIcon size={32} direction="left" className="text-slate-700 mx-auto mb-2" />
              <p className="text-sm text-slate-600">Left</p>
            </div>
          </div>
        </div>

        {/* Usage Code */}
        <div className="bg-slate-800 rounded-lg shadow-sm p-6 mt-6">
          <h2 className="text-xl font-semibold text-white mb-4">Usage Example</h2>
          <pre className="text-green-400 text-sm overflow-x-auto">
{`import { DeleteIcon, EditIcon, SaveIcon } from './icons';

// Basic usage
<DeleteIcon size={24} className="text-red-600" />

// With custom stroke width
<EditIcon size={32} strokeWidth={3} className="text-blue-500" />

// In a button
<button className="flex items-center gap-2">
  <SaveIcon size={20} />
  Save Changes
</button>

// Arrow with direction
<ArrowIcon direction="right" size={24} className="text-gray-700" />`}
          </pre>
        </div>
      </div>
    </div>
  );
}