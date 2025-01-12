import React, { useState, useEffect } from 'react';
import styles from './FeedbackForm.module.scss';
import InputField from '../../NewComponents/InputField/InputField.tsx';
import StarRating from '../../NewComponents/StarRating/StarRating.tsx';
import Button from '../../NewComponents/Button/Button.tsx';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

interface Ratings {
  teaching: number;
  availability: number;
  eventQuality: number;
}

const FeedbackForm: React.FC = () => {
  const { class_id } = useParams();
  const navigate = useNavigate();
  const [ratings, setRatings] = useState<Ratings>({
    teaching: 0,
    availability: 0,
    eventQuality: 0,
  });
  const [name, setName] = useState('');
  const [group, setGroup] = useState('');
  const [comment, setComment] = useState('');
  const [additionalAnswers, setAdditionalAnswers] = useState({
    question1: '',
    question2: '',
    question3: '',
  });
  const [classData, setClassData] = useState<any>(null);
  const [className, setClassName] = useState('');
  const [submitted, setSubmitted] = useState(false);
  
  const handleRatingChange = (category: keyof Ratings) => (value: number) => {
    setRatings((prev) => ({
      ...prev,
      [category]: value,
    }));
  };
  
  useEffect(() => {
    if (class_id) {
      const fetchClassData = async () => {
        try {
          const response = await axios.get(`http://localhost:8000/api/v1/backforms/by_class_id/${class_id}`);
          setClassData(response.data);
        } catch (error) {
          console.error('Ошибка при получении данных о классе:', error);
        }
      };
      fetchClassData();
    }
  }, [class_id]);
  
  useEffect(() => {
    if (class_id) {
      const fetchClassName = async () => {
        try {
          const response = await axios.get(`http://localhost:8000/api/v1/classes/${class_id}`);
          setClassName(response.data.name);
        } catch (error) {
          console.error('Ошибка при получении данных о паре:', error);
        }
      };
      fetchClassName();
    }
  }, [class_id]);
  
  const handleMain = () => {
    navigate('/');
  };
  
  const [error, setError] = useState<string>(''); // Состояние для ошибки
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (
      !name ||
      !group ||
      Object.values(ratings).includes(0) ||
      (classData?.additional_question_1 && !additionalAnswers.question1) ||
      (classData?.additional_question_2 && !additionalAnswers.question2) ||
      (classData?.additional_question_3 && !additionalAnswers.question3)
    ) {
      setError('Пожалуйста, заполните все обязательные поля и поставьте все оценки.');
      return;
    }
    
    setError(''); // Очистить ошибку, если все заполнено
    
    try {
      // Создание отзыва
      await axios.post('http://localhost:8000/api/v1/reviews/', {
        comment,
        teaching_quality: ratings.teaching,
        material_clarity: ratings.availability,
        event_quality: ratings.eventQuality,
        answer_to_question_1: additionalAnswers.question1 || '',
        answer_to_question_2: additionalAnswers.question2 || '',
        answer_to_question_3: additionalAnswers.question3 || '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        class_id,
      });
      
      // Создание посещения
      await axios.post('http://localhost:8000/api/v1/attendances/', {
        student_full_name: name,
        study_group: group,
        class_id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
      
      setSubmitted(true);
    } catch (error) {
      console.error('Ошибка при отправке данных:', error);
      alert('Произошла ошибка при отправке данных. Пожалуйста, попробуйте снова.');
    }
  };
  
  
  if (submitted) {
    return (
      <div className={styles.thankYouContainer}>
        <h1>Student Voice</h1>
        <h2>Спасибо за ваш отзыв!</h2>
        <p>Узнайте больше о системе оценивания, перейдя на главную страницу.</p>
        <Button text="Перейти на главную" onClick={handleMain} />
      </div>
    );
  }
  
  return (
    <div className={styles.feedbackForm}>
      <form className={styles.feedbackForm__form} onSubmit={handleSubmit}>
        <div className={styles.feedbackForm__content}>
          {classData && className ? (
            <>
            <h2 className={styles.feedbackForm__title}>
              Отзыв на пару:
              <br/> {(classData.class_theme === 'Описание пары' || classData.class_theme === null ) ? `“${className}”` : `“${className}: ${classData.class_theme}”`}
            </h2>
            <InputField
              type="input"
              placeholder="Введите ФИО"
              label="ФИО*"
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={''}
            />
            <InputField
              type="input"
              placeholder="Введите учебную группу"
              label="Учебная группа*"
              value={group}
              onChange={(e) => setGroup(e.target.value)}
              error={''}
            />
            <div className={styles.feedbackForm__reviews}>
              <StarRating title="Качество преподавания*"
                          onChange={handleRatingChange('teaching')}/>
              <StarRating title="Доступность материала*"
                          onChange={handleRatingChange('availability')}/>
              <StarRating title="Качество проведения мероприятия*"
                          onChange={handleRatingChange('eventQuality')}/>
            </div>
            <div className={styles.feedbackForm__comments}>
              <InputField
                type={'textarea'}
                placeholder={'Введите'}
                label={'Комментарий'}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                error={''}
              />
              <div className={styles.additional}>
                {classData.additional_question_1 && (
                  <>
                    <InputField
                      type="textarea"
                      placeholder="Введите"
                      label={classData.additional_question_1}
                      value={additionalAnswers.question1}
                      onChange={(e) => setAdditionalAnswers({
                        ...additionalAnswers,
                        question1: e.target.value
                      })}
                      error={''}
                    />
                    <p>Этот отзыв увидит преподаватель, но Ваши данные останутся в
                      секрете</p>
                  </>
                )}
              </div>
                
                <div className={styles.additional}>
                {classData.additional_question_2 && (
                  <>
                    <InputField
                      type="textarea"
                      placeholder="Введите"
                      label={classData.additional_question_2}
                      value={additionalAnswers.question2}
                      onChange={(e) => setAdditionalAnswers({
                        ...additionalAnswers,
                        question2: e.target.value
                      })}
                      error={''}
                    />
                    <p>Этот отзыв увидит преподаватель, но Ваши данные останутся в
                      секрете</p>
                  </>
                )}
              </div>
                
                <div className={styles.additional}>
                {classData.additional_question_3 && (
                  <>
                    <InputField
                      type="textarea"
                      placeholder="Введите"
                      label={classData.additional_question_3}
                      value={additionalAnswers.question3}
                      onChange={(e) => setAdditionalAnswers({
                        ...additionalAnswers,
                        question3: e.target.value
                      })}
                      error={''}
                    />
                    <p>Этот отзыв увидит преподаватель, но Ваши данные останутся в
                      секрете</p>
                  </>
                )}
              </div>
            </div>
              <div className={styles.buttonWrapper}>
                {error && <p className={styles.errorMessage}>{error}</p>}
                <Button text="Отправить отзыв" type="submit" color="#1E4391"/>
              </div>
              <div className={styles.disclaimer}>
                <p>
                  Важно! Опрос анонимный, Вы можете выражать свое мнение
                  откровенно и без опасений!
                </p>
              </div>
            </>
            ) : (
            <p>Загрузка данных...</p>
            )}
            </div>
            </form>
            </div>
            );
          };
          
          export default FeedbackForm;
