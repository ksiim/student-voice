import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';
import Dropdown, { Option } from '../profile/Components/Dropdown';
import styles from './CreateLesson.module.scss';
import {Logo} from '../../Components/Logo.tsx';
import Button from '../profile/Components/Button.tsx';

const CreateLesson: React.FC = () => {
  const daysOfWeek = ['пн', 'вт', 'ср', 'чт', 'пт', 'сб'];
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<Option | null>(null);
  const [selectedLessonOdd, setSelectedLessonOdd] = useState<Option | null>(null);
  const [selectedLessonEven, setSelectedLessonEven] = useState<Option | null>(null);
  
  const locationOptions: Option[] = [
    { label: 'Место 1', value: 'location1' },
    { label: 'Место 2', value: 'location2' },
    { label: 'Место 3', value: 'location3' },
  ];
  
  const lessonOptions: Option[] = [
    { label: 'Пара 1', value: 'lesson1' },
    { label: 'Пара 2', value: 'lesson2' },
    { label: 'Пара 3', value: 'lesson3' },
  ];
  
  const handleDayClick = (day: string) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter((d) => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };
  
  return (
    <div className={styles.body}>
      <header className={styles.header}>
        <Logo/>
        <div className={styles.headerButtons}>
          <Button text="Назад"/>
        </div>
      </header>
      
      <div className={styles.container}>
        <h2 className={styles.title}>Создание пары</h2>
        
        <div className={styles.form}>
          {/* Название */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Название:</label>
            <input
              type="text"
              value="Эффективные коммуникации АТ-10"
              className={styles.input}
            />
          </div>
          
          {/* Место проведения */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Место проведения:</label>
            <Dropdown
              label="Выберите место"
              options={locationOptions}
              value={selectedLocation}
              onChange={setSelectedLocation}
            />
          </div>
          
          {/* Дни недели */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Дни:</label>
            <div className={styles.daysGrid}>
              {daysOfWeek.map((day) => (
                <button
                  key={day}
                  className={`${styles.dayButton} ${selectedDays.includes(day) ? styles.dayButtonActive : ''}`}
                  onClick={() => handleDayClick(day)}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>
          
          {/* Пара(нч) */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Пара(нч):</label>
            <Dropdown
              label="Выберите пару"
              options={lessonOptions}
              value={selectedLessonOdd}
              onChange={setSelectedLessonOdd}
            />
          </div>
          
          {/* Пара(чс) */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Пара(чс):</label>
            <Dropdown
              label="Выберите пару"
              options={lessonOptions}
              value={selectedLessonEven}
              onChange={setSelectedLessonEven}
            />
          </div>
          
          {/* Повторение */}
          <div className={styles.formGroup}>
            <p className={styles.label}>Повторяется каждую(-ые)</p>
            <div className={styles.repeatButtons}>
              <button
                className={`${styles.repeatButton} ${styles.repeatButtonActive}`}>
                1 неделю
              </button>
              <button className={styles.repeatButton}>
                2 недели(нч-т)
              </button>
              <button className={styles.repeatButton}>
                2 недели(чет-т)
              </button>
            </div>
          </div>
        </div>
        
        {/* Удалить пару */}
        <div className={styles.deleteContainer}>
          <button className={styles.deleteButton}>
            <span>Удалить пару</span>
            <Trash2 className={styles.icon}/>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateLesson;