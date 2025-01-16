import React, { useState, useEffect } from 'react';
import styles from './CreateClass.module.scss';
import Header from '../../NewComponents/Header/Header_teacher/Header.tsx';
import DropdownMenu from '../../NewComponents/DropdownMenu/DropdownMenu.tsx';
import InputField from '../../NewComponents/InputField/InputField.tsx';
import CreateClassCard from '../../NewComponents/CreateClassCard/CreateClassCard.tsx';
import Button from '../../NewComponents/Button/Button.tsx';
import { setAuthHeader, getToken } from '../../../public/serviceToken.js';
import axios from 'axios';

const CreateClass: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState('');
  const [place, setPlace] = useState('');
  const [groups, setGroups] = useState('');
  const [cards, setCards] = useState<{ day: string; time: string; id: string }[]>([
    { id: crypto.randomUUID(), day: '', time: '' },
  ]);
  const [repeatFrequency, setRepeatFrequency] = useState<string>('everyWeek');
  const [subjects, setSubjects] = useState<{ name: string; id: string }[]>([]);
  const [teacherId, setTeacherId] = useState<string>('');
  
  // Add a function to reset form data
  const resetFormData = () => {
    setSelectedOption('');
    setPlace('');
    setGroups('');
    setCards([{ id: crypto.randomUUID(), day: '', time: '' }]);
    setRepeatFrequency('everyWeek');
  };
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = getToken();
        if (token) {
          setAuthHeader(token);
        }
        
        const [subjectsResponse, teacherResponse] = await Promise.all([
          axios.get('http://localhost:8000/api/v1/subjects/'),
          axios.get('http://localhost:8000/api/v1/users/me'),
        ]);
        
        setSubjects(subjectsResponse.data.data);
        setTeacherId(teacherResponse.data.id);
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
      }
    };
    
    fetchData();
  }, []);
  
  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
  };
  
  const addCard = () => {
    const newCard = { id: crypto.randomUUID(), day: '', time: '' };
    setCards([...cards, newCard]);
  };
  
  const removeCard = (id: string) => {
    setCards(cards.filter((card) => card.id !== id));
  };
  
  const updateCard = (id: string, day: string, time: string) => {
    setCards(cards.map((card) => (card.id === id ? { ...card, day, time } : card)));
  };
  
  const getNextDate = (day: string, weekOffset: number = 0): Date => {
    const today = new Date();
    const daysOfWeek = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
    const dayIndex = daysOfWeek.indexOf(day);
    
    if (dayIndex === -1) {
      throw new Error('Invalid day');
    }
    
    const currentDayIndex = today.getDay() === 0 ? 6 : today.getDay() - 1;
    
    let daysDifference = dayIndex - currentDayIndex;
    if (daysDifference <= 0) {
      daysDifference += 7;
    }
    
    daysDifference += weekOffset * 7;
    
    const nextDate = new Date(today);
    nextDate.setDate(today.getDate() + daysDifference);
    return nextDate;
  };
  
  const createClassForDate = async (
    baseDate: Date,
    card: { day: string; time: string; id: string },
    groupList: string[],
    subject_id: string,
    teacher_id: string
  ) => {
    const [startTimeStr, endTimeStr] = card.time.split(' - ');
    const [startHours, startMinutes] = startTimeStr.split(':').map(Number);
    
    const start_time = new Date(baseDate);
    start_time.setHours(startHours, startMinutes, 0, 0);
    start_time.setMinutes(start_time.getMinutes() - start_time.getTimezoneOffset());
    
    const [endHours, endMinutes] = endTimeStr.split(':').map(Number);
    const end_time = new Date(start_time);
    end_time.setHours(endHours, endMinutes, 0, 0);
    end_time.setMinutes(end_time.getMinutes() - end_time.getTimezoneOffset());
    
    if (isNaN(start_time.getTime()) || isNaN(end_time.getTime())) {
      console.error('Невалидное время');
      return;
    }
    
    try {
      await axios.post(
        'http://localhost:8000/api/v1/classes/',
        {
          name: selectedOption,
          description: 'Описание пары',
          start_time: start_time.toISOString(),
          end_time: end_time.toISOString(),
          place: place,
          subject_id,
          teacher_id,
          study_groups: groupList.join(', '),
        },
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
    } catch (error) {
      console.error('Ошибка при создании пары:', error);
      throw error; // Propagate the error
    }
  };
  
  const createClass = async () => {
    if (!selectedOption || !place || !groups.trim()) {
      console.error("Все поля обязательны для заполнения");
      return;
    }
    
    const token = getToken();
    if (token) {
      setAuthHeader(token);
    }
    
    const selectedSubject = subjects.find(subject => subject.name === selectedOption);
    if (!selectedSubject) {
      console.error("Не выбран корректный предмет");
      return;
    }
    
    const groupList = groups
      .trim()
      .split(/\s+/)
      .filter((group) => group !== '');
    
    if (groupList.length === 0) {
      console.error("Необходимо указать хотя бы одну группу");
      return;
    }
    
    const weekOffsets = [];
    switch (repeatFrequency) {
      case 'everyWeek':
        weekOffsets.push(0, 1, 2, 3, 4);
        break;
      case 'evenWeeks':
        weekOffsets.push(1, 3, 5, 7, 9);
        break;
      case 'oddWeeks':
        weekOffsets.push(0, 2, 4, 6, 8);
        break;
    }
    
    try {
      for (const card of cards) {
        for (const weekOffset of weekOffsets) {
          const baseDate = getNextDate(card.day, weekOffset);
          await createClassForDate(baseDate, card, groupList, selectedSubject.id, teacherId);
        }
      }
      // Reset form data after successful creation
      resetFormData();
    } catch (error) {
      console.error("Ошибка при создании пар:", error);
    }
  };
  
  return (
    <div className={styles.wrapper}>
      <Header />
      <div className={styles.content}>
        <h2 className={styles.content__title}>Создание пары</h2>
        
        <div className={styles.content__form}>
          <div className={styles.inputs}>
            <div className={styles.inputs__item}>
              <DropdownMenu
                label="Название предмета"
                placeholder="Выберите"
                options={subjects.map((subject) => subject.name)}
                selectedOption={selectedOption}
                onOptionSelect={handleOptionSelect}
              />
            </div>
            <div className={styles.inputs__item}>
              <InputField
                label={'Место проведения пары'}
                type={'input'}
                placeholder={'Введите'}
                value={place}
                onChange={(e) => setPlace(e.target.value)}
                error={''}
              />
            </div>
            <div className={styles.inputs__item}>
              <InputField
                label={'Учебная(-ые) группа(-ы)'}
                type={'input'}
                placeholder={'Введите'}
                value={groups}
                onChange={(e) => setGroups(e.target.value)}
                error={''}
              />
            </div>
          </div>
          <div className={styles.dateInfo}>
            <h3 className={styles.dateInfo__title}>Дни</h3>
            <div className={styles.dayPicker}>
              {cards.map((card) => (
                <CreateClassCard
                  key={card.id}
                  day={card.day}
                  time={card.time}
                  onRemove={() => removeCard(card.id)}
                  onCardUpdate={(day, time) => updateCard(card.id, day, time)}
                />
              ))}
              {cards.length < 3 && (
                <button className={styles.addButton} onClick={addCard}>
                  Добавить +
                </button>
              )}
            </div>
          </div>
        </div>
        <fieldset className={styles.buttonGroup}>
          <p className={styles.buttonGroup__title}>Повторяется каждую(-ые)</p>
          
          <div className={styles.buttonGroup__radioButton}>
            <input
              type="radio"
              id="everyWeek"
              name="repeatFrequency"
              value="everyWeek"
              checked={repeatFrequency === 'everyWeek'}
              onChange={() => setRepeatFrequency('everyWeek')}
            />
            <label htmlFor="everyWeek">Неделю</label>
          </div>
          
          <div className={styles.buttonGroup__radioButton}>
            <input
              type="radio"
              id="evenWeeks"
              name="repeatFrequency"
              value="evenWeeks"
              checked={repeatFrequency === 'evenWeeks'}
              onChange={() => setRepeatFrequency('evenWeeks')}
            />
            <label htmlFor="evenWeeks">2 недели (четные)</label>
          </div>
          
          <div className={styles.buttonGroup__radioButton}>
            <input
              type="radio"
              id="oddWeeks"
              name="repeatFrequency"
              value="oddWeeks"
              checked={repeatFrequency === 'oddWeeks'}
              onChange={() => setRepeatFrequency('oddWeeks')}
            />
            <label htmlFor="oddWeeks">2 недели (нечетные)</label>
          </div>
        </fieldset>
        
        <Button onClick={createClass} text={'Создать'} />
      </div>
    </div>
  );
};

export default CreateClass;