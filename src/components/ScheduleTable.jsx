// /src/components/ScheduleTable.jsx

import React from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale"; // <-- 1. IMPORTAR O IDIOMA PORTUGUÊS

// Recebe o 'schedule' (cronograma) do App.jsx
function ScheduleTable({ schedule }) {
  // Se a lista estiver vazia, mostre uma mensagem
  if (schedule.length === 0) {
    return <p>Selecione os dias e adicione episódios para ver o cronograma.</p>;
  }

  return (
    <table className="schedule-table">
      <thead>
        <tr>
          <th>Ep. Maratona</th>
          <th>Data</th>
          <th>Horário</th>
          <th>Série</th>
          <th>Episódio</th>
          <th>Duração</th>
        </tr>
      </thead>
      <tbody>
        {schedule.map((item) => (
          <tr key={item.marathonEp}>
            <td>{item.marathonEp}</td>

            {/* --- MUDANÇA AQUI --- */}
            {/* 2. Adicione { locale: ptBR } às opções do 'format' */}
            <td>{format(item.day, "dd/MM/yyyy (EEE)", { locale: ptBR })}</td>
            {/* --- FIM DA MUDANÇA --- */}

            <td>
              {format(item.startTime, "HH:mm")} -{" "}
              {format(item.endTime, "HH:mm")}
            </td>
            <td>{item.series}</td>
            <td>{`S${item.season} E${item.epNum}`}</td>
            <td>{item.duration} min</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default ScheduleTable;
