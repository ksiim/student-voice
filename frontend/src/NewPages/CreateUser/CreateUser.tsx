import React, { useState } from 'react';
import styles from './CreateUser.module.scss';
import Header from './../../NewComponents/Header/Header_admin/Header.tsx';
import InputField from '../../NewComponents/InputField/InputField.tsx';
import Button from '../../NewComponents/Button/Button.tsx';
import axios from 'axios';
import {setAuthHeader, getToken } from '../../../public/serviceToken';

const CreateUser: React.FC = () => {
  const [surname, setSurname] = useState('');
  const [name, setName] = useState('');
  const [patronymic, setPatronymic] = useState('');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [role, setRole] = useState('4592282a-f711-4758-8881-188861742f96'); // По умолчанию "Преподаватель"
  const [isChecked, setIsChecked] = useState(true);
  
  const handleCheckboxChange = () => {
    setIsChecked((prevState) => !prevState);
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
        is_superuser: role === '4990c7cf-273a-4ec9-90dc-873db132399b', // Администратор
        name,
        surname,
        patronymic,
        password,
        role_id: role,
      };
      
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
                value="4592282a-f711-4758-8881-188861742f96"
                checked={role === '4592282a-f711-4758-8881-188861742f96'}
                onChange={handleRoleChange}
              />
              <label htmlFor="teacher">Преподаватель</label>
            </div>
            
            <div className={styles.buttonGroup__radioButton}>
              <input
                type="radio"
                id="admin"
                name="role"
                value="4990c7cf-273a-4ec9-90dc-873db132399b"
                checked={role === '4990c7cf-273a-4ec9-90dc-873db132399b'}
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
                type="password"
                placeholder=""
                onChange={(e) => setPassword(e.target.value)}
                error={passwordError}
                value={password}
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
            <Button type="button" text="Назад" color="#CCCCCC" />
            <Button type="submit" text="Создать" color="#1E4391" />
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateUser;
