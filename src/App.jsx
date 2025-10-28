// /src/App.jsx (Versão 1.2.0 com Paginação)

import { useState, useEffect } from "react";
import { CSVLink } from "react-csv"; // Para exportar
import { format } from "date-fns"; // Para formatar datas
import { ptBR } from "date-fns/locale"; // Para português

// Importa todos os seus componentes
import DaySelector from "./components/DaySelector";
import EpisodeInput from "./components/EpisodeInput";
import PaginationControls from "./components/PaginationControls"; // <- Importa componente de paginação
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

// --- Definir itens por página ---
const ITEMS_PER_PAGE = 20;

function App() {
  // === ESTADOS ===
  const [episodes, setEpisodes] = useState([]);
  const [selectedDays, setSelectedDays] = useState(defaultSelectedDays);
  const [startTime, setStartTime] = useState("06:00");
  const [endTime, setEndTime] = useState("12:00");
  const [schedule, setSchedule] = useState([]); // A lista COMPLETA
  const [exportData, setExportData] = useState([]);

  // --- Novo estado para a página atual ---
  const [currentPage, setCurrentPage] = useState(1);

  // === DADOS DERIVADOS (Cálculos de Paginação) ===
  const totalPages = Math.ceil(schedule.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  // Cria a "fatia" dos dados a serem exibidos na tabela
  const displayedSchedule = schedule.slice(startIndex, endIndex);

  // === EFEITOS ===

  // Efeito 1: CALCULAR o cronograma
  useEffect(() => {
    // 1. Lógica de ordenação (sort) REMOVIDA (como na v1.1.1)

    // 2. Chama a calculadora
    const calculated = calculateSchedule(
      episodes, // Usa o array 'episodes' original
      selectedDays,
      startTime,
      endTime
    );
    setSchedule(calculated);

    // --- Resetar para a página 1 sempre que os dados mudam ---
    setCurrentPage(1);

  }, [episodes, selectedDays, startTime, endTime]); // Dependências de cálculo

  // Efeito 2: PREPARAR dados para exportação CSV
  useEffect(() => {
    // Transforma o array 'schedule' COMPLETO em um formato simples para CSV
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
  }, [schedule]); // Roda sempre que o 'schedule' COMPLETO mudar

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
    // (O código completo de diagnóstico do CSV - sem alterações)
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

  // --- Novas funções para controlar a paginação ---
  const handlePageChange = (pageNumber) => {
    // Garante que o número da página esteja dentro dos limites
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };
  const goToFirstPage = () => setCurrentPage(1);
  const goToLastPage = () => setCurrentPage(totalPages);
  const goToPreviousPage = () => setCurrentPage(prev => Math.max(1, prev - 1));
  const goToNextPage = () => setCurrentPage(prev => Math.min(totalPages, prev + 1));


  // Cabeçalhos para o arquivo CSV de exportação (sem alterações)
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
          <EpisodeInput
            onManualAdd={addManualEpisode}
            onCsvAdd={addCsvEpisodes}
            episodeCount={episodes.length}
          />
        </div>

        <div className="output-section">
          <div className="output-header">
            <h2>
              3. Seu Cronograma ({startTime} - {endTime})
            </h2>

            {/* Lógica do botão fixo/desabilitado */}
            {schedule.length > 0 ? (
              <CSVLink
                data={exportData} // Exporta TODOS os dados, não apenas a página atual
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

          {/* --- Passa a fatia 'displayedSchedule' para a tabela --- */}
          <ScheduleTable schedule={displayedSchedule} />

          {/* --- Adiciona os controles de paginação (se houver mais de 1 página) --- */}
          {totalPages > 1 && (
            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange} // Para o select
              onGoToFirst={goToFirstPage}
              onGoToLast={goToLastPage}
              onGoToPrevious={goToPreviousPage}
              onGoToNext={goToNextPage}
            />
          )}

        </div>
      </main>

      <footer className="app-footer">
        {/* --- Atualizar a Versão --- */}
        <p>Versão 1.2.0</p>
        <p>&copy; 2025 Pedro Henrique. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}

export default App;