import React, { useState } from 'react';
import styles from './DropdownMenu.module.scss';

interface DropdownMenuProps {
  label?: string; // Лейбл стал необязательным
  placeholder: string;
  options: string[];
  selectedOption: string;
  onOptionSelect: (option: string) => void;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({
                                                     label,
                                                     placeholder,
                                                     options,
                                                     selectedOption,
                                                     onOptionSelect,
                                                   }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  
  const handleOptionSelect = (option: string) => {
    onOptionSelect(option);
    setIsOpen(false);
  };
  
  return (
    <div className={styles.dropdownContainer}>
      {label && ( // Условный рендеринг лейбла
        <label htmlFor="dropdown" className={styles.dropdownLabel}>
          {label}
        </label>
      )}
      <div id="dropdown" className={styles.dropdownHeader} onClick={toggleMenu}>
        <span className={styles.dropdownHeader__value}>{selectedOption || placeholder}</span>
        <span className={`${styles.arrow} ${isOpen ? styles.open : ''}`}>
          ▼
        </span>
      </div>
      {isOpen && (
        <ul className={styles.dropdownOptions}>
          {options.map((option) => (
            <li
              key={option}
              className={`${styles.dropdownOption} ${
                option === selectedOption ? styles.selected : ''
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

export default DropdownMenu;
