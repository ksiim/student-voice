import React, { useState } from 'react';
import styles from './LoginPage.module.scss';
import Logo from '../../NewComponents/Logo/Logo.tsx';
import InputField from '../../NewComponents/InputField/InputField.tsx';
import Button from '../../NewComponents/Button/Button.tsx';
import axios from 'axios';
import { saveToken, setAuthHeader } from '../../../public/serviceToken.js';
import { Navigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [popupMessage, setPopupMessage] = useState<string | null>(null);
  
  const showPopup = (message: string) => {
    setPopupMessage(message);
    setTimeout(() => {
      setPopupMessage(null);
    }, 3000); // Скрыть popup через 3 секунды
  };
  
  const handleForgotPassword = async () => {
    if (!email) {
      showPopup('Введите email для восстановления пароля');
      setEmailError('Введите email для восстановления пароля');
      return;
    }
    
    try {
      const params = new URLSearchParams();
      params.append('email', email);
      params.append('password', password);
      params.append('title', 'Восстановление пароля');
      
      await axios.get(
        'http://localhost:8000/api/v1/users/send_new_password_on_mail',
        { params }
      );
      
      showPopup('Новый пароль выслан на вашу почту');
    } catch (error: any) {
      if (error.response?.status === 401) {
        showPopup('Ошибка авторизации при восстановлении пароля');
      } else {
        showPopup('Ошибка при восстановлении пароля');
      }
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError(null);
    setPasswordError(null);
    
    if (!email) {
      showPopup('Введите email');
      setEmailError('Введите email');
      return;
    }
    
    if (!password) {
      showPopup('Введите пароль');
      setPasswordError('Введите пароль');
      return;
    }
    
    try {
      const data = new URLSearchParams();
      data.append('grant_type', 'password');
      data.append('username', email);
      data.append('password', password);
      data.append('scope', '');
      data.append('client_id', 'string');
      data.append('client_secret', 'string');
      
      const response = await axios.post(
        'http://localhost:8000/api/v1/login/access-token',
        data,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );
      
      const token = response.data.access_token;
      
      if (token) {
        saveToken(token);
        setAuthHeader(token);
        
        const userResponse = await axios.get('http://localhost:8000/api/v1/users/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        const role = userResponse.data.role_id;
        setUserRole(role);
        setIsAuthenticated(true);
      }
    } catch (error: any) {
      if (error.response) {
        const status = error.response.status;
        if (status === 401) {
          showPopup('Неверный email или пароль');
          setEmailError('Неверный email или пароль');
        } else {
          showPopup('Ошибка сервера. Попробуйте позже');
        }
      } else {
        showPopup('Ошибка подключения. Проверьте интернет-соединение');
      }
    }
  };
  
  if (isAuthenticated) {
    if (userRole === 'ae5f0d8a-f385-4253-9a14-99c12cf0feb0') {
      return <Navigate to="/users" />;
    }
    return <Navigate to="/profile" />;
  }
  
  return (
    <div className={styles.wrapper}>
      <div className={styles.leftSection}>
        <Logo />
        <form onSubmit={handleSubmit} className={styles.form}>
          <h2 className={styles.form__heading}>Вход в профиль</h2>
          <div className={styles.form__inputs}>
            <InputField
              label="Email"
              placeholder="IvanovIvan@urfu.me"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={emailError}
            />
            <InputField
              label="Пароль/временный пароль"
              placeholder="password123"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={passwordError}
            />
            <div className="">
              <Button type={'submit'} text={'Войти'} color={'#1E4391'} />
            </div>
          </div>
          <div className={styles.form__forgot}>
            <a href="#" onClick={handleForgotPassword}>
              Забыли пароль?
            </a>
          </div>
        </form>
      </div>
      
      <div className={styles.rightSection}>
        <img
          className={styles.pattern__image}
          src="/assets/images/login_bg.jpg"
          alt="Фоновое изображение в стиле Ирит-ртф"
        />
      </div>
      
      {popupMessage && (
        <div className={`${styles.popup} ${styles.popup_visible}`}>
          <p>{popupMessage}</p>
        </div>
      )}
    </div>
  );
};

export default LoginPage;