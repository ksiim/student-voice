// Button.tsx
import React from 'react';
import styles from './Button.module.scss';

interface ButtonProps {
  text: string;
  className?: string; // Для добавления дополнительных классов, если нужно
}

const Button: React.FC<ButtonProps> = ({ text, className }) => {
  return (
    <button className={`${styles.button} ${className}`}>
      {text}
    </button>
  );
};

export default Button;
