'use client'
import React, { useState } from 'react';
import DateTimePicker from '../utils/Date.util';

const DateDemo = () => {
  const [date1, setDate1] = useState(null);
  const [date2, setDate2] = useState(new Date());
  const [date3, setDate3] = useState(null);
  const [date4, setDate4] = useState(null);
  const [date5, setDate5] = useState(null);
  const [date6, setDate6] = useState(null);
  const [date7, setDate7] = useState(null);
  const [date8, setDate8] = useState(null);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-black mb-2">Smart Date & Time Picker</h1>
          <p className="text-gray-600 text-lg">GitHub-style dropdowns with auto-positioning and keyboard navigation. Test edge cases with multiple pickers placed around the viewport.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3 bg-blue-50 p-2 rounded">Top-Left Corner</h3>
            <DateTimePicker
              label="Top-Left Test"
              placeholder="Select date and time"
              value={date1}
              onChange={setDate1}
              showTime={true}
              helperText="Tests top-left positioning"
            />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3 bg-blue-50 p-2 rounded">Top-Right Corner</h3>
            <DateTimePicker
              label="Top-Right Test"
              placeholder="Select date and time"
              value={date2}
              onChange={setDate2}
              showTime={true}
              helperText="Tests top-right positioning"
            />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3 bg-green-50 p-2 rounded">Center-Left</h3>
            <DateTimePicker
              label="Center-Left Test"
              placeholder="Select date"
              value={date3}
              onChange={setDate3}
              showTime={false}
              helperText="Date selection only"
            />
          </div>

          <div className="ml-50">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 bg-green-50 p-2 rounded">Center-Right</h3>
            <DateTimePicker
              label="Center-Right Test"
              placeholder="Restricted range"
              value={date4}
              onChange={setDate4}
              minDate={new Date()}
              maxDate={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)}
              helperText="Next 30 days only"
              className="w-full"
            />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3 bg-purple-50 p-2 rounded">Bottom-Left</h3>
            <DateTimePicker
              label="Bottom-Left Test"
              placeholder="Select date and time"
              value={date5}
              onChange={setDate5}
              showTime={true}
              helperText="Tests bottom-left positioning"
            />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3 bg-purple-50 p-2 rounded">Bottom-Right</h3>
            <DateTimePicker
              label="Bottom-Right Test"
              placeholder="Select date and time"
              value={date6}
              onChange={setDate6}
              showTime={true}
              helperText="Tests bottom-right positioning"
            />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3 bg-gray-100 p-2 rounded">Disabled State</h3>
            <DateTimePicker
              label="Disabled Picker"
              placeholder="Disabled picker"
              disabled
              helperText="Cannot be modified"
            />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3 bg-gray-100 p-2 rounded">Read-Only State</h3>
            <DateTimePicker
              label="Read-Only Picker"
              placeholder="Select date"
              value={date7}
              onChange={setDate7}
              readOnly
              helperText="View only mode"
            />
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h2 className="text-lg font-semibold mb-4">Full Width Picker</h2>
          <DateTimePicker
            label="Wide Picker for Right-Edge Testing"
            placeholder="Select date and time - positioned at bottom to test right edge behavior"
            value={date8}
            onChange={setDate8}
            showTime={true}
            helperText="This picker should auto-position left when near right viewport edge"
          />
        </div>
        
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h2 className="text-xl font-semibold mb-4">Selected Values</h2>
          <div className="space-y-2 text-sm font-mono bg-gray-50 p-4 rounded">
            <div><span className="font-bold">Top-Left:</span> {date1 ? date1.toString() : 'Not selected'}</div>
            <div><span className="font-bold">Top-Right:</span> {date2 ? date2.toString() : 'Not selected'}</div>
            <div><span className="font-bold">Center-Left:</span> {date3 ? date3.toString() : 'Not selected'}</div>
            <div><span className="font-bold">Center-Right:</span> {date4 ? date4.toString() : 'Not selected'}</div>
            <div><span className="font-bold">Bottom-Left:</span> {date5 ? date5.toString() : 'Not selected'}</div>
            <div><span className="font-bold">Bottom-Right:</span> {date6 ? date6.toString() : 'Not selected'}</div>
            <div><span className="font-bold">Full Width:</span> {date8 ? date8.toString() : 'Not selected'}</div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h2 className="text-xl font-semibold mb-4">Features & Edge Cases Tested</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm space-y-2">
            <div>✓ Smart auto-positioning (detects viewport boundaries)</div>
            <div>✓ <span className="font-semibold">Fixed horizontal left/right positioning</span></div>
            <div>✓ GitHub-style searchable dropdowns</div>
            <div>✓ Keyboard navigation (Enter, Escape, Search)</div>
            <div>✓ Auto-focus on dropdown open</div>
            <div>✓ Optional time picker</div>
            <div>✓ Min/max date constraints</div>
            <div>✓ Clear button for reset</div>
            <div>✓ Smooth animations</div>
            <div>✓ Fully responsive</div>
            <div>✓ <span className="font-semibold">Top-left corner positioning</span></div>
            <div>✓ <span className="font-semibold">Bottom-right corner positioning</span></div>
            <div>✓ <span className="font-semibold">Center viewport handling</span></div>
            <div>✓ Production-ready</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DateDemo;