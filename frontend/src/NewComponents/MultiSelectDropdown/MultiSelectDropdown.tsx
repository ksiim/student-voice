import React, { useState } from 'react';
import styles from './MultiSelectDropdown.module.scss';

interface MultiSelectDropdownProps {
  label?: string;
  options: string[];
  selectedOptions: string[];
  placeholder?: string; // Добавлено поле для плейсхолдера
  onOptionSelect: (options: string[]) => void;
}

const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({
                                                                   label,
                                                                   options,
                                                                   selectedOptions,
                                                                   placeholder = 'Выберите опции', // Значение по умолчанию
                                                                   onOptionSelect,
                                                                 }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlus, setIsPlus] = useState(true); // Состояние для переключения плюса и крестика
  
  const toggleMenu = () => {
    setIsOpen(!isOpen);
    setIsPlus(!isPlus); // Переключаем состояние плюсика/крестика
  };
  
  const handleOptionSelect = (option: string) => {
    const updatedSelection = selectedOptions.includes(option)
      ? selectedOptions.filter(item => item !== option) // Удаление при повторном выборе
      : [...selectedOptions, option]; // Добавление, если опция не выбрана
    onOptionSelect(updatedSelection);
  };
  
  return (
    <div className={styles.container}>
      {label && <label className={styles.label}>{label}</label>}
      <div className={styles.selectedOptions} onClick={toggleMenu}>
        {selectedOptions.length > 0 ? (
          selectedOptions.map(option => (
            <div
              key={option}
              className={styles.chip}
              onClick={(e) => {
                e.stopPropagation();
                handleOptionSelect(option); // Логика удаления по клику
              }}
            >
              <span className={styles.chipText}>{option}</span>
            </div>
          ))
        ) : (
          <span className={styles.placeholder}>{placeholder}</span> // Отображение плейсхолдера
        )}
        {/* Переключатель в правом верхнем углу */}
        <button
          className={styles.toggleButton}
          onClick={(e) => {
            e.stopPropagation();
            toggleMenu(); // Переключаем состояние меню
          }}
        >
          {/* Плюс или крестик, в зависимости от состояния */}
          <span className={`${isPlus ? styles.plus : styles.hidden}`}>+</span>
          <span className={`${!isPlus ? styles.cross : styles.hidden}`}>×</span>
        </button>
      </div>
      {isOpen && (
        <ul className={styles.dropdown}>
          {options.map(option => (
            <li
              key={option}
              className={`${styles.option} ${
                selectedOptions.includes(option) ? styles.selected : ''
              }`}
              onClick={() => handleOptionSelect(option)}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MultiSelectDropdown;
