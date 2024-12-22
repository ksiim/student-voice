import React, { useState } from 'react';
import styles from './FeedbackForm.module.scss';
import InputField from '../../NewComponents/InputField/InputField.tsx';
import StarRating from '../../NewComponents/StarRating/StarRating.tsx';
import Button from '../../NewComponents/Button/Button.tsx';

interface Ratings {
  teaching: number;
  availability: number;
  eventQuality: number;
}

const FeedbackForm: React.FC = () => {
  const [ratings, setRatings] = useState<Ratings>({
    teaching: 0,
    availability: 0,
    eventQuality: 0,
  });
  
  const [name, setName] = useState('');
  const [group, setGroup] = useState('');
  const [comment, setComment] = useState('');
  const [interesting, setInteresting] = useState('');
  
  const handleRatingChange = (category: keyof Ratings) => (value: number) => {
    setRatings(prev => ({
      ...prev,
      [category]: value,
    }));
  };
  
  // Обработчик отправки формы
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Отменяем стандартное поведение формы
    // Тут можно отправить данные на сервер или обработать их
    console.log({
      name,
      group,
      ratings,
      comment,
      interesting,
    });
  };
  
  return (
    <div className={styles.feedbackForm}>
      <form className={styles.feedbackForm__form} onSubmit={handleSubmit}>
        <div className={styles.feedbackForm__content}>
          <h2 className={styles.feedbackForm__title}>
            Отзыв на пару:<br /> “Технологии программирования: Обзор языка”
          </h2>
          
          <div className={styles.feedbackForm__inputs}>
            <InputField type={'input'} placeholder={'Введите'} label={'Ваше ФИО*'} value={name} onChange={(e) => setName(e.target.value)} error={''} />
            <InputField type={'input'} placeholder={'Например, АТ-01'} label={'Учебная группа*'} value={group} onChange={(e) => setGroup(e.target.value)} error={''} />
          </div>
          
          <div className={styles.feedbackForm__reviews}>
            <StarRating
              title="Качество преподавания*"
              onChange={handleRatingChange('teaching')}
            />
            <StarRating
              title="Доступность материала*"
              onChange={handleRatingChange('availability')}
            />
            <StarRating
              title="Качество проведения мероприятия*"
              onChange={handleRatingChange('eventQuality')}
            />
          </div>
          
          <div className={styles.feedbackForm__comments}>
            <InputField type={'input'} placeholder={''} label={'Комментарий '} value={comment} onChange={(e) => setComment(e.target.value)} error={''} />
            <div className={styles.feedbackForm__comments__interesting}>
              <InputField type={'input'} placeholder={''} label={'Что самое интересное было на паре?'} value={interesting} onChange={(e) => setInteresting(e.target.value)} error={''} />
              <p>Этот отзыв увидит преподаватель, но Ваши данные останутся в секрете</p>
            </div>
          </div>
          
          {/* Добавляем кнопку сабмита */}
          <Button text="Отправить отзыв" type="submit" color="#1E4391"/>
          
          <div className={styles.disclaimer}>
            <p>Важно! Опрос анонимный, Вы можете выражать свое мнение откровенно и без опасений!</p>
          </div>
        </div>
      </form>
    </div>
  );
};

export default FeedbackForm;
