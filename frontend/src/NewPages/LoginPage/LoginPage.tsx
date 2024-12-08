import React, {useState} from 'react';
import styles from './LoginPage.module.scss'
import Logo from '../../NewComponents/Logo/Logo.tsx';
import InputField from '../../NewComponents/InputField/InputField.tsx';
import Button from '../../NewComponents/Button/Button.tsx';
import axios from 'axios';
import {saveToken, setAuthHeader} from '../../../public/serviceToken';
import {Navigate} from 'react-router-dom';

const LoginPage :React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Функция handleSubmit вызвана');
    console.log('Текущие значения:', { email, password });
    
    setEmailError(null);
    setPasswordError(null);
    
    if (!email) {
      setEmailError('Введите email');
      return;
    }
    
    if (!password) {
      setPasswordError('Введите пароль');
      return;
    }
    
    try {
      // Создаем данные для отправки в формате x-www-form-urlencoded
      const data = new URLSearchParams();
      data.append('grant_type', 'password');
      data.append('username', email);
      data.append('password', password);
      data.append('scope', '');
      data.append('client_id', 'string');
      data.append('client_secret', 'string');
      
      const response = await axios.post(
        'http://localhost:8000/api/v1/login/access-token',
        data, // Отправляем данные в правильном формате
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
        setIsAuthenticated(true);
      } else {
        console.error('Токен отсутствует в ответе');
      }
    } catch (error: any) {
      if (error.response) {
        const status = error.response.status;
        if (status === 401) {
          setEmailError('Неверный email или пароль');
        } else {
          console.error('Ошибка сервера:', error.response.data);
        }
      } else {
        console.error('Ошибка подключения:', error.message);
      }
    }
  };
  
  if (isAuthenticated) {
    return <Navigate to='/profile' />;
  }
  
  
  return (
    <div className={styles.wrapper}>
      <div className={styles.leftSection}>
        <Logo/>
        <form onSubmit={handleSubmit}
              className={styles.form}>
          <h2 className={styles.form__heading}>Вход в профиль</h2>
            <div className={styles.form__inputs}>
              <InputField
                label="Email"
                placeholder="IvanovIvan@urfu.me"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={emailError} // Передаём текст ошибки в InputField
              />
              <InputField
                label="Пароль/временный пароль"
                placeholder="password123"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={passwordError} // Передаём текст ошибки в InputField
              />
            <div className="">
              <Button type={'submit'} text={'Войти'} color={'#1E4391'}/>
            </div>
          </div>
          <div className={styles.form__forgot}>
            <a href="#" className="">Забыли
              пароль?</a>
          </div>
        </form>
      </div>
      
      <div className={styles.rightSection}>
        <img className={styles.pattern__image} src='/assets/images/login_bg.jpg'
             alt='Фоновое изображение в стиле Ирит-ртф'/>
      </div>
    </div>
  );
};

export default LoginPage;