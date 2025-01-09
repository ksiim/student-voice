import React, {useState} from 'react';
import styles from './Metrics.module.scss';
import Header from '../../NewComponents/Header/Header_admin/Header.tsx';
import ClassListDateTimePicker
  from '../../NewComponents/ClassListDateTimePicker/ClassListDateTimePicker.tsx';
import MultiSelectDropdown
  from '../../NewComponents/MultiSelectDropdown/MultiSelectDropdown.tsx';
import Button from '../../NewComponents/Button/Button.tsx';


interface FilterState {
  subjects: string[];
  selectedSubjects: string[];
  teachers: string[];
  selectedTeachers: string[];
  groups: string[];
  selectedGroups: string[];
}



const Metrics:React.FC = () => {
  
  const [filter, setFilter] = useState<FilterState>({
    subjects: [
      'Операционные системы',
      'Технологии программирования',
      'Базы данных',
      'Веб-разработка',
      'Компьютерные сети'
    ],
    selectedSubjects: [],
    groups: [
      'АТ-01',
      'АТ-02',
      'АТ-03',
      'АТ-04',
      'АТ-11',
      'АТ-12',
      'АТ-13',
      'АТ-22',
      'АТ-23'
    ],
    selectedGroups: [],
    teachers: [
      'В ожидании',
      'Проведено',
      'Не проведено'
    ],
    selectedTeachers: []
  });
  
  const handleFilterChange = (
    filterType: 'selectedSubjects' | 'selectedGroups' | 'selectedTeachers',
    selected: string[]
  ) => {
    setFilter(prev => ({
      ...prev,
      [filterType]: selected
    }));
  };
  
  
  return (
    <div className={styles.wrapper}>
      <Header />
      <div className={styles.innerWrapper}>
        <div className={styles.content}>
          <h2 className={styles.content__title}>Выгрузка метрик и отчетов</h2>
          
          <div className={styles.content__controls}>
            <ClassListDateTimePicker/>
            
            <div className={styles.selectors}>
              <MultiSelectDropdown
                label='Предмет'
                options={filter.subjects}
                selectedOptions={filter.selectedSubjects}
                onOptionSelect={(selected) => handleFilterChange('selectedSubjects', selected)}
                placeholder={'Выбрать'}
              />
              
              <MultiSelectDropdown
                label='Преподаватель'
                options={filter.teachers}
                selectedOptions={filter.selectedTeachers}
                onOptionSelect={(selected) => handleFilterChange('selectedTeachers', selected)}
                placeholder={'Добавить'}
              />
              
              <MultiSelectDropdown
                label='Учебная группа'
                options={filter.groups}
                selectedOptions={filter.selectedGroups}
                onOptionSelect={(selected) => handleFilterChange('selectedGroups', selected)}
                placeholder={'Добавить только для отчёта'}
              />
            </div>
            
            <div className={styles.content__controls__buttons}>
              <Button text={'Создать отчёт'} type={'button'} onClick={() => {}}/>
              <Button text={'Получить метрики'} type={'button'} onClick={() => {}}/>
            </div>
            
          </div>
        </div>
        
        <div className={styles.metrics}>
          <h2 className={styles.metrics__title}>Метрики сформированы</h2>
        </div>
        
        <div className={styles.report}>
          <h2 className={styles.report__title}>Отчет сформирован</h2>
          
          <Button text={'Сохранить'} type={'button'} onClick={() => {}}/>
        </div>
      </div>
    </div>
  );
};

export default Metrics;