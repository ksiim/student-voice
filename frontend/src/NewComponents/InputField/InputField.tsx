import React, { useState, useRef, useEffect } from 'react';
import { Eye, EyeOff, Wand2 } from 'lucide-react';
import styles from './InputField.module.scss';

interface InputFieldProps {
  placeholder: string;
  type: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  error: string | null;
  disabled?: boolean;
  onGeneratePassword?: () => void;
}

const InputField: React.FC<InputFieldProps> = ({
                                                 label,
                                                 placeholder,
                                                 type,
                                                 value,
                                                 onChange,
                                                 error,
                                                 disabled = false,
                                                 onGeneratePassword,
                                               }) => {
  const [showPassword, setShowPassword] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };
  
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
  
  // Определяем, какой тип input использовать
  const getInputType = () => {
    if (type === 'password') {
      return showPassword ? 'text' : 'password';
    }
    if (type === 'generatedPassword') {
      return 'password';
    }
    return type;
  };
  
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
              type={getInputType()}
              className={`${styles.input} ${error ? styles.inputError : ''}`}
              placeholder={placeholder}
              value={value}
              onChange={handleChange}
              autoComplete={type === 'password' || type === 'generatedPassword' ? 'new-password' : 'off'}
              disabled={disabled}
            />
          )}
          {type === 'password' && (
            <div className={styles.iconContainer}>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={styles.iconButton}
                disabled={disabled}
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
            </div>
          )}
          {type === 'generatedPassword' && onGeneratePassword && (
            <div className={styles.iconContainer}>
              <button
                type="button"
                onClick={onGeneratePassword}
                className={styles.iconButton}
                disabled={disabled}
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
                <Wand2 className={styles.icon} color="#CCCCCC" />
              </button>
            </div>
          )}
        </div>
      </div>
      {error && <p className={styles.errorText}>{error}</p>}
    </div>
  );
};

export default InputField;