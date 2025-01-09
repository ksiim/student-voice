import React, { useState, useEffect } from 'react';
import styles from './TimeDatePicker.module.scss';

const timeOptions = [
  '08:30-10:00',
  '10:15-11:45',
  '12:00-13:30',
  '14:15-15:45',
  '16:00-17:30',
  '17:40-19:10',
  '19:15-20:45',
];

interface TimeDatePickerProps {
  onSurveyTimeChange: (time: string) => void; // Callback для передачи времени окончания
}

const TimeDatePicker: React.FC<TimeDatePickerProps> = ({ onSurveyTimeChange }) => {
  const [classTime, setClassTime] = useState<string>(timeOptions[0]);
  const [classDate, setClassDate] = useState<string>('');
  const [surveyTime, setSurveyTime] = useState<string>(timeOptions[0].split(' - ')[1]);
  const [surveyDate, setSurveyDate] = useState<string>('');
  const [error, setError] = useState<string>('');
  
  // Устанавливаем значения времени и даты окончания
  useEffect(() => {
    if (classTime) {
      const [, endTime] = classTime.split(' - ');
      setSurveyTime(endTime);
      onSurveyTimeChange(endTime); // Передаём новое значение времени в родительский компонент
    }
    if (classDate) {
      setSurveyDate(classDate);
    }
  }, [classTime, classDate, onSurveyTimeChange]);
  
  const handleClassTimeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setClassTime(e.target.value);
    setError('');
  };
  
  const handleClassDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setClassDate(e.target.value);
    setError('');
  };
  
  const handleSurveyTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSurveyTime = e.target.value;
    setSurveyTime(newSurveyTime);
    onSurveyTimeChange(newSurveyTime); // Передаём вручную изменённое время
    setError('');
  };
  
  const handleSurveyDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSurveyDate(e.target.value);
    setError('');
  };
  
  const validateTimes = () => {
    if (classTime && surveyTime && classDate === surveyDate) {
      const classEndTime = classTime.split(' - ')[1];
      if (classEndTime > surveyTime) {
        setError('Время окончания опроса не может быть раньше времени проведения пары');
        return false;
      }
    }
    return true;
  };
  
  return (
    <div className={styles.wrapper}>
      {/* Время и дата проведения пары */}
      <div className={styles.section}>
        <h3 className={styles.title}>Время и дата проведения пары</h3>
        <div className={styles.inputs}>
          <select
            value={classTime}
            onChange={handleClassTimeChange}
            className={styles.timeSelect}
          >
            {timeOptions.map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>
          <input
            type="date"
            value={classDate}
            onChange={handleClassDateChange}
            className={styles.dateInput}
          />
        </div>
      </div>
      
      {/* Время и дата окончания опроса */}
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
      
      {/* Сообщение об ошибке */}
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
};

export default TimeDatePicker;
