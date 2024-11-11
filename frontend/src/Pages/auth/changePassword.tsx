import React, { useState, useEffect } from 'react';
import styles from './changePassword.module.scss';
import {Logo} from '../../Components/Logo.tsx';
import Button from '../profile/Components/Button.tsx';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import { getToken, setAuthHeader } from '../../../api/serviceToken.js';


const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const navigate = useNavigate();
  
  const handleBack = () => {
    navigate(-1);
  };
  
  const changePassword = async (oldPassword: string, newPassword: string) => {
    try {
      const token = getToken();
      if (token) {
        setAuthHeader(token);
      }
      
      const response = await axios.patch('http://localhost:8000/api/v1/users/me/password', {
        current_password: oldPassword,
        new_password: newPassword,
      });
      
      // Обработка успешного ответа, например, вывод сообщения пользователю
      console.log(response.data);
    } catch (error) {
      // Обработка ошибки, например, вывод сообщения об ошибке пользователю
      console.error(error);
      setError('Ошибка при изменении пароля. Проверьте введенные данные.');
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Новый пароль и его подтверждение не совпадают');
      return;
    }
    changePassword(oldPassword, newPassword);
  };
  
  useEffect(() => {
    const fetchUserEmail = async () => {
      try {
        const token = getToken();
        if (token) {
          setAuthHeader(token);
          const response = await axios.get('http://localhost:8000/api/v1/users/me');
          setUserEmail(response.data.email);
        }
      } catch (error) {
        console.error('Error fetching user email:', error);
      }
    };
    fetchUserEmail();
  }, []);
  
  return (
    <div className={styles['change-password']}>
      <header className={styles.header}>
        <Logo/>
        <div className={styles.headerButtons}>
          <Button text="Назад" onClick={handleBack}/>
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
          
          {error && (
            <div className={styles['change-password__error']}>
              {error}
            </div>
          )}
          
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