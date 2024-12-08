import React from 'react';
import styles from './InfoPopUp.module.scss'


interface InfoPopUpProps{
  title: string;
  description?: string;
  onClose: () => void;
}
const InfoPopUp: React.FC<InfoPopUpProps> = ({title, description, onClose }) => {
  return (
    <div className={styles.popup}>
      <div className={styles.popupContent}>
        <h2 className={styles.title}>{title}</h2>
        {description && <p className={styles.desc}>{description}</p>}
        <button className={styles.okButton} onClick={onClose}>
          ОК
        </button>
      </div>
    </div>
  );
};

export default InfoPopUp;