import React, { useState, useEffect } from 'react';
import styles from './CreateClassCard.module.scss';
import DropdownMenu from '../DropdownMenu/DropdownMenu.tsx';
import trashIcon from '/assets/images/trash.svg';
import TimeDropdown from '../TimeDropdown/TimeDropdown.tsx';

const weekOptions = [
  'Понедельник',
  'Вторник',
  'Среда',
  'Четверг',
  'Пятница',
  'Суббота',
];

const timeOptions = [
  ' 8:30 - 10:00',
  '10:15 - 11:45',
  '12:00 - 13:30',
  '14:15 - 15:45',
  '16:00 - 17:30',
  '17:40 - 19:10',
  '19:15 - 20:45',
];

interface CreateClassCardProps {
  day: string;
  time: string;
  onRemove: () => void;
  onCardUpdate: (day: string, time: string) => void;
}

const CreateClassCard: React.FC<CreateClassCardProps> = ({ day, time, onRemove, onCardUpdate }) => {
  const [selectedOption, setSelectedOption] = useState(day);
  const [selectedTime, setSelectedTime] = useState(time);
  
  useEffect(() => {
    if (selectedOption) {
      const nextDate = getNextDate(selectedOption);
      console.log('Next Date:', nextDate);
    }
  }, [selectedOption]);
  
  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
    onCardUpdate(option, selectedTime);
  };
  
  const handleTimeSelect = (timeOption: string) => {
    setSelectedTime(timeOption);
    onCardUpdate(selectedOption, timeOption);
  };
  
  const getNextDate = (day: string): string => {
    const today = new Date();
    const daysOfWeek = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
    const dayIndex = daysOfWeek.indexOf(day);
    
    if (dayIndex === -1) {
      return 'Invalid day'; // Если день введен некорректно
    }
    
    const currentDayIndex = today.getDay() === 0 ? 6 : today.getDay() - 1; // Корректируем, если сегодня воскресенье
    
    let daysDifference = dayIndex - currentDayIndex;
    if (daysDifference <= 0) {
      daysDifference += 7; // Если выбранный день в следующей неделе, прибавляем 7 дней
    }
    
    today.setDate(today.getDate() + daysDifference); // Устанавливаем следующую дату
    return today.t; // Возвращаем объект Date
  };

// Пример использования
  const nextDate = getNextDate('Понедельник'); // Выбираем день для вычисления следующей даты
  const start_time = nextDate; // Устанавливаем start_time в следующую дату
  console.log('Start time:', start_time); // Выводим start_time
  
  
  return (
    <div className={styles.wrapper}>
      <div className={styles.wrapper__dropdown}>
        <DropdownMenu
          placeholder={'Выберите день'}
          options={weekOptions}
          onOptionSelect={handleOptionSelect}
          selectedOption={selectedOption}
        />
      </div>
      <div className={styles.dateDropdown}>
        <TimeDropdown
          options={timeOptions}
          placeholder={'Выберите время'}
          selectedOption={selectedTime}
          onOptionSelect={handleTimeSelect}
        />
      </div>
      <img
        src={trashIcon}
        alt={''}
        onClick={onRemove}
        className={styles.removeIcon}
      />
    </div>
  );
};

export default CreateClassCard;
