import React from 'react';
import styles from './Dropdown.module.scss';

export interface Option {
  label: string;
  value: string;
}

interface DropdownProps {
  label: string;
  options: Option[];
}

const Dropdown: React.FC<DropdownProps> = ({ label, options }) => (
  <div className={styles["dropdown-container"]}>
    <select className={styles.select} defaultValue="">
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

export default Dropdown;
