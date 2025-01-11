import React, { useState } from 'react';
import styles from './CreateUser.module.scss';
import Header from './../../NewComponents/Header/Header_admin/Header.tsx';
import InputField from '../../NewComponents/InputField/InputField.tsx';
import Button from '../../NewComponents/Button/Button.tsx';
import axios from 'axios';
import {setAuthHeader, getToken } from '../../../public/serviceToken.js';
import {useNavigate} from 'react-router-dom';

const CreateUser: React.FC = () => {
  const [surname, setSurname] = useState('');
  const [name, setName] = useState('');
  const [patronymic, setPatronymic] = useState('');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [role, setRole] = useState('1f472826-cf79-4ea9-a194-c5880ec8817a'); // По умолчанию "Преподаватель"
  const [isChecked, setIsChecked] = useState(true);
  const navigate = useNavigate();
  
  const handleCheckboxChange = () => {
    setIsChecked((prevState) => !prevState);
  };
  
  const resetForm = () => {
    setSurname('');
    setName('');
    setPatronymic('');
    setEmail('');
    setPassword('');
    setRole('1f472826-cf79-4ea9-a194-c5880ec8817a'); // По умолчанию "Преподаватель"
    setIsChecked(true); // Возвращаем состояние чекбокса
    setEmailError(null);
    setPasswordError(null);
  };
  
  
  const handleGeneratePassword = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/v1/users/generate_password/');
      console.log(response.data);
      const generatedPassword = response.data['password']; // Извлекаем значение из объекта
      setPassword(generatedPassword); // Устанавливаем пароль как строку
    } catch (error) {
      console.error('Ошибка при генерации пароля:', error);
    }
  };
  
  
  const sendPasswordEmail = async (userEmail: string, userPassword: string) => {
    try {
      const params = new URLSearchParams();
      params.append('email', userEmail);
      params.append('password', userPassword);
      params.append('title', 'Доступ к системе');
      
      await axios.get('http://localhost:8000/api/v1/users/send_new_password_on_mail', { params });
    } catch (error) {
      console.error('Ошибка при отправке пароля на почту:', error);
    }
  };
  
  const handleRoleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRole(e.target.value);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
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
      const token = getToken();
      if (token) {
        setAuthHeader(token);
      }
      
      const userData = {
        email,
        is_active: true,
        is_superuser: false, // Администратор
        name,
        surname,
        patronymic,
        password,
        role_id: role,
      };
      
      console.log('Проверка пароля перед отправкой:', password);
      
      const response = await axios.post(
        'http://localhost:8000/api/v1/users',
        userData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      
      console.log('Пользователь создан:', response.data);
      alert('Пользователь успешно создан');
      
      // Отправляем письмо с паролем
      await sendPasswordEmail(email, password);
      
      console.log('Письмо с паролем отправлено');
      
      // Сбрасываем форму
      resetForm();
    } catch (error: any) {
      console.error('Ошибка при создании пользователя:', error);
      
      if (error.response) {
        console.error('Ответ от сервера:', error.response.data);
        alert('Ошибка: ' + (error.response.data.detail || 'Не удалось создать пользователя'));
      } else {
        console.error('Ошибка подключения:', error.message);
        alert('Ошибка подключения: ' + error.message);
      }
    }
  };
  
  
  
  return (
    <div className={styles.wrapper}>
      <Header />
      
      <div className={styles.content}>
        <h2 className={styles.content__title}>Создание пользователя</h2>
        <form onSubmit={handleSubmit} className={styles.content__form}>
          <fieldset className={styles.buttonGroup}>
            <div className={styles.buttonGroup__radioButton}>
              <input
                type="radio"
                id="teacher"
                name="role"
                value="1f472826-cf79-4ea9-a194-c5880ec8817a"
                checked={role === '1f472826-cf79-4ea9-a194-c5880ec8817a'}
                onChange={handleRoleChange}
              />
              <label htmlFor="teacher">Преподаватель</label>
            </div>
            
            <div className={styles.buttonGroup__radioButton}>
              <input
                type="radio"
                id="admin"
                name="role"
                value="d9a799c6-60e1-4e6f-9853-4c0ec13f12ab"
                checked={role === 'd9a799c6-60e1-4e6f-9853-4c0ec13f12ab'}
                onChange={handleRoleChange}
              />
              <label htmlFor="admin">Администратор</label>
            </div>
          </fieldset>
          
          <div className={styles.inputGrid}>
            <div className={styles.inputGrid__element}>
              <InputField
                label="Фамилия"
                type="text"
                placeholder=""
                onChange={(e) => setSurname(e.target.value)}
                error=""
                value={surname}
              />
            </div>
            <div className={styles.inputGrid__element}>
              <InputField
                label="Имя"
                type="text"
                placeholder=""
                onChange={(e) => setName(e.target.value)}
                error=""
                value={name}
              />
            </div>
            <div className={styles.inputGrid__element}>
              <InputField
                label="Отчество"
                type="text"
                placeholder=""
                onChange={(e) => setPatronymic(e.target.value)}
                error=""
                value={patronymic}
              />
            </div>
            <div className={styles.inputGrid__element}>
              <InputField
                label="Email"
                type="email"
                placeholder="IvanovIvan@urfu.me"
                onChange={(e) => setEmail(e.target.value)}
                error={emailError}
                value={email}
              />
            </div>
            <div className={styles.inputGrid__element}>
              <InputField
                label="Пароль"
                type="generatedPassword"  // Используем новый тип
                placeholder=""
                onChange={(e) => setPassword(e.target.value)}
                error={passwordError}
                value={password}
                onGeneratePassword={handleGeneratePassword}
              />
            </div>
            <div className={styles.inputGrid__element}>
              <label className={styles.formControl}>
                Доступ к отзывам
                <input
                  type="checkbox"
                  name="checkbox-checked"
                  checked={isChecked}
                  onChange={handleCheckboxChange}
                />
              </label>
            </div>
          </div>
          <div className={styles.controls}>
            <Button type="button" text="Назад" color="#CCCCCC" onClick={() => navigate(-1)}/>
            <Button type="submit" text="Создать" color="#1E4391" />
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateUser;
