// UploadReports.tsx
import React, { useState } from 'react';
import Dropdown, { Option } from '../profile/Components/Dropdown';
import styles from './UploadReports.module.scss';
import {Logo} from '../../Components/Logo.tsx';
import Button from '../profile/Components/Button.tsx';
import {useNavigate} from 'react-router-dom';


const UploadReports: React.FC = () => {
  
  const [startDate, setStartDate] = useState('29 сентября 2024');
  const [endDate, setEndDate] = useState('29 сентября 2024');
  const navigate = useNavigate();
  const [reportGenerated] = useState(true);
  const [selectedLesson, setSelectedLesson] = useState<Option | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<Option | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<Option | null>(null);
  const [selectedTeacher, setSelectedTeacher] = useState<Option | null>(null);
  
  // Sample options - replace with your actual data
  const subjectOptions: Option[] = [
    { label: '1.37.1 Современные языки', value: '1.37.1' },
    { label: '1.23.1 Архитектура ЭВМ', value: '1.23.1' },
    { label: '1.30.1 Моделирование', value: '1.30.1' },
  ];
  
  const lessonsSubjects: Option[] = [
    { label: '1.35.1 Современные языки', value: '1.35.1' },
    { label: '1.25.1 Архитектура ЭВМ', value: '1.25.1' },
    { label: '1.36.1 Моделирование', value: '1.36.1' },
  ]
  
  const handleMetrics = () => {
    navigate('/adminPanel')
  }
  
  const handleUsers = () => {
    navigate('/createUser')
  }
  
  
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Logo/>
        <div className={styles.headerButtons}>
          <Button text="Метрики" onClick={handleMetrics}/>
          <Button text="Пользователи" onClick={handleUsers}/>
        </div>
      </header>
      
      <h1 className={styles.title}>Выгрузка данных в таблицу Excel</h1>
      
      <div className={styles.form}>
        <div className={`${styles.dropdownWrapper} ${styles.narrowDropdown}`}>
          <Dropdown
            label="Выбрать определенную пару"
            options={lessonsSubjects}
            value={selectedLesson}
            onChange={setSelectedLesson}/>
        </div>
        
        <div className={styles.formCard}>
          <div className={styles.formFields}>
            <div className={styles.field}>
              <label>Предмет:</label>
              <div className={styles.inputWrapper}>
                <input type="text" disabled placeholder=""
                       className={styles.input}/>
              </div>
            </div>
            
            <div className={styles.field}>
              <label>Преподаватель:</label>
              <div className={styles.inputWrapper}>
                <input type="text" disabled placeholder=""
                       className={styles.input}/>
              </div>
            </div>
            
            <div className={styles.additionalRows}>
              <div className={styles.fieldRow}>
                <div className={styles.field}>
                  <label>Группа:</label>
                  <div className={styles.inputWrapper}>
                    <input type="text" disabled placeholder=""
                           className={styles.input}/>
                  </div>
                </div>
                
                <div className={styles.field}>
                  <label>Дата:</label>
                  <div className={styles.inputWrapper}>
                    <input type="text" disabled placeholder=""
                           className={styles.input}/>
                  </div>
                </div>
                
                <div className={styles.field}>
                  <label>Пара:</label>
                  <div className={styles.inputWrapper}>
                    <input type="text" disabled placeholder=""
                           className={styles.input}/>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className={styles.formActions}>
            <Button className={styles.generateButton} text="Сформировать"/>
            {reportGenerated && (
              <div className={styles.reportActions}>
                <span className={styles.reportStatus}>Отчет сформирован ✓</span>
                <div className={styles.reportActions__buttons}>
                  <Button
                    className={styles.actionButton}
                    text="Сохранить как"
                  />
                  <Button
                    className={styles.actionButton}
                    text="Печать"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className={styles.upload}>
          <div className={styles.dateSection}>
            <div className={styles.dateSection__date}>
              <span>Сформировать отчет за</span>
              <input
                type="text"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className={styles.dateInput}
              />
              <span>-</span>
              <input
                type="text"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className={styles.dateInput}
              />
            </div>
            <Button className={styles.generateButton} text="Сформировать"/>
            {reportGenerated && (
              <div className={styles.reportActions}>
                <span className={styles.reportStatus}>Отчет сформирован ✓</span>
                <Button
                  className={styles.actionButton}
                  text="Сохранить как"
                />
                <Button
                  className={styles.actionButton}
                  text="Печать"
                />
              </div>
            )}
          </div>
          
          <div className={styles.filterSection}>
            <h2>Выборка</h2>
            <div className={styles.filters}>
              <div className={styles.dropdownWrapper}>
                <Dropdown
                  label="По предмету"
                  options={subjectOptions}
                  value={selectedSubject}
                  onChange={setSelectedSubject}/>
              </div>
              
              <div className={styles.dropdownWrapper}>
                <Dropdown
                  label="По преподавателю"
                  options={[]}
                  value={selectedTeacher}
                  onChange={setSelectedTeacher}/>
              </div>
              
              <div className={styles.dropdownWrapper}>
                <Dropdown
                  label="По группе"
                  options={[]}
                  value={selectedGroup}
                  onChange={setSelectedGroup}/>
              </div>
              
              <div className={styles.dropdownWrapper}>
                <Dropdown
                  label="По паре"
                  options={[]}
                  value={null}
                  onChange={() => {
                  }}/>
              </div>
            
            </div>
            <div className={styles.checkboxList}>
              {subjectOptions.map((option) => (
                <label key={option.value} className={styles.checkbox}>
                  <input type="checkbox"/>
                  <span>{option.label}</span>
                </label>
              ))}
            </div>
            <Button className={styles.selectButton} text="Выбрать"/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadReports;