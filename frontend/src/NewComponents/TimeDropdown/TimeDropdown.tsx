import React, { useState } from 'react';
import styles from './TimeDropdown.module.scss';
import ClockIcon from '/assets/images/clock.svg'; // Assuming you've imported the clock icon SVG

interface TimeDropdownProps {
  label?: string;
  placeholder: string;
  options: string[];
  selectedOption: string;
  onOptionSelect: (option: string) => void;
}

const TimeDropdown: React.FC<TimeDropdownProps> = ({
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
    <div className={styles.timeDropdownContainer}>
      {label && (
        <label htmlFor="timeDropdown" className={styles.timeDropdownLabel}>
          {label}
        </label>
      )}
      <div
        id="timeDropdown"
        className={`${styles.timeDropdownHeader} ${isOpen ? styles.open : ''}`}
        onClick={toggleMenu}
      >
        <span className={styles.timeDropdownHeader__value}>
          <span className={styles.timeIcon}>
            <img src={ClockIcon} alt={''} />
          </span>
          {selectedOption || placeholder}
        </span>
      </div>
      {isOpen && (
        <ul className={styles.timeDropdownOptions}>
          {options.map((option) => (
            <li
              key={option}
              className={`${styles.timeDropdownOption}`}
              onClick={() => handleOptionSelect(option)}
            >
              <span className={styles.timeIcon}>
                <img src={ClockIcon} alt={''}/>
              </span>
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TimeDropdown;