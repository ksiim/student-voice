import React from 'react';
import styles from './Button.module.scss';

interface ButtonProps {
  text: string;
  type?: 'button' | 'submit' | 'reset'; // Добавляем type как опциональное свойство
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  color: string
}

const Button: React.FC<ButtonProps> = ({ text, type = 'button', onClick, color = '#1E4391' }) => {
  return (
    <button
      type={type} // Указываем переданный тип или 'button' по умолчанию
      className={styles.button}
      onClick={onClick}
      style={{ backgroundColor: `${color}` }}
    >
      <span className={styles.button__text}>{text}</span>
    </button>
  );
};

export default Button;
