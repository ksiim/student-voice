import React from 'react';
import styles from './Table.module.scss';

interface Row {
  code: string;
  subject: string;
  group: string;
  time: string;
}

interface TableProps {
  rows: Row[];
}

const Table: React.FC<TableProps> = ({ rows }) => (
  <div className={styles.wrapper}>
    <table className={styles.table}>
      <thead>
      <tr>
        <th className={styles.headerCell}>Код</th>
        <th className={styles.headerCell}>Название предмета</th>
        <th className={styles.headerCell}>Группа</th>
        <th className={styles.headerCell}>Время проведения пары</th>
      </tr>
      </thead>
      <tbody>
      {rows.map((row, index) => (
        <tr key={index} className={styles.row}>
          <td className={styles.cell}>{row.code}</td>
          <td className={styles.cell}>{row.subject}</td>
          <td className={styles.cell}>{row.group}</td>
          <td className={styles.cell}>{row.time}</td>
        </tr>
      ))}
      </tbody>
    </table>
  </div>
);

export default Table;