// /src/components/EpisodeInput.jsx

import React, { useState } from "react";
import Papa from "papaparse"; // Importa a biblioteca de CSV

// --- MUDANÇA 1: Aceitar a nova prop "episodeCount" ---
function EpisodeInput({ onManualAdd, onCsvAdd, episodeCount }) {
  // Estados "internos" (lógica de auto-incremento)
  const [series, setSeries] = useState("");
  const [season, setSeason] = useState(1);
  const [epNum, setEpNum] = useState(1);
  const [duration, setDuration] = useState(45);

  // Manipulador para o formulário manual
  const handleSubmit = (e) => {
    e.preventDefault(); 

    const currentSeries = series.trim();
    const currentSeason = parseInt(season, 10) || 1;
    const currentEpNum = parseInt(epNum, 10) || 1;
    const currentDuration = parseInt(duration, 10);

    // Validação
    if (!currentSeries || !currentDuration || currentDuration <= 0) {
      alert("Preencha pelo menos o Nome da Série e uma Duração (em minutos) válida.");
      return;
    }

    // Envia os dados atuais para o App.jsx
    onManualAdd({
      series: currentSeries,
      season: currentSeason,
      epNum: currentEpNum,
      duration: currentDuration,
    });

    // --- Lógica de Auto-incremento ---
    setEpNum(currentEpNum + 1); // ACRESCENTA +1 no episódio
  };

  // Manipulador para o upload do arquivo CSV
  const handleFileChange = (e) => {
    // ... (código do handleFileChange - sem alteração)
    const file = e.target.files[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          onCsvAdd(results.data);
        },
        error: (err) => {
          alert("Erro ao ler o CSV:", err.message);
        },
      });
    }
  };

  return (
    <div className="episode-input-container">
      {/* --- Formulário Manual --- */}
      <form onSubmit={handleSubmit} className="manual-form">
        <h4>Adicionar Manualmente</h4>
        
        {/* ... (todos os <div className="form-group"> ... ) */}
        <div className="form-group">
          <label htmlFor="series-input">Nome da Série:</label>
          <input
            type="text"
            id="series-input"
            placeholder="Ex: Agent X"
            value={series}
            onChange={(e) => setSeries(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="season-input">Temporada:</label>
          <input
            type="number"
            id="season-input"
            value={season}
            min="1"
            onChange={(e) => setSeason(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="epNum-input">Episódio:</label>
          <input
            type="number"
            id="epNum-input"
            value={epNum}
            min="1"
            onChange={(e) => setEpNum(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="duration-input">Duração (min):</label>
          <input
            type="number"
            id="duration-input"
            value={duration}
            min="1"
            onChange={(e) => setDuration(e.target.value)}
          />
        </div>
        
        <button type="submit">Adicionar Ep</button>
        
        {/* --- MUDANÇA 2: Contador movido para cá --- */}
        {/* Fica entre o botão e o fim do <form> (o divisor) */}
        {episodeCount > 0 && (
          <p className="episode-counter">
            <strong>{episodeCount}</strong> episódios na fila.
          </p>
        )}
        {/* --- FIM DA MUDANÇA --- */}
        
      </form> {/* <--- O divisor (borda) é aplicado aqui */}

      {/* --- Upload CSV --- */}
      <div className="csv-upload">
        <h4>Importar via CSV</h4>
        <p>
          O CSV deve ter as colunas:{" "}
          <strong>Serie, Temporada, Episodio, Duracao</strong>
        </p>
        <input type="file" accept=".csv" onChange={handleFileChange} />
        <img
          src="/exemplo-csv.png" 
          alt="Exemplo do formato CSV"
          className="csv-example-image" 
        />
      </div>
    </div>
  );
}

export default EpisodeInput;