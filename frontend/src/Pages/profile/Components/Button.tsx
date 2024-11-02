import React from 'react';
import styles from './Button.module.scss';

interface ButtonProps {
  text: string;
  className?: string;
  onClick?: () => void; // Добавляем опциональный обработчик onClick
}

const Button: React.FC<ButtonProps> = ({ text, className, onClick }) => {
  return (
    <button
      className={`${styles.button} ${className || ''}`}
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export default Button;