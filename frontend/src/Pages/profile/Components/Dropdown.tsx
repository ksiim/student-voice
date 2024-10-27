import React from 'react';

interface Option {
  label: string;
  value: string;
}

interface DropdownProps {
  label: string;
  options: Option[];
}

const Dropdown: React.FC<DropdownProps> = ({ label, options }) => (
  <div className="flex flex-col">
    <label className="text-gray-700">{label}</label>
    <select className="border border-gray-300 rounded px-3 py-2">
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

export default Dropdown;
