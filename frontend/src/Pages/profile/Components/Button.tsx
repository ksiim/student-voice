import React from 'react';
import styles from './Button.module.scss';

interface ButtonProps {
  text: string;
  type?: 'button' | 'submit' | 'reset'; // Добавляем type как опциональное свойство
  className?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const Button: React.FC<ButtonProps> = ({ text, type = 'button', className, onClick }) => {
  return (
    <button
      type={type} // Указываем переданный тип или 'button' по умолчанию
      className={`${styles.button} ${className || ''}`}
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export default Button;
