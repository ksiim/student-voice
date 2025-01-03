import React, { useState } from 'react';
import axios from 'axios';
import styles from './CreateFeedbackForm.module.scss';
import Header from '../../NewComponents/Header/Header_teacher/Header';
import Button from '../../NewComponents/Button/Button';
import { useNavigate } from 'react-router-dom';
import InputField from '../../NewComponents/InputField/InputField';
import { getToken, setAuthHeader } from '../../../public/serviceToken.js';
import TimeDatePicker from '../../NewComponents/TimeDatePicker/TimeDatePicker.tsx';

interface FeedbackFormData {
  class_theme: string;
  additional_question_1: string;
  additional_question_2: string;
  additional_question_3: string;
  end_of_active_status: string;
  created_at: string;
  updated_at: string;
  class_id: string;
}

const CreateFeedbackForm: React.FC = () => {
  const [additionalFields, setAdditionalFields] = useState<number[]>([1]);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<FeedbackFormData>({
    class_theme: '',
    additional_question_1: '',
    additional_question_2: '',
    additional_question_3: '',
    end_of_active_status: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    class_id: '3fa85f64-5717-4562-b3fc-2c963f66afa6' // TODO: Заменить на динамический ID
  });
  
  const handleBack = () => {
    navigate(-1);
  };
  
  const addInputField = () => {
    if (additionalFields.length < 3) {
      setAdditionalFields([...additionalFields, additionalFields.length + 1]);
    }
  };
  
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleEndTimeChange = (newEndTime: string) => {
    setFormData(prev => ({
      ...prev,
      end_of_active_status: newEndTime
    }));
  };
  
  const handleGenerate = async () => {
    try {
      const token = getToken();
      if (token) {
        setAuthHeader(token);
      }
      
      const response = await axios.post('http://localhost:8000/api/v1/backforms/', formData);
      
      console.log('Form generated successfully:', response.data);
    } catch (error) {
      console.error('Error generating form:', error);
    }
  };
  
  return (
    <div className={styles.wrapper}>
      <Header />
      <div className={styles.content}>
        <h2 className={styles.content__title}>Создание формы обратной связи</h2>
        <div className={styles.form}>
          <div className={styles.form__main}>
            <InputField
              type={'textarea'}
              label={'Название предмета'}
              placeholder={'Введите вопрос'}
              error={''}
              onChange={() => {}}
              value={'Арх эвм'}
              disabled={true}
            />
            <InputField
              type={'input'}
              label={'Тема пары'}
              placeholder={'Введите тему'}
              error={''}
              onChange={(e) => handleInputChange('class_theme', e.target.value)}
              value={formData.class_theme}
            />
            <InputField
              type={'input'}
              label={'Место проведения'}
              placeholder={''}
              error={''}
              onChange={() => {}}
              value={'Гук 309'}
              disabled={true}
            />
            <InputField
              type={'input'}
              label={'Учебная группа'}
              placeholder={''}
              error={''}
              onChange={() => {}}
              value={'АТ-10'}
              disabled={true}
            />
            <TimeDatePicker onSurveyTimeChange={handleEndTimeChange} />
            <Button type={'button'} text={'Назад'} onClick={handleBack} color={'#CCCCCC'} />
          </div>
          <div className={styles.form__additional}>
            {additionalFields.map((_, index) => (
              <div key={index} className={styles.inputFieldWrapper}>
                <InputField
                  type={'textarea'}
                  label={'Дополнительный вопрос'}
                  placeholder={'Введите вопрос'}
                  error={''}
                  onChange={(e) => handleInputChange(`additional_question_${index + 1}`, e.target.value)}
                  value={formData[`additional_question_${index + 1}` as keyof FeedbackFormData] || ''}
                />
              </div>
            ))}
            {additionalFields.length < 3 && (
              <button className={styles.addButton} onClick={addInputField}>
                Добавить поле
              </button>
            )}
          </div>
          <div className={styles.form__qr}>
            <div className={styles.form__qr__container}></div>
            <Button
              type={'button'}
              text={'Генерировать'}
              onClick={handleGenerate}
              color={'#1E4391'}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateFeedbackForm;
