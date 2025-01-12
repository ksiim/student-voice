import React, { useState, useEffect } from 'react';
import { Clock, Calendar } from 'lucide-react';
import styles from './ClassListDateTimePicker.module.scss';

interface ClassListDateTimePickerProps {
  onRangeChange?: (range: {
    startTime: string;
    startDate: string;
    endTime: string;
    endDate: string;
  }) => void;
}

const timeOptions = [
  '08:30',
  '10:15',
  '12:00',
  '14:15',
  '16:00',
  '17:40',
  '19:15',
  '20:45'
];

const ClassListDateTimePicker: React.FC<ClassListDateTimePickerProps> = ({ onRangeChange }) => {
  const [range, setRange] = useState({
    startTime: '08:30',
    startDate: '',
    endTime: '20:45',
    endDate: ''
  });
  const [error, setError] = useState<string>('');
  
  useEffect(() => {
    validateRange();
    onRangeChange?.(range);
  }, [range]);
  
  const handleChange = (field: keyof typeof range, value: string) => {
    setRange(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const validateRange = () => {
    if (range.startDate && range.endDate) {
      if (range.startDate > range.endDate) {
        setError('Дата начала не может быть позже даты окончания');
        return false;
      }
      if (range.startDate === range.endDate && range.startTime > range.endTime) {
        setError('Время начала не может быть позже времени окончания');
        return false;
      }
    }
    setError('');
    return true;
  };
  
  return (
    <div className={styles.wrapper}>
      <div className={styles.label}>Период</div>
      <div className={styles.inputs}>
        <div className={styles.inputGroup}>
          <div className={styles.inputWrapper}>
            <Clock className={styles.icon} size={24} />
            <select
              value={range.startTime}
              onChange={(e) => handleChange('startTime', e.target.value)}
              className={styles.timeSelect}
            >
              {timeOptions.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.inputWrapper}>
            <Calendar className={styles.icon} size={24} />
            <input
              type="date"
              value={range.startDate}
              onChange={(e) => handleChange('startDate', e.target.value)}
              className={styles.dateInput}
            />
          </div>
        </div>
        
        <span className={styles.separator}>-</span>
        
        <div className={styles.inputGroup}>
          <div className={styles.inputWrapper}>
            <Clock className={styles.icon} size={24} />
            <select
              value={range.endTime}
              onChange={(e) => handleChange('endTime', e.target.value)}
              className={styles.timeSelect}
            >
              {timeOptions.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.inputWrapper}>
            <Calendar className={styles.icon} size={24} />
            <input
              type="date"
              value={range.endDate}
              onChange={(e) => handleChange('endDate', e.target.value)}
              className={styles.dateInput}
            />
          </div>
        </div>
      </div>
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
};

export default ClassListDateTimePicker;