import React, { useState } from 'react';
import styles from './FeedbackForm.module.scss';
import Button from '../profile/Components/Button.tsx';
import { useNavigate} from 'react-router-dom';

interface FeedbackFormProps {
  teacherName: string;
  groupId: string;
  date: string;
  classId: string;
}

interface ReviewData {
  comment: string;
  teaching_quality: number;
  material_clarity: number;
  event_quality: number;
  created_at: string;
  updated_at: string;
  class_id: string;
}

const FeedbackForm: React.FC<FeedbackFormProps> = ({ teacherName, groupId, date, classId }) => {
  const navigate = useNavigate();
  
  const handleMain = () => {
    navigate('/')
  };
  
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    group: '',
    teachingQuality: 0,
    materialClarity: 0, // Изменено с materialAccessibility на materialClarity
    eventQuality: 0,
    comment: '',
    liked: '',
    contact: ''
  });
  
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [submitError, setSubmitError] = useState<string>('');
  
  const handleStarRating = (field: string, rating: number) => {
    setFormData(prev => ({ ...prev, [field]: rating }));
  };
  
  const validateForm = () => {
    const newErrors: Record<string, boolean> = {};
    
    if (!formData.name) newErrors.name = true;
    if (!formData.group) newErrors.group = true;
    if (!formData.teachingQuality) newErrors.teachingQuality = true;
    if (!formData.materialClarity) newErrors.materialClarity = true; // Изменено
    if (!formData.eventQuality) newErrors.eventQuality = true;
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const prepareReviewData = (): ReviewData => {
    const now = new Date().toISOString();
    const fullComment = [
      formData.comment,
      formData.liked ? `\nПонравилось: ${formData.liked}` : '',
      formData.contact ? `\nКонтакт: ${formData.contact}` : '',
      `\nИмя: ${formData.name}`,
      `\nГруппа: ${formData.group}`
    ].filter(Boolean).join('');
    
    return {
      comment: fullComment,
      teaching_quality: formData.teachingQuality,
      material_clarity: formData.materialClarity, // Используем то же имя что и в форме
      event_quality: formData.eventQuality,
      created_at: now,
      updated_at: now,
      class_id: classId || ''
    };
  };
  
  const submitReview = async (reviewData: ReviewData) => {
    try {
      // 1. Отправка отзыва
      const reviewResponse = await fetch('http://localhost:8000/api/v1/reviews/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reviewData),
      });
      
      if (!reviewResponse.ok) {
        const errorData = await reviewResponse.json();
        console.error('Server error details:', errorData);
        throw new Error(`HTTP error! status: ${reviewResponse.status}\nDetails: ${JSON.stringify(errorData)}`);
      }
      
      const reviewResult = await reviewResponse.json();
      
      // 2. Создание записи о посещении
      const attendanceData = {
        student_full_name: formData.name,
        class_id: classId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      const attendanceResponse = await fetch('http://localhost:8000/api/v1/attendances/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(attendanceData),
      });
      
      if (!attendanceResponse.ok) {
        const errorData = await attendanceResponse.json();
        console.error('Server error details:', errorData);
        throw new Error(`HTTP error! status: ${attendanceResponse.status}\nDetails: ${JSON.stringify(errorData)}`);
      }
      
      const attendanceResult = await attendanceResponse.json();
      
      return { reviewResult, attendanceResult };
    } catch (error) {
      console.error('Error submitting review and creating attendance:', error);
      throw error;
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    
    if (validateForm()) {
      try {
        const reviewData = prepareReviewData();
        console.log('Sending review data:', reviewData);
        await submitReview(reviewData);
        setSubmitted(true);
      } catch (error) {
        setSubmitError('Произошла ошибка при отправке отзыва. Пожалуйста, проверьте данные и попробуйте снова.');
        console.error('Submit error:', error);
      }
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
      
      {submitError && (
        <div className={styles.errorMessage}>
          {submitError}
        </div>
      )}
      
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
        {renderStars('materialClarity', formData.materialClarity)} {/* Изменено имя поля */}
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