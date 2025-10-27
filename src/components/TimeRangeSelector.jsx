// /src/components/TimeRangeSelector.jsx

import React from 'react';

// Recebe os valores e as funções 'setter' do App.jsx
function TimeRangeSelector({ startTime, endTime, onStartTimeChange, onEndTimeChange }) {
  return (
    <div className="time-range-selector">
      <label htmlFor="start-time">De:</label>
      <input
        type="time"
        id="start-time"
        value={startTime} // ex: "06:00"
        onChange={(e) => onStartTimeChange(e.target.value)}
      />
      <label htmlFor="end-time">Até:</label>
      <input
        type="time"
        id="end-time"
        value={endTime} // ex: "12:00"
        onChange={(e) => onEndTimeChange(e.target.value)}
      />
    </div>
  );
}

export default TimeRangeSelector;