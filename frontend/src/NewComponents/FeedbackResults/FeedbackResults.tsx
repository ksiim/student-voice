import React from 'react';
import { Star } from 'lucide-react';
import styles from './FeedbackResults.module.scss';

const FeedbackResults: React.FC = () => {
  const feedbackData = {
    averageRatings: {
      teachingQuality: 4.2,
      materialAccessibility: 3.8,
      eventQuality: 4.5
    },
    comments: [
      {
        text: "Материал объясняется слишком быстро, было сложно следить за логикой объяснения.",
        rating: 3
      },
      {
        text: "Красно, что преподаватель уделяет время каждому, кто не успевает разобраться. Это очень помогает.",
        rating: 5
      },
      {
        text: "Спасибо за структурированный подход к занятию, было легко следовать теме и задавать вопросы!",
        rating: 4
      },
      {
        text: "Не хватает дополнительного материала",
        rating: 3
      },
      {
        text: "Красно, что преподаватель уделяет время каждому, кто не успевает разобраться. Это очень помогает.",
        rating: 5
      },
      {
        text: "Спасибо за структурированный подход к занятию, было легко следовать теме и задавать вопросы!",
        rating: 4
      },{
        text: "Красно, что преподаватель уделяет время каждому, кто не успевает разобраться. Это очень помогает.",
        rating: 5
      },
      {
        text: "Спасибо за структурированный подход к занятию, было легко следовать теме и задавать вопросы!",
        rating: 4
      }
    ]
  };
  
  const renderStars = (rating: number) => {
    const wholeStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    return (
      <div className={styles.rating__stars}>
        {[...Array(5)].map((_, index) => (
          <Star
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
        <span className={styles.rating__value}>
          {rating.toFixed(1)}
        </span>
      </div>
    );
  };
  
  return (
    <div className={styles.wrapper}>
      {/* Average Ratings Section */}
      <div className={styles.section}>
        <div className={styles.rating}>
          <div className={styles.rating__row}>
            <span className={styles.rating__label}>Качество преподавания</span>
            {renderStars(feedbackData.averageRatings.teachingQuality)}
          </div>
          <div className={styles.rating__row}>
            <span className={styles.rating__label}>Доступность материла</span>
            {renderStars(feedbackData.averageRatings.materialAccessibility)}
          </div>
          <div className={styles.rating__row}>
            <span className={styles.rating__label}>Качество проведения мероприятия</span>
            {renderStars(feedbackData.averageRatings.eventQuality)}
          </div>
        </div>
      </div>
      
      {/* Comments Section */}
      <div className={styles.section}>
        <h2 className={styles.section__title}>Комментарии</h2>
        <div className={`${styles.comments__list} ${styles.items}`}>
          <ul>
            {feedbackData.comments.map((comment, index) => (
              <li key={index} className={styles.comments__item}>
                <p className={styles.comments__text}>{comment.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default FeedbackResults;