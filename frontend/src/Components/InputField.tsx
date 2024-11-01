import React from 'react';

interface InputFieldProps {
  label: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function InputField({ label, type, value, onChange }: InputFieldProps) {
  return (
    <div className="mb-4">
      <label className="block text-gray-700 text-[16px] mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-[16px] shadow-sm focus:outline-none focus:border-blue-500"
      />
    </div>
  );
}
