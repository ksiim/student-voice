import React from 'react';

interface ButtonProps {
  text: string;
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({ text, onClick }) => (
  <button
    onClick={onClick}
    className="px-4 py-2 bg-blue-500 text-white rounded-[16px] hover:bg-blue-600 transition duration-200"
  >
    {text}
  </button>
);

export default Button;
