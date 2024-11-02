// FeedbackForm.tsx
import React, { useState } from 'react';
import styles from './FeedbackForm.module.scss';
import Button from '../profile/Components/Button.tsx';
import {useNavigate} from 'react-router-dom';

interface FeedbackFormProps {
  teacherName: string;
  groupId: string;
  date: string;
}

const navigate = useNavigate();

const handleMain = () => {
  navigate('/')
}
const FeedbackForm: React.FC<FeedbackFormProps> = ({ teacherName, groupId, date }) => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    group: '',
    teachingQuality: 0,
    materialAccessibility: 0,
    eventQuality: 0,
    comment: '',
    liked: '',
    contact: ''
  });
  
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  
  const handleStarRating = (field: string, rating: number) => {
    setFormData(prev => ({ ...prev, [field]: rating }));
  };
  
  const validateForm = () => {
    const newErrors: Record<string, boolean> = {};
    
    if (!formData.name) newErrors.name = true;
    if (!formData.group) newErrors.group = true;
    if (!formData.teachingQuality) newErrors.teachingQuality = true;
    if (!formData.materialAccessibility) newErrors.materialAccessibility = true;
    if (!formData.eventQuality) newErrors.eventQuality = true;
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Here you would typically send the data to your backend
      console.log('Form submitted:', formData);
      setSubmitted(true);
    }
  };
  
  const renderStars = (field: string, value: number) => {
    return (
      <div className={styles.stars}>
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => handleStarRating(field, star)}
            className={`${styles.star} ${value >= star ? styles.active : ''}`}
          >
            ★
          </button>
        ))}
      </div>
    );
  };
  
  if (submitted) {
    return (
      <div className={styles.thankYouContainer}>
        <h2>Спасибо за ваш отзыв!</h2>
        <p>Узнайте больше о системе оценивания, перейдя на главную страницу.</p>
        <Button text='Перейти на главную' onClick={handleMain} className={styles['button']}/>
      </div>
    );
  }
  
  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2>Отзыв на пару: "Эффективные коммуникации"</h2>
      <p>Преподаватель: {teacherName}</p>
      <p>Группа: {groupId}</p>
      <p>от {date}</p>
      
      <div className={styles.formGroup}>
        <label>Ваше ФИО*</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          className={errors.name ? styles.error : ''}
        />
      </div>
      
      <div className={styles.formGroup}>
        <label>Учебная группа*</label>
        <input
          type="text"
          value={formData.group}
          onChange={(e) => setFormData(prev => ({ ...prev, group: e.target.value }))}
          className={errors.group ? styles.error : ''}
        />
        <span className={styles.example}>Например, АТ-02</span>
      </div>
      
      <div className={styles.formGroup}>
        <label>Оцените качество преподавания*</label>
        {renderStars('teachingQuality', formData.teachingQuality)}
      </div>
      
      <div className={styles.formGroup}>
        <label>Оцените доступность материала*</label>
        {renderStars('materialAccessibility', formData.materialAccessibility)}
      </div>
      
      <div className={styles.formGroup}>
        <label>Оцените качество проведения мероприятия*</label>
        {renderStars('eventQuality', formData.eventQuality)}
      </div>
      
      <div className={styles.formGroup}>
        <label>Комментарий</label>
        <textarea
          value={formData.comment}
          onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))}
        />
      </div>
      
      <div className={styles.formGroup}>
        <label>Что больше всего понравилось на паре?</label>
        <textarea
          value={formData.liked}
          onChange={(e) => setFormData(prev => ({ ...prev, liked: e.target.value }))}
        />
      </div>
      
      <p className={styles.note}>
        Этот ответ увидит преподаватель, но Ваши данные останутся в секрете.
      </p>
      
      <div className={styles.formGroup}>
        <label>Если у Вас возникли вопросы, Вы можете оставить контакт и с вами свяжутся</label>
        <input
          type="text"
          value={formData.contact}
          onChange={(e) => setFormData(prev => ({ ...prev, contact: e.target.value }))}
        />
      </div>
      
      <button type="submit" className={styles.submitButton}>
        Отправить
      </button>
      
      <p className={styles.disclaimer}>
        Важно! Опрос анонимный, Вы можете выражать своё мнение откровенно и без опасений!
      </p>
    </form>
  );
};

export default FeedbackForm;