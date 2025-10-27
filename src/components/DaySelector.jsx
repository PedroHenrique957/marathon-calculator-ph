// /src/components/DaySelector.jsx

import React from 'react';

// Nomes dos dias
const DAYS = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

// Nomes em Português para exibir
const DAYS_PT = {
  Sunday: 'Domingo',
  Monday: 'Segunda',
  Tuesday: 'Terça',
  Wednesday: 'Quarta',
  Thursday: 'Quinta',
  Friday: 'Sexta',
  Saturday: 'Sábado',
};

// Recebe 'selectedDays' e 'onDayChange' do App.jsx via "props"
function DaySelector({ selectedDays, onDayChange }) {
  return (
    <div className="day-selector">
      {DAYS.map((day) => (
        <label key={day} className="day-label">
          <input
            type="checkbox"
            checked={selectedDays.includes(day)} // Verifica se o dia está no array
            onChange={() => onDayChange(day)} // Chama a função do App.jsx
          />
          {DAYS_PT[day]}
        </label>
      ))}
    </div>
  );
}

export default DaySelector;