import React from 'react';
import { Logo } from '../../Components/Logo';
import DateRangePicker from '../profile/Components/DateRangePicker';
import styles from './AdminPanel.module.scss';

interface DropdownProps {
  label: string;
  options: Array<{ value: string | number; label: string }>;
  onChange: (value: string | number | null) => void;
}

const Dropdown: React.FC<DropdownProps> = ({ label, options, onChange }) => {
  return (
    <div>
      <label>{label}</label>
      <select onChange={(e) => onChange(e.target.value || null)}>
        <option value="">Select...</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

interface Metric {
  name: string;
  perLesson: string | number;
  perMonth: number | string;
  perSemester: string | number;
}

interface AdminPanelProps {
  onSave?: () => void;
  onPrint?: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onSave, onPrint }) => {
  const metrics: Metric[] = [
    { name: 'CSAT', perLesson: 'нет', perMonth: 4.578, perSemester: 'идит' },
    { name: 'ODSATCSS', perLesson: 'нет', perMonth: 4.120, perSemester: 'сбор' },
    { name: 'CSI', perLesson: 'нет', perMonth: 3.014, perSemester: 'данных' },
    { name: 'NPS', perLesson: '-', perMonth: '-', perSemester: 7.863 },
  ];
  
  const teacherOptions = [
    { value: '1', label: 'Teacher 1' },
    { value: '2', label: 'Teacher 2' },
  ];
  
  const subjectOptions = [
    { value: '1', label: 'Subject 1' },
    { value: '2', label: 'Subject 2' },
  ];
  
  const groupOptions = [
    { value: '1', label: 'Group 1' },
    { value: '2', label: 'Group 2' },
  ];
  
  const lessonOptions = [
    { value: '1', label: 'Lesson 1' },
    { value: '2', label: 'Lesson 2' },
  ];
  
  const handleTeacherChange = (value: string | number | null): void => {
    console.log('Teacher:', value);
  };
  
  const handleSubjectChange = (value: string | number | null): void => {
    console.log('Subject:', value);
  };
  
  const handleGroupChange = (value: string | number | null): void => {
    console.log('Group:', value);
  };
  
  const handleLessonChange = (value: string | number | null): void => {
    console.log('Lesson:', value);
  };
  
  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <Logo />
          <div className={styles.headerButtons}>
            <button className={styles.headerButton}>Выгрузка отчетов</button>
            <button className={styles.headerButton}>Пользователи</button>
          </div>
        </div>
      </header>
      
      <main className={styles.main}>
        <h1 className={styles.title}>Панель администратора</h1>
        
        <div className={styles.container}>
          <div className={styles.filters}>
            <DateRangePicker />
            
            <div className={styles.dropdowns}>
              <div className={styles.dropdownWrapper}>
                <Dropdown
                  label="Преподаватель"
                  options={teacherOptions}
                  onChange={handleTeacherChange}
                />
              </div>
              
              <div className={styles.dropdownWrapper}>
                <Dropdown
                  label="Предмет"
                  options={subjectOptions}
                  onChange={handleSubjectChange}
                />
              </div>
              
              <div className={styles.dropdownWrapper}>
                <Dropdown
                  label="Группа"
                  options={groupOptions}
                  onChange={handleGroupChange}
                />
              </div>
              
              <div className={styles.dropdownWrapper}>
                <Dropdown
                  label="Пара"
                  options={lessonOptions}
                  onChange={handleLessonChange}
                />
              </div>
              
              <button className={styles.findButton}>
                Найти
              </button>
            </div>
          </div>
          
          <div className={styles.metricsTable}>
            <div className={styles.tableHeader}>
              <div className={styles.metricName}></div>
              <div>За пару</div>
              <div>За месяц</div>
              <div>За семестр</div>
            </div>
            
            {metrics.map((metric) => (
              <div key={metric.name} className={styles.tableRow}>
                <div className={styles.metricName}>{metric.name}</div>
                <div>{metric.perLesson}</div>
                <div>{metric.perMonth}</div>
                <div>{metric.perSemester}</div>
              </div>
            ))}
          </div>
          
          <div className={styles.actions}>
            <button
              className={styles.saveButton}
              onClick={onSave}
            >
              Сохранить как
            </button>
            
            <button
              className={styles.printButton}
              onClick={onPrint}
            >
              Печать
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminPanel;