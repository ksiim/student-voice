import React, { useState, useEffect, useCallback } from 'react';
import styles from './TimeDatePicker.module.scss';

interface TimeDatePickerProps {
  initialTime: {
    start_time: string;
    end_time: string;
  };
  onSurveyTimeChange: (time: string) => void;
  surveyEndTime?: string;
}

const parseTime = (isoString: string = ''): string => {
  try {
    const date = new Date(isoString);
    const hours = String(date.getHours()).padStart(2, '0'); // Локальное время
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const time = `${hours}:${minutes}`;
    
    if (!/^([01]?[0-9]|2[0-3]):([0-5][0-9])$/.test(time)) {
      throw new Error('Invalid time format');
    }
    return time;
  } catch {
    return '00:00';
  }
};


const parseDate = (isoString: string = ''): string => {
  try {
    const date = new Date(isoString);
    const formattedDate = date.getFullYear() + '-' +
      String(date.getMonth() + 1).padStart(2, '0') + '-' +
      String(date.getDate()).padStart(2, '0'); // Локальное время
    
    if (!/^\d{4}-\d{2}-\d{2}$/.test(formattedDate)) {
      throw new Error('Invalid date format');
    }
    return formattedDate;
  } catch {
    return new Date().toISOString().slice(0, 10);
  }
};


const addMinutes = (time: string, minutes: number): string => {
  const [hours, mins] = time.split(':').map(Number);
  const date = new Date();
  date.setHours(hours, mins + minutes); // Локальное время
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
};


const TimeDatePicker: React.FC<TimeDatePickerProps> = ({ initialTime, onSurveyTimeChange, surveyEndTime }) => {
  const initialStartTime = parseTime(initialTime.start_time);
  const initialEndTime = parseTime(initialTime.end_time);
  const initialDate = parseDate(initialTime.start_time);
  
  const [classStartTime, setClassStartTime] = useState(initialStartTime);
  const [classEndTime, setClassEndTime] = useState(initialEndTime);
  const [classDate, setClassDate] = useState(initialDate);
  const [surveyTime, setSurveyTime] = useState(addMinutes(initialEndTime, 15));
  const [surveyDate, setSurveyDate] = useState(initialDate);
  const [error, setError] = useState('');
  
  useEffect(() => {
    if (initialTime.start_time && initialTime.end_time) {
      setClassStartTime(parseTime(initialTime.start_time));
      setClassEndTime(parseTime(initialTime.end_time));
      setClassDate(parseDate(initialTime.start_time));
    }
  }, [initialTime]);
  
  useEffect(() => {
    if (surveyEndTime) {
      setSurveyTime(surveyEndTime);
    }
  }, [surveyEndTime]);
  
  useEffect(() => {
    const newSurveyTime = addMinutes(classEndTime, 15);
    setSurveyTime(newSurveyTime);
    setSurveyDate(classDate);
    onSurveyTimeChange(newSurveyTime);
  }, [classEndTime, classDate]);
  
  const handleClassDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setClassDate(e.target.value);
    setError('');
  };
  
  const handleSurveyTimeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newSurveyTime = e.target.value;
    setSurveyTime(newSurveyTime);
    onSurveyTimeChange(newSurveyTime);
    setError('');
  }, [onSurveyTimeChange]);
  
  const handleSurveyDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSurveyDate(e.target.value);
    setError('');
  };
  
  const validateTimes = () => {
    if (classDate === surveyDate) {
      if (classEndTime > surveyTime) {
        setError('Время окончания опроса не может быть раньше времени проведения пары');
        return false;
      }
    }
    return true;
  };
  
  return (
    <div className={styles.wrapper}>
      <div className={styles.section}>
        <h3 className={styles.title}>Время и дата проведения пары</h3>
        <div className={styles.inputs}>
          <input
            type="text"
            value={`${classStartTime}-${classEndTime}`}
            className={styles.timeSelect}
            disabled
          />
          <input
            type="date"
            value={classDate}
            onChange={handleClassDateChange}
            className={styles.dateSelect}
            disabled
          />
        </div>
      </div>
      
      <div className={styles.section}>
        <h3 className={styles.title}>Время и дата окончания опроса</h3>
        <div className={styles.inputs}>
          <input
            type="time"
            value={surveyTime}
            onChange={handleSurveyTimeChange}
            className={styles.timeInput}
          />
          <input
            type="date"
            value={surveyDate}
            onChange={handleSurveyDateChange}
            className={styles.dateInput}
            onBlur={validateTimes}
          />
        </div>
      </div>
      
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
};

export default TimeDatePicker;