import React, {useState} from 'react';
import styles from './LoadClass.module.scss';
import Header from '../../NewComponents/Header/Header_teacher/Header.tsx';
import Button from '../../NewComponents/Button/Button.tsx';


interface LoadClassProps {
  items: any[];
}

const LoadClass:React.FC<LoadClassProps> = ({items}) => {
  const [repeatFrequency, setRepeatFrequency] = useState<string>('');
  
  
  return (
    <div className={styles.wrapper}>
      <Header/>
      
      <div className={styles.content}>
        <h2 className={styles.content__title}>Настройка выгрузки пар</h2>
        
        <fieldset className={styles.buttonGroup}>
          <p className={styles.buttonGroup__title}>Делать выгрузку раз в</p>
          
          <div className={styles.buttonGroup__radioButton}>
            <input
              type="radio"
              id="everyWeek"
              name="repeatFrequency"
              value="everyWeek"
              checked={repeatFrequency === 'twoWeeks'}
              onChange={() => setRepeatFrequency('twoWeeks')}
            />
            <label htmlFor="everyWeek">2 недели</label>
          </div>
          
          <div className={styles.buttonGroup__radioButton}>
            <input
              type="radio"
              id="evenWeeks"
              name="repeatFrequency"
              value="evenWeeks"
              checked={repeatFrequency === 'month'}
              onChange={() => setRepeatFrequency('month')}
            />
            <label htmlFor="evenWeeks">Месяц</label>
          </div>
        </fieldset>
        <div className={styles.content__bottomButtons}>
          <Button type={'button'} text={'Выгрузить'} color={'#1E4391'}/>
          <Button type={'button'} text={'Создать пару'} color={'#1E4391'}/>
        </div>
        
        <div className={styles.list}>
          <h2 className={styles.list__title}>Выгруженные пары</h2>
          <table className={styles.list__table}>
            <thead>
            <tr>
              <th>Название предмета</th>
              <th>Группа</th>
              <th>Время</th>
              <th>Дата</th>
              <th>Место</th>
            </tr>
            </thead>
            <tbody>
            {items.map((item, index) => (
              <tr key={index}>
                <td>{item.subject}</td>
                <td>{item.group}</td>
                <td>{item.time}</td>
                <td>{item.date.toLocaleDateString()}</td>
                <td>{item.place}</td>
              </tr>
            ))}
            </tbody>
          </table>
          <div className={styles.list__button}><Button type={'button'}
                                                       text={'Показать ещё'}
                                                       color={'#1E4391'}/></div>
        </div>
      
      
      </div>
    </div>
  );
};

export default LoadClass;