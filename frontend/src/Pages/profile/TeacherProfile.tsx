import React, { useState } from 'react';
import styles from './TeacherProfile.module.scss';
import Dropdown, { Option } from './Components/Dropdown';
import Table from './Components/Table';
import DateRangePicker from './Components/DateRangePicker';
import Button from './Components/Button';
import { Logo } from '../../Components/Logo.tsx';
import {useNavigate} from 'react-router-dom';


interface Row {
  code: string;
  subject: string;
  group: string;
  time: string;
}

const rows: Row[] = [
  { code: '1.2.5.1', subject: 'Технологии программирования', group: 'АТ-03', time: '12:00-13:30 30.09.2024' },
  { code: '1.2.5.1', subject: 'Технологии программирования', group: 'АТ-02', time: '12:00-13:30 30.09.2024' },
  { code: '1.1.1', subject: 'Эффективные коммуникации', group: 'АТ-32', time: '10:15-11:45 29.09.2024' },
  { code: '1.1.1', subject: 'Эффективные коммуникации', group: 'АТ-31', time: '08:30-10:00 29.09.2024' },
  { code: '1.2.5.1', subject: 'Технологии программирования', group: 'АТ-10', time: '12:00-13:30 28.09.2024' },
];

const subjects: Option[] = [
  { label: 'Option 1', value: '1' },
  { label: 'Option 2', value: '2' },
  { label: 'Option 3', value: '3' },
];

const groups: Option[] = [
  { label: 'Группа', value: 'all' }
];

const navigate = useNavigate();

const handleLoadings = () => {
  navigate('/load')
}

const handleChangePassword = () => {
  navigate('/changePassword')
}

const TeacherProfile: React.FC = () => {
  const [selectedSubject, setSelectedSubject] = useState<Option | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<Option | null>(null);
  
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Logo />
        <div className={styles.headerButtons}>
          <Button text="Настроить выгрузку" onClick={handleLoadings}/>
          <Button text="Изменить пароль" onClick={handleChangePassword}/>
        </div>
      </header>
      
      <div className={styles.contentWrapper}>
        <div className={styles.content}>
          <div className={styles.datePickerSection}>
            <div className={styles.datePickerWrapper}>
              <p>Временной промежуток</p>
              <DateRangePicker/>
            </div>
            
            <Button text='Создать новую пару'/>
          </div>
          
          <div className={styles.tableWrapper}>
            <div className={styles.filtersSection}>
              <div className={styles.dropdownsWrapper}>
                <Dropdown
                  label="Предмет"
                  options={subjects}
                  value={selectedSubject}
                  onChange={setSelectedSubject}
                />
                <Dropdown
                  label="Группа"
                  options={groups}
                  value={selectedGroup}
                  onChange={setSelectedGroup}
                />
              </div>
              <Button text="Найти"/>
            </div>
            
            <div className={styles.tableContent}>
              <Table rows={rows}/>
            </div>
          </div>
          
          <div className={styles.loadMoreWrapper}>
            <Button text="Показать еще"/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherProfile;