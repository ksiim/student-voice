import React, { useState, useEffect } from 'react';
import Header from './../../NewComponents/Header/Header_teacher/Header.tsx';
import styles from './ChangePassword.module.scss';
import InputField from '../../NewComponents/InputField/InputField.tsx';
import Button from '../../NewComponents/Button/Button.tsx';
import axios from 'axios';
import { getToken, setAuthHeader } from '../../../public/serviceToken';
import InfoPopUp from '../../NewComponents/InfoPopUp/InfoPopUp.tsx';

const ChangePassword: React.FC = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSuccessPopupVisible, setIsSuccessPopupVisible] = useState(false);
  const [errors, setErrors] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  // Проверка на лету для совпадения пароля и подтверждения
  useEffect(() => {
    if (confirmPassword && newPassword !== confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: 'Новые пароли не совпадают',
      }));
    } else {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: '',
      }));
    }
  }, [newPassword, confirmPassword]);
  
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
      
      console.log('Пароль успешно изменен:', response.data);
      setErrors({ oldPassword: '', newPassword: '', confirmPassword: '' }); // Сбрасываем ошибки при успешной смене пароля
      setIsSuccessPopupVisible(true);
    } catch (error: any) {
      if (error.response?.status === 400) {
        setErrors((prev) => ({ ...prev, oldPassword: 'Введен неверный пароль' }));
      }
      else if (error.response?.status === 422){
        setErrors((prev) => ({ ...prev, confirmPassword: 'Ошибка при изменении пароля. Проверьте введенные данные.' }));
      } else {
        console.error('Ошибка при изменении пароля:', error);
      }
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = { oldPassword: '', newPassword: '', confirmPassword: '' };
    
    // Проверяем совпадение нового пароля и старого
    if (newPassword === oldPassword) {
      newErrors.newPassword = 'Новый пароль не может совпадать со старым';
    }
    
    // Проверяем совпадение нового пароля и подтверждения
    if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Новые пароли не совпадают';
    }
    
    // Устанавливаем ошибки
    setErrors((prev) => ({ ...prev, ...newErrors }));
    
    // Если ошибок нет, меняем пароль
    if (!newErrors.oldPassword && !newErrors.newPassword && !newErrors.confirmPassword) {
      changePassword(oldPassword, newPassword);
    }
  };
  
  
  return (
    <div className={styles.wrapper}>
      <Header />
      <div className={styles.content}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <h2 className={styles.form__heading}>Смена пароля</h2>
          <div className={styles.form__inputs}>
            <InputField
              label="Старый пароль"
              placeholder="Введите старый пароль"
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              error={errors.oldPassword}
            />
            <InputField
              label="Новый пароль"
              placeholder="Придумайте новый пароль"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              error={errors.newPassword}
            />
            <InputField
              label="Подтвердите новый пароль"
              placeholder="Повторите новый пароль"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={errors.confirmPassword}
            />
          </div>
          <div>
            <Button type="submit" text="Сохранить" color="#1E4391"/>
          </div>
          <div className={styles.form__forgot}>
            <a href="#" className="">Забыли
              пароль?</a>
          </div>
        </form>
      </div>
      {isSuccessPopupVisible && (
        <InfoPopUp title={'Пароль успешно изменен'} description={''} onClose={() => setIsSuccessPopupVisible(false)} />
      )}
    </div>
  );
};

export default ChangePassword;
