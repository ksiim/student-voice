import React, { useState } from 'react';
import { InputField } from '../../Components/InputField';
import axios from 'axios';
import { Navigate } from 'react-router-dom';
import { saveToken, setAuthHeader } from '../../../public/serviceToken';
import Button from '../../NewComponents/Button/Button.tsx';
import Header from '../../NewComponents/Header/Header_teacher/Header.tsx';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Функция handleSubmit вызвана');
    console.log('Текущие значения:', { email, password });
    
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
    } catch (error) {
      console.error('Ошибка авторизации:', error);
    }
  };
  
  if (isAuthenticated) {
    return <Navigate to='/profile' />;
  }
  
  return (
    <div className="flex items-center justify-center h-screen w-screen bg-gray-50">
      <div className="w-full max-w-md">
        <Header/>
        <form onSubmit={handleSubmit} className="w-full max-w-sm bg-[#B8CDDA] p-8 rounded-lg shadow-md mt-6">
          <h2 className="text-center text-xl mb-6">Вход в профиль</h2>
          <InputField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <InputField label="Пароль/временный пароль" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <div className="flex flex-col items-center gap-4 mt-6">
            <Button type={'submit'} text={'Войтииии'} color={'#1E4391'}/>
          </div>
          <div className="text-left mt-2">
            <a href="#" className="text-sm text-blue-500 hover:underline">Забыли пароль?</a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
