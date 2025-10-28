// /src/components/PaginationControls.jsx

import React from 'react';

function PaginationControls({
  currentPage,
  totalPages,
  onPageChange,
  onGoToFirst,
  onGoToLast,
  onGoToPrevious,
  onGoToNext
}) {

  // Cria um array de números [1, 2, 3, ..., totalPages] para o select
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="pagination-controls">
      {/* Botão Primeira Página */}
      <button 
        onClick={onGoToFirst} 
        disabled={currentPage === 1}
      >
        Primeira
      </button>

      {/* Botão Página Anterior */}
      <button 
        onClick={onGoToPrevious} 
        disabled={currentPage === 1}
      >
        Anterior
      </button>

      {/* Seletor de Página */}
      <select 
        value={currentPage} 
        onChange={(e) => onPageChange(parseInt(e.target.value, 10))}
      >
        {pageNumbers.map(number => (
          <option key={number} value={number}>
            Página {number}
          </option>
        ))}
      </select>

      {/* Botão Próxima Página */}
      <button 
        onClick={onGoToNext} 
        disabled={currentPage === totalPages}
      >
        Próxima
      </button>

      {/* Botão Última Página */}
      <button 
        onClick={onGoToLast} 
        disabled={currentPage === totalPages}
      >
        Última
      </button>
      
      {/* (Opcional) Mostra a página atual / total */}
      <span className="page-info">
         {currentPage} / {totalPages}
      </span>
    </div>
  );
}

export default PaginationControls;