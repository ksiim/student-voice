import React, { useState } from 'react';
import styles from './HomePageForm.module.scss';
import Button from '../Button/Button.tsx';
import InputField from '../InputField/InputField.tsx';

const HomePageForm: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [review, setReview] = useState('');
  
  // Проверка на заполненность всех полей
  const isFormValid = name.trim() !== '' && email.trim() !== '' && review.trim() !== '';
  
  // Обработка события сабмита
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Отменяем стандартное поведение формы
    console.log('Submitted Data:', { name, email, review });
    
    // Очистка всех полей формы
    setName('');
    setEmail('');
    setReview('');
  };
  
  return (
    <div className={styles.wrapper}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.form__inputs}>
          <InputField
            label="Имя"
            placeholder="Как мы можем к Вам обращаться"
            type="input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={''}
          />
          <InputField
            label="Email"
            placeholder="IvanovIvan@gmail.com"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={''}
          />
          <InputField
            label="Отзыв"
            placeholder="Введите Ваш вопрос или отзыв"
            type="input"
            value={review}
            onChange={(e) => setReview(e.target.value)}
            error={''}
          />
          <div className="">
            <Button
              type="submit"
              text="Отправить"
              color="#1E4391"
              disabled={!isFormValid} // Кнопка отключается, если форма невалидна
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default HomePageForm;
