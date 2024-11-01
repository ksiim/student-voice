import React from 'react';
import styles from './DateRangePicker.module.scss';

const DateRangePicker: React.FC = () => (
  <div className={styles.container}>
    <input
      type="date"
      className={styles.input}
    />
    <span className={styles.separator}>-</span>
    <input
      type="date"
      className={styles.input}
    />
  </div>
);

export default DateRangePicker;