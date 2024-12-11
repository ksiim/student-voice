import React, { useState } from 'react';
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
  
  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
    onCardUpdate(option, selectedTime);
  };
  
  const handleTimeSelect = (timeOption: string) => {
    setSelectedTime(timeOption);
    onCardUpdate(selectedOption, timeOption);
  };
  
  return (
    <div className={styles.wrapper}>
      <div className={styles.wrapper__dropdown}>
        <DropdownMenu
          placeholder={'Выберите'}
          options={weekOptions}
          onOptionSelect={handleOptionSelect}
          selectedOption={selectedOption}
        />
      </div>
      <div className={styles.dateDropdown}>
        <TimeDropdown
          options={timeOptions}
          placeholder={timeOptions[0]}
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