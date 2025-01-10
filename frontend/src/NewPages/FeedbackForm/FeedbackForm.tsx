import React, { useState, useEffect } from 'react';
import styles from './FeedbackForm.module.scss';
import InputField from '../../NewComponents/InputField/InputField.tsx';
import StarRating from '../../NewComponents/StarRating/StarRating.tsx';
import Button from '../../NewComponents/Button/Button.tsx';
import axios from 'axios';
import { useParams } from 'react-router-dom';

interface Ratings {
  teaching: number;
  availability: number;
  eventQuality: number;
}

const FeedbackForm: React.FC = () => {
  const { class_id } = useParams(); // Извлекаем class_id из URL
  const [ratings, setRatings] = useState<Ratings>({
    teaching: 0,
    availability: 0,
    eventQuality: 0,
  });
  
  const [name, setName] = useState('');
  const [group, setGroup] = useState('');
  const [comment, setComment] = useState('');
  const [interesting, setInteresting] = useState('');
  const [classData, setClassData] = useState<any>(null); // Для хранения данных формы
  const [className, setClassName] = useState(''); // Для хранения имени пары
  
  // Функция для обработки рейтинга
  const handleRatingChange = (category: keyof Ratings) => (value: number) => {
    setRatings(prev => ({
      ...prev,
      [category]: value,
    }));
  };
  
  // Загрузка данных с сервера по class_id для формы
  useEffect(() => {
    if (class_id) {
      const fetchClassData = async () => {
        try {
          const response = await axios.get(`http://localhost:8000/api/v1/backforms/by_class_id/${class_id}`);
          setClassData(response.data); // Сохраняем данные о классе
        } catch (error) {
          console.error('Ошибка при получении данных о классе:', error);
        }
      };
      fetchClassData();
    }
  }, [class_id]);
  
  // Загрузка данных о самой паре
  useEffect(() => {
    if (class_id) {
      const fetchClassName = async () => {
        try {
          const response = await axios.get(`http://localhost:8000/api/v1/classes/${class_id}`);
          setClassName(response.data.name); // Сохраняем имя пары
        } catch (error) {
          console.error('Ошибка при получении данных о паре:', error);
        }
      };
      fetchClassName();
    }
  }, [class_id]);
  
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
          {classData && className ? (
            <>
              <h2 className={styles.feedbackForm__title}>
                Отзыв на пару: <br /> “{className}:{classData.class_theme}”
              </h2>
              {classData.additional_question_1 && (
                <InputField
                  type="textarea"
                  placeholder="Введите"
                  label={classData.additional_question_1}
                  value={interesting}
                  onChange={(e) => setInteresting(e.target.value)}
                  error={''}
                />
              )}
              {/* Вы можете добавить другие вопросы из classData, например: */}
              {classData.additional_question_2 && (
                <InputField
                  type="textarea"
                  placeholder="Введите"
                  label={classData.additional_question_2}
                  value={group}
                  onChange={(e) => setGroup(e.target.value)}
                  error={''}
                />
              )}
              {classData.additional_question_3 && (
                <InputField
                  type="textarea"
                  placeholder="Введите"
                  label={classData.additional_question_3}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  error={''}
                />
              )}
            </>
          ) : (
            <p>Загрузка данных...</p>
          )}
          
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
            <InputField
              type={'input'}
              placeholder={''}
              label={'Комментарий '}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              error={''}
            />
            <div className={styles.feedbackForm__comments__interesting}>
              <InputField
                type={'input'}
                placeholder={''}
                label={'Что самое интересное было на паре?'}
                value={interesting}
                onChange={(e) => setInteresting(e.target.value)}
                error={''}
              />
              <p>Этот отзыв увидит преподаватель, но Ваши данные останутся в секрете</p>
            </div>
          </div>
          
          {/* Добавляем кнопку сабмита */}
          <Button text="Отправить отзыв" type="submit" color="#1E4391" />
          
          <div className={styles.disclaimer}>
            <p>Важно! Опрос анонимный, Вы можете выражать свое мнение откровенно и без опасений!</p>
          </div>
        </div>
      </form>
    </div>
  );
};

export default FeedbackForm;
