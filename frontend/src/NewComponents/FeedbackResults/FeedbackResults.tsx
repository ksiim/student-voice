import React from 'react';
import styles from './FeedbackResults.module.scss';
import { Star } from 'lucide-react';

interface Review {
  comment: string;
  teaching_quality: number;
  material_clarity: number;
  event_quality: number;
  answer_to_question_1?: string;
  answer_to_question_2?: string;
  answer_to_question_3?: string;
  id: string;
  class_id: string;
}

interface FeedbackResultsProps {
  reviews: Review[];
}

const FeedbackResults: React.FC<FeedbackResultsProps> = ({ reviews }) => {
  // Подсчет среднего значения рейтингов
  const averageRatings = {
    teachingQuality:
      reviews.reduce((acc, review) => acc + review.teaching_quality, 0) / reviews.length || 0,
    materialClarity:
      reviews.reduce((acc, review) => acc + review.material_clarity, 0) / reviews.length || 0,
    eventQuality:
      reviews.reduce((acc, review) => acc + review.event_quality, 0) / reviews.length || 0,
  };
  
  // Функция для отображения звезд
  const renderStars = (rating: number) => {
    const wholeStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    return (
      <div className={styles.rating__stars}>
        {[...Array(5)].map((_, index) => (
          <Star
            size={36}
            key={index}
            className={`${styles.star} ${
              index < wholeStars
                ? styles.star_filled
                : index === wholeStars && hasHalfStar
                  ? styles.star_half
                  : styles.star_empty
            }`}
          />
        ))}
        <span className={styles.rating__value}>{rating.toFixed(1)}</span>
      </div>
    );
  };
  
  return (
    <div className={styles.wrapper}>
      {/* Раздел со средними оценками */}
      <div className={styles.section}>
        <div className={styles.rating}>
          <div className={styles.rating__row}>
            <span className={styles.rating__label}>Качество преподавания</span>
            {renderStars(averageRatings.teachingQuality)}
          </div>
          <div className={styles.rating__row}>
            <span className={styles.rating__label}>Доступность материала</span>
            {renderStars(averageRatings.materialClarity)}
          </div>
          <div className={styles.rating__row}>
            <span className={styles.rating__label}>Качество проведения мероприятия</span>
            {renderStars(averageRatings.eventQuality)}
          </div>
        </div>
      </div>
      
      {/* Раздел с комментариями */}
      <div className={styles.section}>
        <h2 className={styles.section__title}>Комментарии</h2>
        <div className={`${styles.comments__list} ${styles.items}`}>
          <ul>
            {reviews.map((review, index) => (
              <li key={index} className={styles.comments__item}>
                <p className={styles.comments__text}>{review.comment}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default FeedbackResults;
