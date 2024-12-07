import React from 'react';
import styles from './UserCreation.module.scss'
import {Logo} from '../../Components/Logo.tsx';
import Button from '../profile/Components/Button.tsx';
import RegistrationForm from './Components/RegistrationForm.tsx';

const UserCreation: React.FC = () => {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Logo/>
        <div className={styles.headerButtons}>
          <Button text="Метрики"/>
          <Button text="Выгрузка отчетов"/>
        </div>
      </header>
      
      <div className={styles.contentWrapper}>
        <div className={styles.content}>
          <RegistrationForm />
        </div>
      </div>
    </div>
  );
};

export default UserCreation;