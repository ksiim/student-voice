import React from 'react';

const DateRangePicker: React.FC = () => (
  <div className="flex items-center space-x-2">
    <input type="date" className="border border-gray-300 rounded px-3 py-2" />
    <span>-</span>
    <input type="date" className="border border-gray-300 rounded px-3 py-2" />
  </div>
);

export default DateRangePicker;
