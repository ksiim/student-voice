import React, { useState } from 'react';
import { InputField } from '../../../Components/InputField';
import axios from 'axios';
import { Navigate } from 'react-router-dom';
import { saveToken, setAuthHeader } from '../../../../api/serviceToken.js';

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting form with:', { email, password });
    axios.post(
      'http://localhost:8000/api/token/',
      { username: email, password: password },
      { headers: { 'Content-Type': 'application/json' } }
    )
      .then(response => {
        console.log('Response received:', response);
        const token = response.data.access;
        saveToken(token);
        setAuthHeader(token);
        setIsAuthenticated(true);
      })
      .catch(error => {
        console.error('Ошибка авторизации:', error);
      });
  };
  
  
  if (isAuthenticated) {
    return <Navigate to='/profile' />;
  }
  
  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm bg-[#B8CDDA] p-8 rounded-lg shadow-md">
      <h2 className='text-center text-xl mb-6'>Вход в профиль</h2>
      <InputField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <InputField label="Пароль/временный пароль" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <div className="flex flex-col items-center gap-4 mt-6">
        <button type='submit'>Войти1</button>
      </div>
      <div className="text-left mt-2">
        <a href="#" className="text-sm text-blue-500 hover:underline">Забыли пароль?</a>
      </div>
    </form>
  );
};
