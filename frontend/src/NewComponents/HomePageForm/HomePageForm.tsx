import React, { useState } from 'react';
import axios from 'axios';
import styles from './HomePageForm.module.scss';
import Button from '../Button/Button.tsx';
import InputField from '../InputField/InputField.tsx';

const HomePageForm: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [review, setReview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  // Проверка на заполненность всех полей
  const isFormValid = name.trim() !== '' && email.trim() !== '' && review.trim() !== '';
  
  // Обработка события сабмита
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Отменяем стандартное поведение формы
    
    setLoading(true);
    setError('');
    setSuccess(false);
    
    try {
      // Отправка данных на сервер
      await axios.post('http://localhost:8000/api/v1/users/send_to_admin', {
        name,
        text: review,
        email,
      });
      
      // Успешное выполнение запроса
      setSuccess(true);
      // Очистка всех полей формы
      setName('');
      setEmail('');
      setReview('');
    } catch (err) {
      console.error('Ошибка при отправке данных:', err);
      setError('Не удалось отправить данные. Попробуйте ещё раз.');
    } finally {
      setLoading(false);
    }
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
          <div className={styles.form__actions}>
            <Button
              type="submit"
              text={loading ? 'Отправка...' : 'Отправить'}
              color="#1E4391"
              disabled={!isFormValid || loading} // Кнопка отключается, если форма невалидна или идет загрузка
            />
          </div>
        </div>
        {/* Сообщения об успехе или ошибке */}
        {success && <p className={styles.success}>Ваш отзыв успешно отправлен!</p>}
        {error && <p className={styles.error}>{error}</p>}
      </form>
    </div>
  );
};

export default HomePageForm;
