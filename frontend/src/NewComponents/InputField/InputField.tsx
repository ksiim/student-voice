import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import styles from './InputField.module.scss';

interface InputFieldProps {
  placeholder: string;
  type: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error: string | null;
}

const InputField: React.FC<InputFieldProps> = ({
                                                 label,
                                                 placeholder,
                                                 type,
                                                 value,
                                                 onChange,
                                                 error
                                               }) => {
  const [showPassword, setShowPassword] = useState(false);
  
  return (
    <div className={styles.wrapper}>
      <div className={styles.wrapper__content}>
        <label className={styles.label}>{label}</label>
        <div style={{ position: 'relative' }}>
          <input
            type={type === 'password' ? (showPassword ? 'text' : 'password') : type}
            className={`${styles.input} ${error ? styles.inputError : ''}`}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            autoComplete={type === 'password' ? 'new-password' : 'off'} // Отключение автозаполнения
          />
          {type === 'password' && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: 0,
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                display: 'flex',
                alignItems: 'center'
              }}
            >
              {showPassword ? (
                <EyeOff className={styles.icon} color="#CCCCCC" />
              ) : (
                <Eye className={styles.icon} color="#CCCCCC" />
              )}
            </button>
          )}
        </div>
      </div>
      {error && <p className={styles.errorText}>{error}</p>}
    </div>
  );
};

export default InputField;
