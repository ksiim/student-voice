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
  
  // Получение данных из API
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const token = getToken();
        if (token) {
          setAuthHeader(token);
        }
        const response = await axios.get('http://localhost:8000/api/v1/subjects/');
        setSubjects(response.data.data);
      } catch (error) {
        console.error('Ошибка при загрузке списка предметов:', error);
      }
    };
    
    fetchSubjects();
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
  
  const getNextDate = (day: string): Date => {
    const today = new Date();
    const daysOfWeek = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
    const dayIndex = daysOfWeek.indexOf(day);
    
    if (dayIndex === -1) {
      throw new Error('Invalid day'); // Если день введен некорректно
    }
    
    const currentDayIndex = today.getDay() === 0 ? 6 : today.getDay() - 1; // Корректируем для воскресенья
    
    let daysDifference = dayIndex - currentDayIndex;
    if (daysDifference <= 0) {
      daysDifference += 7; // Если выбранный день на следующей неделе, добавляем 7 дней
    }
    
    today.setDate(today.getDate() + daysDifference); // Устанавливаем следующую дату
    return today; // Возвращаем объект Date
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
    
    const subject_id = '5100f637-ec07-4cf0-afbd-49a3efed2ee7';
    const teacher_id = '94b30151-089b-48fc-a85a-620a4ce4831c';
    
    // Парсинг групп: удаление лишних пробелов и фильтрация пустых значений
    const groupList = groups
      .trim()
      .split(/\s+/) // Разделение по пробелам
      .filter((group) => group !== ''); // Удаление пустых значений
    
    if (groupList.length === 0) {
      console.error("Необходимо указать хотя бы одну группу");
      return;
    }
    
    const createRequests = cards.map(async (card) => {
      const [startTimeStr, endTimeStr] = card.time.split(' - ');
      
      const [startHours, startMinutes] = startTimeStr.split(':').map(Number);
      
      const nextDate = getNextDate(card.day);
      const start_time = new Date(nextDate);
      start_time.setHours(startHours, startMinutes, 0, 0);
      start_time.setMinutes(start_time.getMinutes() - start_time.getTimezoneOffset());
      
      if (isNaN(start_time.getTime())) {
        console.error(`Невалидная дата: ${startTimeStr}`);
        return;
      }
      
      const [endHours, endMinutes] = endTimeStr.split(':').map(Number);
      const end_time = new Date(start_time);
      end_time.setHours(endHours, endMinutes, 0, 0);
      end_time.setMinutes(end_time.getMinutes() - end_time.getTimezoneOffset());
      
      if (isNaN(end_time.getTime())) {
        console.error(`Невалидная дата: ${endTimeStr}`);
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
            study_groups: groupList.join(', '), // Преобразуем массив обратно в строку
          },
          {
            headers: { 'Content-Type': 'application/json' },
          }
        );
        
      } catch (error) {
        console.error('Ошибка при создании пары:', error);
      }
    });
    
    await Promise.all(createRequests);
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
                options={subjects.map((subject) => subject.name)} // Подставляем названия предметов
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
