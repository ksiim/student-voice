import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './CreateFeedbackForm.module.scss';
import Header from '../../NewComponents/Header/Header_teacher/Header';
import Button from '../../NewComponents/Button/Button';
import InputField from '../../NewComponents/InputField/InputField';
import TimeDatePicker from '../../NewComponents/TimeDatePicker/TimeDatePicker.tsx';
import { getToken, setAuthHeader } from '../../../public/serviceToken.js';
import { Spinner } from '@chakra-ui/spinner';

interface FeedbackFormData {
  class_theme: string;
  additional_question_1: string;
  additional_question_2: string;
  additional_question_3: string;
  end_of_active_status: string;
  place: string;
  created_at: string;
  updated_at: string;
  class_id: string;
}

interface ClassData {
  name: string;
  description: string;
  start_time: string;
  end_time: string;
  study_groups: string;
  place: string;
  id: string;
  teacher_id: string;
  subject_id: string;
}

const CreateFeedbackForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [classData, setClassData] = useState<ClassData | null>(null);
  const [formData, setFormData] = useState<FeedbackFormData>({
    class_theme: '',
    additional_question_1: '',
    additional_question_2: '',
    additional_question_3: '',
    end_of_active_status: '',
    place: '',
    created_at: '',
    updated_at: '',
    class_id: id || '',
  });
  const [additionalFields, setAdditionalFields] = useState<number[]>([0]);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [showButtons, setShowButtons] = useState(false); // Добавляем состояние для отображения кнопок
  const [surveyEndTime, setSurveyEndTime] = useState<string>('');
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = getToken();
        if (token) {
          setAuthHeader(token);
        }
        
        const [classResponse, formResponse] = await Promise.all([
          axios.get(`http://localhost:8000/api/v1/classes/${id}`),
          axios.get(`http://localhost:8000/api/v1/backforms/by_class_id/${id}`)
        ]);
        
        setClassData(classResponse.data);
        setFormData({
          ...formResponse.data,
          class_theme: formResponse.data.class_theme || classResponse.data.description
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    
    fetchData();
  }, [id]);
  
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };
  
  const handleEndTimeChange = (newEndTime: string) => {
    const [hours, minutes] = newEndTime.split(':').map(Number);
    
    // Создаем дату без учета часового пояса
    const utcDate = new Date();
    utcDate.setUTCHours(hours, minutes, 0, 0); // Устанавливаем UTC-время
    
    // Преобразуем время в ISO-строку
    const isoString = utcDate.toISOString();
    
    setFormData(prev => ({
      ...prev,
      end_of_active_status: isoString,
    }));
  };
  
  
  
  
  const addInputField = () => {
    const lastIndex = additionalFields.length - 1;
    const lastFieldKey = `additional_question_${lastIndex + 1}`;
    
    // Проверяем, заполнено ли последнее поле
    if (!formData[lastFieldKey as keyof FeedbackFormData]?.trim()) {
      alert('Пожалуйста, заполните текущее поле, прежде чем добавлять новое.');
      return;
    }
    
    setAdditionalFields((prev) => [...prev, prev.length]);
  };
  
  const handleBack = () => navigate(-1);
  
  const generateQRCode = async (classId: string): Promise<string | null> => {
    try {
      const token = getToken();
      if (token) {
        setAuthHeader(token);
      }
      const response = await axios.get(`http://localhost:8000/api/v1/qr/generate/${classId}`, {
        responseType: 'blob', // Чтобы получить изображение как Blob
      });
      return URL.createObjectURL(response.data); // Конвертируем Blob в URL
    } catch (error) {
      console.error('Ошибка при генерации QR-кода:', error);
      return null;
    }
  };
  
  const handleGenerate = async () => {
    try {
      const token = getToken();
      if (token) {
        setAuthHeader(token);
      }
      
      const payload = {
        class_theme: formData.class_theme || '',
        additional_question_1: formData.additional_question_1 || '',
        additional_question_2: formData.additional_question_2 || '',
        additional_question_3: formData.additional_question_3 || '',
        end_of_active_status: formData.end_of_active_status || new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      console.log('Отправляемое тело:', payload);
      
      await axios.patch(`http://localhost:8000/api/v1/backforms/${id}`, payload);
      console.log('Данные успешно отправлены');
      
      // Генерация QR-кода
      if (id) {
        const qrUrl = await generateQRCode(id);
        if (qrUrl) {
          setQrCodeUrl(qrUrl); // Сохраняем URL QR-кода
        }
      }
      
      setShowButtons(true); // Показать дополнительные кнопки
    } catch (error) {
      console.error('Ошибка при отправке данных:', error);
    }
  };
  
  const handleExtendTime = async () => {
    try {
      const utcDate = new Date(formData.end_of_active_status);
      utcDate.setUTCMinutes(utcDate.getUTCMinutes() + 15); // Продлеваем время на 15 минут
      
      const payload = {
        end_of_active_status: utcDate.toISOString(),
      };
      
      const token = getToken();
      if (token) {
        setAuthHeader(token);
      }
      
      await axios.patch(`http://localhost:8000/api/v1/backforms/${id}`, payload);
      console.log('15 минут успешно добавлены к опросу');
      
      // Обновляем данные формы и отображаемое время
      setFormData(prev => ({ ...prev, end_of_active_status: utcDate.toISOString() }));
      setSurveyEndTime(utcDate.toISOString().slice(11, 16)); // Форматируем HH:MM
    } catch (error) {
      console.error('Ошибка при продлении времени:', error);
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
              type="textarea"
              label="Название предмета"
              placeholder="Введите вопрос"
              error=""
              onChange={() => {}}
              value={classData?.name || ''}
              disabled={true}
            />
            <InputField
              type="textarea"
              label="Тема пары"
              placeholder="Введите тему"
              error=""
              onChange={(e) => handleInputChange('class_theme', e.target.value)}
              value={formData.class_theme}
            />
            <InputField
              type="textarea"
              label="Место проведения"
              placeholder=""
              error=""
              onChange={() => {}}
              value={classData?.place || ''}
              disabled={true}
            />
            <InputField
              type="textarea"
              label="Учебная группа"
              placeholder=""
              error=""
              onChange={() => {}}
              value={classData?.study_groups || ''}
              disabled={true}
            />
            <TimeDatePicker
              initialTime={{
                start_time: classData?.start_time || '',
                end_time: classData?.end_time || ''
              }}
              onSurveyTimeChange={handleEndTimeChange}
              surveyEndTime={surveyEndTime}
            />
            <Button
              type="button"
              text="Назад"
              onClick={handleBack}
              color="#CCCCCC"
            />
          </div>
          <div className={styles.form__additional}>
            {additionalFields.map((_, index) => (
              <div key={index} className={styles.inputFieldWrapper}>
                <InputField
                  type="textarea"
                  label="Дополнительный вопрос"
                  placeholder="Введите вопрос"
                  error=""
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
            <div className={styles.form__qr__container}>
              {qrCodeUrl ? (
                <img src={qrCodeUrl} alt="QR Code" className={styles.qrCode} />
              ) : (
                <Spinner size="xl" color="#1E4391" borderWidth="6px" style={{ width: '80px', height: '80px' }} />
              )}
            </div>
            {!showButtons && (
              <Button type="button" text="Генерировать" onClick={handleGenerate} color="#1E4391" />
            )}
            {showButtons && (
              <>
                <Button
                  type="button"
                  text="Скопировать ссылку"
                  onClick={() => {}}
                  color="#1E4391"
                />
                <Button
                  type="button"
                  text="Продлить на 15 минут"
                  onClick={handleExtendTime}
                  color="#1E4391"
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateFeedbackForm;
