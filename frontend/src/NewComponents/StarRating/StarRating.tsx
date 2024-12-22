import React, { useState } from 'react';
import styles from './StarRating.module.scss';

interface StarRatingProps {
  title: string;
  onChange: (rating: number) => void;
  initialRating?: number;
  error?: boolean;
}

const StarIcon = ({
                    filled,
                    error,
                  }: {
  filled: boolean;
  error?: boolean;
}) => {
  if (error) {
    // Иконка ошибки
    return (
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`${styles.starIcon} ${styles.errorIcon}`}
      >
        <circle cx="8" cy="8" r="8" fill="#FF4D4F" />
        <path
          d="M8 4.66667V8.66667"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <circle cx="8" cy="11.3333" r="0.666667" fill="white" />
      </svg>
    );
  }
  
  if (filled) {
    // Активная звезда
    return (
      <svg
        width="16"
        height="17"
        viewBox="0 0 16 17"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={styles.starIcon}
      >
        <path
          d="M6.09307 0.952503C6.45149 0.180863 7.54851 0.180865 7.90694 0.952505L9.12569 3.57632C9.26654 3.87954 9.54961 4.09232 9.88004 4.14334L12.7011 4.57887C13.5024 4.70259 13.8311 5.67847 13.2679 6.26177L11.1518 8.45335C10.933 8.67994 10.8338 8.99636 10.884 9.30731L11.3729 12.3364C11.5062 13.1618 10.628 13.7765 9.89806 13.3688L7.48767 12.0224C7.18459 11.8531 6.81541 11.8531 6.51233 12.0224L4.10195 13.3688C3.37205 13.7765 2.49382 13.1618 2.62706 12.3364L3.11603 9.30731C3.16623 8.99636 3.06699 8.67994 2.8482 8.45335L0.732129 6.26177C0.16892 5.67847 0.497598 4.70259 1.29894 4.57887L4.11996 4.14334C4.45039 4.09232 4.73346 3.87954 4.87431 3.57631L6.09307 0.952503Z"
          fill="#1E4391"
        />
      </svg>
    );
  }
  
  // Неактивная звезда
  return (
    <svg
      width="16"
      height="17"
      viewBox="0 0 16 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={styles.starIcon}
    >
      <path
        d="M11.7731 15.6132C11.4198 15.6132 10.9664 15.4999 10.3998 15.1665L8.40642 13.9865C8.19975 13.8665 7.79975 13.8665 7.59975 13.9865L5.59975 15.1665C4.41975 15.8666 3.72642 15.5866 3.41309 15.3599C3.10642 15.1332 2.62642 14.5532 2.93975 13.2199L3.41309 11.1732C3.46642 10.9599 3.35975 10.5932 3.19975 10.4332L1.54642 8.77988C0.719753 7.95322 0.78642 7.24655 0.899753 6.89988C1.01309 6.55322 1.37309 5.93988 2.51975 5.74655L4.64642 5.39322C4.84642 5.35988 5.13309 5.14655 5.21975 4.96655L6.39975 2.61322C6.93309 1.53988 7.63309 1.37988 7.99975 1.37988C8.36642 1.37988 9.06642 1.53988 9.59975 2.61322L10.7731 4.95988C10.8664 5.13988 11.1531 5.35322 11.3531 5.38655L13.4798 5.73988C14.6331 5.93322 14.9931 6.54655 15.0998 6.89322C15.2064 7.23988 15.2731 7.94655 14.4531 8.77322L12.7998 10.4332C12.6398 10.5932 12.5398 10.9532 12.5864 11.1732L13.0598 13.2199C13.3664 14.5532 12.8931 15.1332 12.5864 15.3599C12.4198 15.4799 12.1531 15.6132 11.7731 15.6132ZM7.99975 12.8932C8.32642 12.8932 8.65309 12.9732 8.91309 13.1266L10.9064 14.3065C11.4864 14.6532 11.8531 14.6532 11.9931 14.5532C12.1331 14.4532 12.2331 14.0999 12.0864 13.4466L11.6131 11.3999C11.4864 10.8465 11.6931 10.1332 12.0931 9.72655L13.7464 8.07322C14.0731 7.74655 14.2198 7.42655 14.1531 7.20655C14.0798 6.98655 13.7731 6.80655 13.3198 6.73322L11.1931 6.37988C10.6798 6.29322 10.1198 5.87988 9.88642 5.41322L8.71309 3.06655C8.49975 2.63988 8.23309 2.38655 7.99975 2.38655C7.76642 2.38655 7.49975 2.63988 7.29309 3.06655L6.11309 5.41322C5.87975 5.87988 5.31975 6.29322 4.80642 6.37988L2.68642 6.73322C2.23309 6.80655 1.92642 6.98655 1.85309 7.20655C1.77975 7.42655 1.93309 7.75322 2.25975 8.07322L3.91309 9.72655C4.31309 10.1265 4.51975 10.8465 4.39309 11.3999L3.91975 13.4466C3.76642 14.1066 3.87309 14.4532 4.01309 14.5532C4.15309 14.6532 4.51309 14.6465 5.09975 14.3065L7.09309 13.1266C7.34642 12.9732 7.67309 12.8932 7.99975 12.8932Z"
        fill="white"
        stroke="#222222"
        strokeWidth="1.5"
      />
    </svg>
  );
};


const StarRating: React.FC<StarRatingProps> = ({
                                                 title,
                                                 onChange,
                                                 initialRating = 0,
                                                 error = false
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
            <StarIcon
              filled={star <= (hover || rating)}
              error={error}
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default StarRating;