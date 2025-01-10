import React, { useState, useRef, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import styles from './InputField.module.scss';

interface InputFieldProps {
  placeholder: string;
  type: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  error: string | null;
  disabled?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
                                                 label,
                                                 placeholder,
                                                 type,
                                                 value,
                                                 onChange,
                                                 error,
                                                 disabled = false
                                               }) => {
  const [showPassword, setShowPassword] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      // Сначала сбрасываем высоту
      textarea.style.height = 'auto';  // Автоматически уменьшаем высоту
      // Устанавливаем новую высоту по содержимому
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };
  
  // Подстраиваем высоту при изменении значения
  useEffect(() => {
    if (type === 'textarea') {
      adjustHeight();
    }
  }, [value, type]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange(e);
    if (type === 'textarea') {
      adjustHeight();
    }
  };
  
  const inputType = type === 'password' ? (showPassword ? 'text' : 'password') : type;
  
  return (
    <div className={styles.wrapper}>
      <div className={styles.wrapper__content}>
        <label className={styles.label}>{label}</label>
        <div style={{ position: 'relative' }}>
          {type === 'textarea' ? (
            <textarea
              ref={textareaRef}
              className={`${styles.input} ${error ? styles.inputError : ''} ${
                disabled ? styles.inputDisabled : ''
              }`}
              placeholder={placeholder}
              value={value}
              onChange={handleChange}
              disabled={disabled}
              rows={1}
              style={{
                resize: 'none',
                overflow: 'hidden'
              }}
            />
          ) : (
            <input
              type={inputType}
              className={`${styles.input} ${error ? styles.inputError : ''}`}
              placeholder={placeholder}
              value={value}
              onChange={handleChange}
              autoComplete={type === 'password' ? 'new-password' : 'off'}
              disabled={disabled}
            />
          )}
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
              disabled={disabled}
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
