import React, { useState } from 'react';
import { InputField } from '../../../Components/InputField';
import { SubmitButton } from '../../../Components/SubmitButton';

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
  };
  
  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm bg-[#B8CDDA] p-8 rounded-lg shadow-md">
      <h2 className='text-center text-xl mb-6'>Вход в профиль</h2>
      <InputField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <InputField label="Пароль/временный пароль" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <div className="flex flex-col items-center gap-4 mt-6">
        <SubmitButton text="Войти" style={{width: '2.85em'}}/>
      </div>
      <div className="text-left mt-2">
        <a href="#" className="text-sm text-blue-500 hover:underline">Забыли
          пароль?</a>
      </div>
    </form>
  );
};
