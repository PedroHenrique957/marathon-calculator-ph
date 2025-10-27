// /src/App.jsx

import { useState, useEffect } from 'react';
import DaySelector from './components/DaySelector';
import EpisodeInput from './components/EpisodeInput';
import ScheduleTable from './components/ScheduleTable';
import TimeRangeSelector from './components/TimeRangeSelector'; // Importa o novo componente
import { calculateSchedule } from './logic/calculator';
import './App.css';

// Valor inicial para os dias da semana (fora do componente)
const defaultSelectedDays = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
];

function App() {
  // === ESTADOS ===
  const [episodes, setEpisodes] = useState([]);
  const [selectedDays, setSelectedDays] = useState(defaultSelectedDays);
  const [schedule, setSchedule] = useState([]);
  
  // Novos estados para o horário
  const [startTime, setStartTime] = useState('06:00'); // Valor padrão
  const [endTime, setEndTime] = useState('12:00');   // Valor padrão

  // === EFEITO ===
  // Recalcula o cronograma quando qualquer dado de entrada mudar
  useEffect(() => {
    // 1. Ordena os episódios (Série > Temporada > Episódio)
    const sortedEpisodes = [...episodes].sort((a, b) => {
      if (a.series < b.series) return -1;
      if (a.series > b.series) return 1;
      if (a.season < b.season) return -1;
      if (a.season > b.season) return 1;
      if (a.epNum < b.epNum) return -1;
      if (a.epNum > b.epNum) return 1;
      return 0;
    });

    // 2. Chama a calculadora passando todos os dados necessários
    const calculated = calculateSchedule(
      sortedEpisodes,
      selectedDays,
      startTime,
      endTime
    );
    
    setSchedule(calculated);
    
  }, [episodes, selectedDays, startTime, endTime]); // Dependências

  // === FUNÇÕES (Handlers) ===

  // Adiciona ou remove um dia da semana
  const handleDayChange = (day) => {
    setSelectedDays((currentDays) => {
      if (currentDays.includes(day)) {
        return currentDays.filter((d) => d !== day);
      }
      return [...currentDays, day];
    });
  };

  // Adiciona um episódio do formulário manual
  const addManualEpisode = (episode) => {
    // Adiciona o novo episódio ao final da lista de episódios
    setEpisodes((currentEpisodes) => [
      ...currentEpisodes,
      { id: Date.now(), ...episode },
    ]);
  };

  // Adiciona episódios do CSV (com diagnóstico de erro)
  const addCsvEpisodes = (csvData) => {
    console.log("Dados brutos recebidos do CSV:", csvData);

    // 1. Verifica se o CSV não está vazio
    if (!Array.isArray(csvData) || csvData.length === 0) {
      alert("Erro na importação: O arquivo CSV está vazio ou em um formato inválido.");
      return;
    }

    // 2. Pega os cabeçalhos
    const headersEncontrados = Object.keys(csvData[0]);

    // 3. Define os cabeçalhos esperados
    const headersEsperados = ['Serie', 'Temporada', 'Episodio', 'Duracao'];

    // 4. Compara
    const headersFaltando = [];
    for (const header of headersEsperados) {
      if (!headersEncontrados.includes(header)) {
        headersFaltando.push(header);
      }
    }

    // 5. Mostra o alerta de erro se faltar cabeçalho
    if (headersFaltando.length > 0) {
      alert(
        `ERRO NA IMPORTAÇÃO DO CSV!\n\n` +
        `O código não encontrou as seguintes colunas obrigatórias:\n` +
        `-> ${headersFaltando.join('\n-> ')}\n\n` +
        `O seu arquivo CSV tem estas colunas:\n` +
        `-> ${headersEncontrados.join('\n-> ')}\n\n` +
        `Por favor, corrija os nomes no seu arquivo .csv (sem acentos, exatamente como esperado) e tente novamente.`
      );
      return;
    }
    
    // Se passou no teste, continua
    
    // 1. Formata os dados
    const formattedEpisodes = csvData.map((row, index) => ({
      id: `csv-${index}-${Date.now()}`,
      series: row.Serie,
      season: parseInt(row.Temporada, 10),
      epNum: parseInt(row.Episodio, 10),
      duration: parseInt(row.Duracao, 10),
    }));

    // 2. Filtra linhas inválidas (NaN)
    const validEpisodes = formattedEpisodes.filter(
      ep => ep.series && !isNaN(ep.season) && !isNaN(ep.epNum) && !isNaN(ep.duration)
    );

    // 3. Verifica se os dados são válidos
    if (validEpisodes.length === 0 && formattedEpisodes.length > 0) {
      alert(
        `Os cabeçalhos do CSV estão corretos, mas os dados parecem inválidos!\n` +
        `Verifique se as colunas 'Temporada', 'Episodio' e 'Duracao' contêm apenas números.`
      );
    } else if (validEpisodes.length === 0) {
      alert(`Os cabeçalhos estão corretos, mas nenhum episódio válido foi encontrado no CSV.`);
    }

    // 4. Define o estado
    setEpisodes(validEpisodes);
  };


  // === RENDERIZAÇÃO ===
  return (
    <div className="app-container">
      <header>
        <h1>Calculadora de Maratona 🍿</h1>
      </header>

      <main>
        <div className="inputs-section">
          <h2>1. Quando assistir?</h2>
          <DaySelector
            selectedDays={selectedDays}
            onDayChange={handleDayChange}
          />
          
          <TimeRangeSelector
            startTime={startTime}
            endTime={endTime}
            onStartTimeChange={setStartTime}
            onEndTimeChange={setEndTime}
          />
          
          <h2>2. O que assistir?</h2>
          <EpisodeInput
            onManualAdd={addManualEpisode}
            onCsvAdd={addCsvEpisodes}
          />
          {episodes.length > 0 && (
            <p>
              <strong>{episodes.length}</strong> episódios na fila.
            </p>
          )}
        </div>

        <div className="output-section">
          <h2>3. Seu Cronograma ({startTime} - {endTime})</h2>
          <ScheduleTable schedule={schedule} />
        </div>
      </main>

      <footer className="app-footer">
        <p>Versão 1.0.0</p>
        <p>&copy; 2025 Pedro Henrique. Todos os direitos reservados.</p>
      </footer>
      
    </div>
  );
}

export default App;