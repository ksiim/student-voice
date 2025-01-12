import React, { useState } from 'react';
import { Star } from 'lucide-react';
import styles from './StarRating.module.scss';

interface StarRatingProps {
  title: string;
  onChange: (rating: number) => void;
  initialRating?: number;
  error?: boolean;
}

const StarRating: React.FC<StarRatingProps> = ({
                                                 title,
                                                 onChange,
                                                 initialRating = 0,
                                                 error = false,
                                               }) => {
  const [rating, setRating] = useState(initialRating);
  const [hover, setHover] = useState(0);
  
  const handleRatingClick = (value: number) => {
    setRating(value);
    onChange(value);
  };
  
  return (
    <div className={styles.ratingContainer}>
      <h3 className={styles.title}>{title}</h3>
      <div className={styles.stars}>
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            type="button"
            key={star}
            className={`${styles.star} ${
              star <= (hover || rating) ? styles.active : ''
            } ${error ? styles.error : ''}`}
            onClick={() => handleRatingClick(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
          >
            <Star
              size={20}
              color={
                error
                  ? '#FF4D4F'
                  : star <= (hover || rating)
                    ? '#1E4391'
                    : '#C4C4C4'
              }
              fill={star <= (hover || rating) ? '#1E4391' : 'none'}
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default StarRating;
