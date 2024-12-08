import React from 'react';
import styles from './Logo.module.scss'

const Logo:React.FC = () => {
  return (
    <div>
      <h1 className={styles.heading}>StudentVoice</h1>
    </div>
  );
};

export default Logo;