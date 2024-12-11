import React, { useState } from 'react';
import styles from './CreateClass.module.scss';
import Header from '../../NewComponents/Header/Header_teacher/Header.tsx';
import DropdownMenu from '../../NewComponents/DropdownMenu/DropdownMenu.tsx';
import InputField from '../../NewComponents/InputField/InputField.tsx';
import CreateClassCard from '../../NewComponents/CreateClassCard/CreateClassCard.tsx';
import Button from '../../NewComponents/Button/Button.tsx';
import {useNavigate} from 'react-router-dom';

const options = [
  'Технологии программирования',
  'Операционные системы',
  'Теория вероятностей и математическая статистика',
  'История Российской цивилизации',
  'Базы данных',
  'Системная аналитика',
  'Архитектура ЭВМ',
  'Системный анализ',
];

const CreateClass: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState('');
  const [place, setPlace] = useState('');
  const [groups, setGroups] = useState('');
  const [cards, setCards] = useState<{ day: string; time: string; id: string }[]>([
    { id: crypto.randomUUID(), day: '', time: '' } // Одна пустая карточка по умолчанию
  ]);
  const [repeatFrequency, setRepeatFrequency] = useState<string>('everyWeek');
  const navigate = useNavigate();
  
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
    setCards(
      cards.map((card) =>
        card.id === id ? { ...card, day, time } : card
      )
    );
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
                options={options}
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
          <p className={styles.buttonGroup__title}>Повторяется
            каждую(-ые)
          </p>
          
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
        <div className={styles.bottomButtons}>
          <Button type={'button'} text={'Назад'} color={'#CCCCCC'} onClick={() => navigate(-1)} />
          <div className={styles.bottomButtons__rightSection}>
            <Button type={'button'} text={'Удалить'} color={'#1E4391'} onClick={() => navigate(-1)} />
            <Button type={'button'} text={'Сохранить'} color={'#1E4391'} onClick={() => {}}/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateClass;
