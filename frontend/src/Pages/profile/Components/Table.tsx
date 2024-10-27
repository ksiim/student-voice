import React from 'react';

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
  <div className="overflow-x-auto">
    <table className="min-w-full border border-gray-300 rounded-lg">
      <thead>
      <tr>
        <th className="px-4 py-2 border-b text-center">Код</th>
        <th className="px-4 py-2 border-b text-center">Название предмета</th>
        <th className="px-4 py-2 border-b text-center">Группа</th>
        <th className="px-4 py-2 border-b text-center">Время проведения пары</th>
      </tr>
      </thead>
      <tbody>
      {rows.map((row, index) => (
        <tr key={index} className="border-b">
          <td className="px-4 py-2 text-center">{row.code}</td>
          <td className="px-4 py-2 text-center">{row.subject}</td>
          <td className="px-4 py-2 text-center">{row.group}</td>
          <td className="px-4 py-2 text-center">{row.time}</td>
        </tr>
      ))}
      </tbody>
    </table>
  </div>
);

export default Table;
