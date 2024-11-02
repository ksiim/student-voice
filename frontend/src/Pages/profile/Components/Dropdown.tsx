import React from 'react';
import styles from './Dropdown.module.scss';

export interface Option {
  label: string;
  value: string;
}

interface DropdownProps {
  label: string;
  options: Option[];
  value: Option | null;
  onChange: (option: Option | null) => void;
}

const Dropdown: React.FC<DropdownProps> = ({ label, options, value, onChange }) => {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOption = options.find((option) => option.value === event.target.value) || null;
    onChange(selectedOption);
  };
  
  return (
    <div className={styles['dropdown-container']}>
      <select className={styles.select} value={value?.value || ''} onChange={handleChange}>
        <option value="" disabled hidden>
          {label}
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Dropdown;