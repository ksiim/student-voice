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
    <form onSubmit={handleSubmit} className="w-full max-w-sm bg-gray-100 p-8 rounded-lg shadow-md">
      <InputField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <InputField label="Пароль/временный пароль" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <SubmitButton text="Войти" />
      <div className="text-right mt-2">
        <a href="#" className="text-sm text-blue-500 hover:underline">Забыли пароль?</a>
      </div>
    </form>
  );
};
