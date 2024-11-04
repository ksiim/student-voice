import React, { useState } from 'react';
import styles from './changePassword.module.scss';
import {Logo} from '../../Components/Logo.tsx';
import Button from '../profile/Components/Button.tsx';

interface ChangePasswordProps {
  onSubmit: (oldPassword: string, newPassword: string) => void;
  userEmail?: string;
}

const ChangePassword = ({ onSubmit, userEmail }: ChangePasswordProps) => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword === confirmPassword) {
      onSubmit(oldPassword, newPassword);
    }
  };
  
  return (
    <div className={styles['change-password']}>
      <header className={styles.header}>
        <Logo/>
        <div className={styles.headerButtons}>
          <Button text="Назад"/>
        </div>
      </header>
      
      <div className={styles['change-password__form-container']}>
        <h1 className={styles['change-password__title']}>
          Смена пароля
        </h1>
        
        <form className={styles['change-password__form']}
              onSubmit={handleSubmit}>
          <div className={styles['change-password__input-group']}>
            <label className={styles['change-password__label']}>
              Введите старый пароль:
            </label>
            <input
              type="password"
              className={styles['change-password__input']}
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
            />
          </div>
          
          <div className={styles['change-password__input-group']}>
            <label className={styles['change-password__label']}>
              Введите новый пароль:
            </label>
            <input
              type="password"
              className={styles['change-password__input']}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          
          <div className={styles['change-password__input-group']}>
            <label className={styles['change-password__label']}>
              Подтвердите новый пароль:
            </label>
            <input
              type="password"
              className={styles['change-password__input']}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          
          <a href="#" className={styles['change-password__forgot-password']}>
            Забыли пароль?
          </a>
          
          <button type="submit"
                  className={styles['change-password__submit-button']}>
            Сохранить изменения
          </button>
        </form>
        
        {userEmail && (
          <p className={styles['change-password__email-text']}>
            Проверьте Вашу почту {userEmail}
          </p>
        )}
      </div>
    </div>
  );
};

export default ChangePassword;