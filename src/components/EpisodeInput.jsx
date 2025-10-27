// /src/components/EpisodeInput.jsx

import React, { useState } from 'react';
import Papa from 'papaparse'; // Importa a biblioteca de CSV

// Recebe as funções 'onManualAdd' e 'onCsvAdd' do App.jsx
function EpisodeInput({ onManualAdd, onCsvAdd }) {
  // Estados "internos" apenas para o formulário manual
  const [series, setSeries] = useState('');
  const [season, setSeason] = useState(1);
  const [epNum, setEpNum] = useState(1);
  const [duration, setDuration] = useState(45);

  // Manipulador para o formulário manual
   const handleSubmit = (e) => {
    e.preventDefault(); // Impede o recarregamento da página
    if (!series || duration <= 0) {
      alert('Preencha pelo menos o nome da série e uma duração válida.');
      return;
    }

    // Pega os valores atuais (garantindo que são números)
    const currentSeason = parseInt(season, 10);
    const currentEpNum = parseInt(epNum, 10);
    const currentDuration = parseInt(duration, 10);

    // Envia os dados atuais para o App.jsx
    onManualAdd({
      series,
      season: currentSeason,
      epNum: currentEpNum,
      duration: currentDuration,
    });
     
    // Reseta os outros campos para o padrão
     // setSeries(''); // <<--- Deixe esta linha COMENTADA ou APAGUE ELA
     // setSeason(''); // <<--- Deixe esta linha COMENTADA ou APAGUE ELA
    setEpNum(currentEpNum + 1); // Incrementa o número do episódio
     // setDuration(); // <<--- Deixe esta linha COMENTADA ou APAGUE ELA
  };

  // Manipulador para o upload do arquivo CSV
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          // Apenas envia os dados brutos (results.data) para o App.jsx
          onCsvAdd(results.data); 
        },
        error: (err) => {
          alert('Erro ao ler o CSV:', err.message);
        },
      });
    }
  };

  return (
    <div className="episode-input-container">
      {/* --- Formulário Manual --- */}
      <form onSubmit={handleSubmit} className="manual-form">
        <h4>Adicionar Manualmente</h4>
        <input
          type="text"
          placeholder="Nome da Série"
          value={series}
          onChange={(e) => setSeries(e.target.value)}
        />
        <input
          type="number"
          placeholder="Temporada"
          value={season}
          min="1"
          onChange={(e) => setSeason(e.target.value)}
        />
        <input
          type="number"
          placeholder="Episódio"
          value={epNum}
          min="1"
          onChange={(e) => setEpNum(e.target.value)}
        />
        <input
          type="number"
          placeholder="Duração (min)"
          value={duration}
          min="1"
          onChange={(e) => setDuration(e.target.value)}
        />
        <button type="submit">Adicionar Ep</button>
      </form>

      {/* --- Upload CSV --- */}
      <div className="csv-upload">
        <h4>Importar via CSV</h4>
        <p>
          O CSV deve ter as colunas: <strong>Serie, Temporada, Episodio, Duracao</strong>
        </p>
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
}

export default EpisodeInput;