import React, { useState } from 'react';
import styles from './createForm.module.scss';
import { Logo } from '../../Components/Logo';
import Button from '../profile/Components/Button';
import {useNavigate} from 'react-router-dom';

interface CreateFormProps {
  onSubmit: (formData: FormData) => void;
}

interface FormData {
  subject: string;
  location: string;
  date: string;
  time: string;
  endTime: string;
  endDate: string;
  isGroup: boolean;
  evaluationParam: string;
}


const CreateForm: React.FC<CreateFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<FormData>({
    subject: 'Эффективные коммуникации АТ-10',
    location: '',
    date: '13.09.2024',
    time: '12:00 - 13:30',
    endTime: '13:45',
    endDate: '13.09.2024',
    isGroup: true,
    evaluationParam: 'Что больше всего понравилось на паре?'
  });
  
  const navigate = useNavigate();
  
  const handleList = () => {
    navigate('/list')
  }
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };
  
  return (
    <div className={styles['create-form']}>
      <header className={styles.header}>
        <Logo/>
        <div className={styles.headerButtons}>
          <Button text="Назад"/>
        </div>
      </header>
      
      <div className={styles['create-form__form-container']}>
        <h1 className={styles['create-form__title']}>
          Создание Формы обратной связи
        </h1>
        
        <form className={styles['create-form__form']} onSubmit={handleSubmit}>
          <div className={styles['create-form__input-group']}>
            <label className={styles['create-form__label']}>
              Выбрать пару:
            </label>
            <input
              type="text"
              className={styles['create-form__input']}
              value={formData.subject}
              onChange={(e) => setFormData({
                ...formData,
                subject: e.target.value
              })}
            />
          </div>
          
          <div className={styles['create-form__input-group']}>
            <label className={styles['create-form__label']}>
              Место проведения
            </label>
            <select
              className={styles['create-form__select']}
              value={formData.location}
              onChange={(e) => setFormData({
                ...formData,
                location: e.target.value
              })}
            >
              <option value="">Выберите место</option>
              {/* Add your location options here */}
            </select>
          </div>
          
          <div className={styles['create-form__date-time']}>
            <div className={styles['create-form__input-group']}>
              <label className={styles['create-form__label']}>Дата</label>
              <input
                type="text"
                className={styles['create-form__input']}
                value={formData.date}
                onChange={(e) => setFormData({
                  ...formData,
                  date: e.target.value
                })}
              />
            </div>
            
            <div className={styles['create-form__input-group']}>
              <label className={styles['create-form__label']}>Пара</label>
              <input
                type="text"
                className={styles['create-form__input']}
                value={formData.time}
                onChange={(e) => setFormData({
                  ...formData,
                  time: e.target.value
                })}
              />
            </div>
          </div>
          
          <div className={styles['create-form__date-time']}>
            <div className={styles['create-form__input-group']}>
              <label className={styles['create-form__label']}>
                Время окончания опроса
              </label>
              <input
                type="text"
                className={styles['create-form__input']}
                value={formData.endTime}
                onChange={(e) => setFormData({
                  ...formData,
                  endTime: e.target.value
                })}
              />
            </div>
            <div className={styles['create-form__input-group']}>
              <input
                type="text"
                className={styles['create-form__input']}
                value={formData.endDate}
                onChange={(e) => setFormData({
                  ...formData,
                  endDate: e.target.value
                })}
              />
            </div>
          </div>
          
          <div className={styles['create-form__checkbox-group']}>
            <input
              type="checkbox"
              checked={formData.isGroup}
              onChange={(e) => setFormData({
                ...formData,
                isGroup: e.target.checked
              })}
            />
            <label className={styles['create-form__label']}>
              Учебная группа
            </label>
          </div>
          
          <div className={styles['create-form__input-group']}>
            <label className={styles['create-form__label']}>
              Введите параметр оценивания
            </label>
            <input
              type="text"
              className={styles['create-form__input']}
              value={formData.evaluationParam}
              onChange={(e) => setFormData({
                ...formData,
                evaluationParam: e.target.value
              })}
            />
          </div>
          
          <div className={styles['create-form__buttons']}>
            <Button
              text="Сгенерировать QR-код"
              className={styles['create-form__primary-button']}
            />
            <Button
              text="Продлить QR-код (15 мин.)"
              className={styles['create-form__secondary-button']}
            />
          </div>
          
          <div className={styles['create-form__qr-container']}>
            <div className={styles['create-form__qr-container__qr-code']}/>
            <img src='../../../public/assets/images/qr.svg'/>
            <div/>
            
            <div className={styles['create-form__qr-container__buttons']}>
              <Button
                text="Сохранить как"
                className={styles['create-form__primary-button']}
              />
              <Button
                text="Копировать ссылку"
                className={styles['create-form__secondary-button']}
              />
            </div>
          </div>
          <Button
            text="Смотреть список проголосовавших"
            className={styles['create-form__secondary-button']}
            onClick = {handleList}
          />
          <Button
            text="Удалить пару"
            className={styles['create-form__secondary-button']}
          />
        </form>
      </div>
    </div>
  );
};

export default CreateForm;