import React, { useState } from 'react';
import styles from './CreateFeedbackForm.module.scss';
import Header from '../../NewComponents/Header/Header_teacher/Header.tsx';
import Button from '../../NewComponents/Button/Button.tsx';
import { useNavigate } from 'react-router-dom';
import InputField from '../../NewComponents/InputField/InputField.tsx';

const CreateFeedbackForm: React.FC = () => {
  // Начальное состояние с одним дополнительным вопросом
  const [additionalFields, setAdditionalFields] = useState<number[]>([1]);
  const navigate = useNavigate();
  
  const handleBack = () => {
    navigate(-1);
  };
  
  const addInputField = () => {
    if (additionalFields.length < 3) {
      setAdditionalFields([...additionalFields, additionalFields.length + 1]);
    }
  };
  
  return (
    <div className={styles.wrapper}>
      <Header />
      
      <div className={styles.content}>
        <h2 className={styles.content__title}>Создание формы обратной связи</h2>
        
        <div className={styles.form}>
          <div className={styles.form__main}>
            <InputField type={'input'} label={'Название предмета'} placeholder={'Введите вопрос'} error={''} onChange={() => {}} value={'Арх эвм'} disabled={true}/>
            <InputField type={'input'} label={'Тема пары'} placeholder={''} error={''} onChange={() => {}} value={''}/>
            <InputField type={'input'} label={'Место проведения'} placeholder={''} error={''} onChange={() => {}} value={'Гук 309'} disabled={true}/>
            <InputField type={'input'} label={'Учебная группа'} placeholder={''} error={''} onChange={() => {}} value={'АТ-10'} disabled={true}/>
            <Button type={'button'} text={'Назад'} onClick={handleBack} color={'#CCCCCC'} />
          </div>
          
          <div className={styles.form__additional}>
            {additionalFields.map((_, index) => (
              <InputField key={index} type={'input'} label={'Дополнительный вопрос'} placeholder={'Введите вопрос'} error={''} onChange={() => {}} value={''}/>
            ))}
            {additionalFields.length < 3 && (
              <button className={styles.addButton} onClick={addInputField}>
                Добавить поле
              </button>
            )}
          </div>
          
          <div className={styles.form__qr}>
            <div className={styles.form__qr__container}></div>
            <Button type={'button'} text={'Генерировать'} onClick={() => {}} color={'#1E4391'}/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateFeedbackForm;
