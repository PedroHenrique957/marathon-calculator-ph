// /src/App.jsx

import { useState, useEffect } from "react";
import { CSVLink } from "react-csv"; // Para exportar
import { format } from "date-fns"; // Para formatar datas
import { ptBR } from "date-fns/locale"; // Para português

// Importa todos os seus componentes
import DaySelector from "./components/DaySelector";
import EpisodeInput from "./components/EpisodeInput";
import ScheduleTable from "./components/ScheduleTable";
import TimeRangeSelector from "./components/TimeRangeSelector";
import { calculateSchedule } from "./logic/calculator";
import "./App.css"; // Estilos principais

// Valor inicial para os dias da semana
const defaultSelectedDays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
];

function App() {
  // === ESTADOS ===
  // O app sempre começa com estes valores padrão:

  const [episodes, setEpisodes] = useState([]); // Começa vazio

  const [selectedDays, setSelectedDays] = useState(defaultSelectedDays); // Começa com Seg-Sex

  const [startTime, setStartTime] = useState("06:00"); // Começa às 06:00

  const [endTime, setEndTime] = useState("12:00"); // Começa às 12:00

  // 'schedule' (o resultado) não precisa ser salvo, é sempre calculado
  const [schedule, setSchedule] = useState([]);

  // Estado para os dados formatados para exportação
  const [exportData, setExportData] = useState([]);

  // === EFEITOS ===

  // Efeito 1: CALCULAR o cronograma
  useEffect(() => {
    // 1. Ordena os episódios
    const sortedEpisodes = [...episodes].sort((a, b) => {
      if (a.series < b.series) return -1;
      if (a.series > b.series) return 1;
      if (a.season < b.season) return -1;
      if (a.season > b.season) return 1;
      if (a.epNum < b.epNum) return -1;
      if (a.epNum > b.epNum) return 1;
      return 0;
    });

    // 2. Chama a calculadora
    const calculated = calculateSchedule(
      sortedEpisodes,
      selectedDays,
      startTime,
      endTime
    );
    setSchedule(calculated);
  }, [episodes, selectedDays, startTime, endTime]); // Dependências de cálculo

  // Efeito 2: PREPARAR dados para exportação CSV
  useEffect(() => {
    // Transforma o array 'schedule' (com objetos Date) em um formato simples para CSV
    const formattedData = schedule.map((item) => ({
      marathonEp: item.marathonEp,
      date: format(item.day, "dd/MM/yyyy (EEE)", { locale: ptBR }),
      time: `${format(item.startTime, "HH:mm")} - ${format(
        item.endTime,
        "HH:mm"
      )}`,
      series: item.series,
      episode: `S${item.season}E${item.epNum}`,
      duration: item.duration,
    }));
    setExportData(formattedData);
  }, [schedule]); // Roda sempre que o 'schedule' (resultado) mudar

  // === FUNÇÕES (Handlers) ===

  const handleDayChange = (day) => {
    setSelectedDays((currentDays) => {
      if (currentDays.includes(day)) {
        return currentDays.filter((d) => d !== day);
      }
      return [...currentDays, day];
    });
  };

  const addManualEpisode = (episode) => {
    setEpisodes((currentEpisodes) => [
      ...currentEpisodes,
      { id: Date.now(), ...episode },
    ]);
  };

  const addCsvEpisodes = (csvData) => {
    // (O código completo de diagnóstico do CSV)
    if (!Array.isArray(csvData) || csvData.length === 0) {
      alert(
        "Erro na importação: O arquivo CSV está vazio ou em um formato inválido."
      );
      return;
    }
    const headersEncontrados = Object.keys(csvData[0]);
    const headersEsperados = ["Serie", "Temporada", "Episodio", "Duracao"];
    const headersFaltando = [];
    for (const header of headersEsperados) {
      if (!headersEncontrados.includes(header)) {
        headersFaltando.push(header);
      }
    }
    if (headersFaltando.length > 0) {
      alert(
        `ERRO NA IMPORTAÇÃO DO CSV!\n\n` +
          `O código não encontrou as seguintes colunas obrigatórias:\n` +
          `-> ${headersFaltando.join("\n-> ")}\n\n` +
          `O seu arquivo CSV tem estas colunas:\n` +
          `-> ${headersEncontrados.join("\n-> ")}\n\n` +
          `Por favor, corrija os nomes no seu arquivo .csv (sem acentos, exatamente como esperado) e tente novamente.`
      );
      return;
    }
    const formattedEpisodes = csvData.map((row, index) => ({
      id: `csv-${index}-${Date.now()}`,
      series: row.Serie,
      season: parseInt(row.Temporada, 10),
      epNum: parseInt(row.Episodio, 10),
      duration: parseInt(row.Duracao, 10),
    }));
    const validEpisodes = formattedEpisodes.filter(
      (ep) =>
        ep.series &&
        !isNaN(ep.season) &&
        !isNaN(ep.epNum) &&
        !isNaN(ep.duration)
    );
    if (validEpisodes.length === 0 && formattedEpisodes.length > 0) {
      alert(
        `Os cabeçalhos do CSV estão corretos, mas os dados parecem inválidos!\n` +
          `Verifique se as colunas 'Temporada', 'Episodio' e 'Duracao' contêm apenas números.`
      );
    } else if (validEpisodes.length === 0) {
      alert(
        `Os cabeçalhos estão corretos, mas nenhum episódio válido foi encontrado no CSV.`
      );
    }
    setEpisodes(validEpisodes);
  };

  // Cabeçalhos para o arquivo CSV de exportação
  const exportHeaders = [
    { label: "Ep. Maratona", key: "marathonEp" },
    { label: "Data", key: "date" },
    { label: "Horário", key: "time" },
    { label: "Série", key: "series" },
    { label: "Episódio", key: "episode" },
    { label: "Duração (min)", key: "duration" },
  ];

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
          {/* <-- MUDANÇA 1: Passa a contagem */}
          <EpisodeInput
            onManualAdd={addManualEpisode}
            onCsvAdd={addCsvEpisodes}
            episodeCount={episodes.length}
          />
          {/* MUDANÇA 2: O <p> foi removido daqui */}
        </div>

        <div className="output-section">
          <div className="output-header">
            <h2>
              3. Seu Cronograma ({startTime} - {endTime})
            </h2>

            {/* Lógica do botão fixo/desabilitado */}
            {schedule.length > 0 ? (
              <CSVLink
                data={exportData}
                headers={exportHeaders}
                filename={"minha_maratona.csv"}
                className="export-button"
              >
                Exportar Cronograma (CSV)
              </CSVLink>
            ) : (
              <span
                className="export-button export-button-disabled"
                title="Adicione episódios para poder exportar"
              >
                Exportar Cronograma (CSV)
              </span>
            )}
          </div>
          <ScheduleTable schedule={schedule} />
        </div>
      </main>

      <footer className="app-footer">
        <p>Versão 1.1.0</p>
        <p>&copy; 2025 Pedro Henrique. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}

export default App;
