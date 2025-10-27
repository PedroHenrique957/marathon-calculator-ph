# 🍿 Calculadora de Maratona de Séries (v1.0.0)

Este é um aplicativo web criado em **React + Vite** para calcular automaticamente um cronograma de maratona de séries.

O usuário pode definir quais episódios deseja assistir, em quais dias da semana e em qual intervalo de horário. O aplicativo então calcula e exibe uma tabela com a data e hora exatas em que cada episódio será assistido, respeitando o bloco de horário (ex: 06:00 - 12:00) e pulando para os dias permitidos.

## ✨ Funcionalidades (v1.0.0)

* **Seleção de Dias:** Escolha quais dias da semana você deseja assistir (ex: Seg-Sex).
* **Seleção de Horário:** Defina um bloco de horário personalizado (ex: de `06:00` até `09:00`).
* **Entrada Manual:** Adicione episódios um por um através de um formulário.
    * O formulário auto-incrementa o número do episódio para facilitar a adição sequencial.
    * O nome da série permanece fixo para facilitar a adição de vários episódios da mesma série.
* **Importação via CSV:** Carregue uma lista de episódios em massa usando um arquivo `.csv`.
    * O app valida os cabeçalhos do CSV (`Serie`, `Temporada`, `Episodio`, `Duracao`) e informa o usuário sobre erros.
* **Lógica de Cálculo:**
    * A lista de episódios é sempre ordenada cronologicamente (Série > Temporada > Episódio) antes do cálculo.
    * O cálculo preenche o bloco de horário e, ao atingir o limite, pula automaticamente para o próximo dia válido selecionado.
* **Exibição em Português:** A tabela final exibe os dias da semana em português (ex: Seg, Ter, Qua...).

---

## Relatório de Modificações e Criação

Este projeto foi construído de forma incremental. Abaixo está um resumo das principais etapas de desenvolvimento.

### Criação (Estrutura Inicial)

1.  **Projeto:** Iniciado com `npm create vite@latest` usando React e JavaScript.
2.  **Bibliotecas Externas:**
    * `date-fns`: Para manipulação avançada de datas e horários (cálculo, formatação).
    * `papaparse`: Para a leitura e interpretação de arquivos `.csv` no navegador.
3.  **Arquitetura de Componentes:** O app foi dividido nos seguintes componentes:
    * `App.jsx`: O componente "cérebro", responsável por gerenciar todo o estado (a lista de episódios, os dias selecionados, os horários e o cronograma final).
    * `DaySelector.jsx`: Componente para renderizar os checkboxes dos dias da semana.
    * `EpisodeInput.jsx`: Componente contendo o formulário manual e o input de upload do CSV.
    * `ScheduleTable.jsx`: Componente responsável apenas por exibir a tabela de resultados.
4.  **Lógica Centralizada:**
    * `logic/calculator.js`: Um arquivo separado contendo a função `calculateSchedule`, que recebe os dados (episódios, dias, horários) e retorna o cronograma calculado. Isso mantém o `App.jsx` mais limpo.

### Modificações e Melhorias (Evolução)

Ao longo do desenvolvimento, as seguintes modificações foram implementadas para atender aos requisitos:

* **Ordenação Automática:** Implementado um `.sort()` no `useEffect` do `App.jsx` para garantir que a lista de episódios seja sempre processada na ordem correta (Série > Temporada > Episódio), independentemente da ordem de entrada.
* **Auto-Incremento (Manual):** Modificado o `handleSubmit` em `EpisodeInput.jsx` para, em vez de limpar o formulário, apenas incrementar o campo "Episódio", facilitando a adição sequencial.
* **Manter Nome da Série:** Modificado o `handleSubmit` novamente para *não* limpar o campo "Série", melhorando a usabilidade.
* **Valores Padrão:** O estado `selectedDays` em `App.jsx` foi inicializado com os dias úteis (`['Monday', ..., 'Friday']`) para que o app funcione imediatamente, sem que o usuário precise clicar nos checkboxes.
* **Correção de Bug (Cálculo):** Corrigido um bug crítico em `calculator.js` onde o `blockEndTime` (limite de horário) não era atualizado ao pular para o próximo dia, fazendo com que apenas um episódio fosse agendado por dia (após o primeiro dia).
* **Tradução (i18n):** O `ScheduleTable.jsx` foi atualizado para importar e usar o `ptBR` do `date-fns/locale`, traduzindo os dias da semana (ex: "Mon" -> "Seg").
* **Diagnóstico de CSV:** A função `addCsvEpisodes` em `App.jsx` foi completamente reescrita para incluir um sistema de diagnóstico que verifica os cabeçalhos do CSV e informa o usuário através de um `alert()` caso colunas esperadas (`Serie`, `Temporada`, etc.) estejam faltando.
* **Horários Dinâmicos:**
    1.  As constantes `TIME_BLOCK_START` e `TIME_BLOCK_END` foram removidas de `calculator.js`.
    2.  O `App.jsx` recebeu novos estados (`startTime`, `endTime`) e o novo componente `TimeRangeSelector.jsx`.
    3.  A lógica em `calculator.js` foi refatorada para receber `startTime` e `endTime` como parâmetros e usá-los para definir os blocos de horário dinamicamente.
* **Finalização:**
    1.  Adicionado um `<footer>` em `App.jsx` (e estilização em `App.css`) para exibir a versão e os direitos autorais.
    2.  Criação deste arquivo `README.md`.

---
&copy; 2025 Pedro Henrique