import React from 'react';

interface SubmitButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
}

export function SubmitButton({ text, ...props }: SubmitButtonProps) {
  return (
    <button
      type="submit"
      {...props}
      className="bg-white text-black font-normal py-1 px-6 rounded-lg border border-gray-200 hover:bg-gray-50 focus:outline-none min-w-[85px] flex items-center justify-center"
    >
      {text}
    </button>
  );
}
