import React from 'react';
import Dropdown from './Components/Dropdown';
import Table from './Components/Table';
import DateRangePicker from './Components/DateRangePicker';
import Button from './Components/Button';
import {Logo} from '../../Components/Logo.tsx';

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

const TeacherProfile: React.FC = () => (
  <div className="p-6 bg-gray-100 min-h-screen  items-center">
    <header className="mb-8 p-4 flex justify-between items-center">
      <Logo/>
      <div className="flex space-x-2 ml-auto">
        <Button text="Настроить выгрузку"/>
        <Button text="Изменить пароль"/>
      </div>
    </header>
    
    <div className='flex justify-center'>
      <div className="p-6 rounded-lg shadow-md w-full max-w-4xl">
        <div className="flex justify-between mb-4 items-center">
          <div className='flex gap-2 items-center'>
            <p>Временной промежуток</p>
            <DateRangePicker />
          </div>
          
          <Button text='Создать новую пару' />
        </div>
        
        <div className="flex space-x-4 mb-4 items-center">
          <div className=''>
            <Dropdown label="Предмет" options={[{ label: 'Все', value: 'all' }]} />
            <Dropdown label="Группа" options={[{ label: 'Все', value: 'all' }]} />
          </div>
          <Button text="Найти" />
        </div>
        
        <Table rows={rows} />
        
        <div className="flex justify-center mt-4">
          <Button text="Показать еще" />
        </div>
      </div>
    </div>
  </div>
);


export default TeacherProfile;
