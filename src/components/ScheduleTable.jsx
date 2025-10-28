// /src/components/ScheduleTable.jsx

import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale'; // Importa o idioma pt-BR

// Recebe a prop 'schedule', que agora é a *fatia* da página atual
function ScheduleTable({ schedule }) {
  // Se a lista (fatia) estiver vazia, mostre a mensagem
  if (!schedule || schedule.length === 0) {
    return <p>Nenhum episódio agendado para esta página ou seleção.</p>;
  }

  return (
    <table className="schedule-table">
      <thead>
        <tr>
          {/* Cabeçalhos da tabela */}
          <th>Ep. Maratona</th>
          <th>Data</th>
          <th>Horário</th>
          <th>Série</th>
          <th>Episódio</th>
          <th>Duração</th>
        </tr>
      </thead>
      <tbody>
        {/* Mapeia a lista 'schedule' (fatia da página atual) */}
        {schedule.map((item) => (
          <tr key={item.marathonEp}>
            {/* Coluna 1: Número do Episódio na Maratona */}
            <td>{item.marathonEp}</td>

            {/* Coluna 2: Data (com quebra de linha) */}
            <td className="wrap-date"> {/* Adiciona classe para CSS */}
              {/* Data em uma linha */}
              <span>{format(item.day, 'dd/MM/yyyy', { locale: ptBR })}</span>
              {/* Dia da semana na linha abaixo */}
              <span>({format(item.day, 'EEE', { locale: ptBR })})</span>
            </td>

            {/* Coluna 3: Horário (sem quebra específica) */}
            <td>
              {format(item.startTime, 'HH:mm')} - {format(item.endTime, 'HH:mm')}
            </td>

            {/* Coluna 4: Nome da Série (com quebra de linha) */}
            <td className="wrap-text">{item.series}</td> {/* Adiciona classe para CSS */}

            {/* Coluna 5: Temporada/Episódio (sem quebra específica) */}
            <td>{`S${item.season} E${item.epNum}`}</td>

            {/* Coluna 6: Duração (sem quebra específica) */}
            <td>{item.duration} min</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default ScheduleTable;