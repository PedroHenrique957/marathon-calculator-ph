// /src/logic/calculator.js

import {
  addDays,
  setHours,
  setMinutes,
  setSeconds,
  getDay,
  addMinutes,
  isBefore,
  addSeconds,
} from 'date-fns';

// (DAY_MAP continua o mesmo)
const DAY_MAP = {
  Sunday: 0,
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
};

// --- 1. MUDAR A ASSINATURA DA FUNÇÃO ---
// Agora ela recebe 'startTime' (ex: "06:00") e 'endTime' (ex: "12:00")
export function calculateSchedule(episodes, selectedDays, startTime, endTime) {
  
  // --- 2. REMOVER CONSTANTES E PARSEAR OS HORÁRIOS ---
  // const TIME_BLOCK_START = 6; // REMOVIDO
  // const TIME_BLOCK_END = 12; // REMOVIDO

  // Converte "06:00" em [6, 0] e "12:00" em [12, 0]
  const [startHour, startMinute] = startTime.split(':').map(Number);
  const [endHour, endMinute] = endTime.split(':').map(Number);
  // --- FIM DA MUDANÇA ---

  const outputSchedule = [];
  let marathonEpisodeCounter = 1;
  const allowedDays = selectedDays.map((day) => DAY_MAP[day]);

  if (episodes.length === 0 || allowedDays.length === 0) {
    return [];
  }

  let currentDay = new Date();
  currentDay = setSeconds(setMinutes(setHours(currentDay, 0), 0), 0);
  while (!allowedDays.includes(getDay(currentDay))) {
    currentDay = addDays(currentDay, 1);
  }

  // --- 3. USAR OS NOVOS HORÁRIOS PARSEADOS ---
  // Define a hora para o início (ex: 06:00)
  let blockStartTime = setSeconds(setMinutes(setHours(currentDay, startHour), startMinute), 0);
  // Define a hora para o fim (ex: 12:00)
  let blockEndTime = setSeconds(setMinutes(setHours(currentDay, endHour), endMinute), 0);
  // --- FIM DA MUDANÇA ---
  
  let currentWatchTime = blockStartTime;

  // 4. Loop (Nenhuma mudança aqui)
  for (const episode of episodes) {
    const episodeDuration = parseInt(episode.duration, 10);
    if (isNaN(episodeDuration)) continue;

    let potentialEndTime = addMinutes(currentWatchTime, episodeDuration);

    // 5. Bloco 'if' (Nenhuma mudança aqui)
    if (isBefore(potentialEndTime, addSeconds(blockEndTime, 1))) {
      outputSchedule.push({
        marathonEp: marathonEpisodeCounter,
        day: currentWatchTime,
        startTime: currentWatchTime,
        endTime: potentialEndTime,
        ...episode,
      });

      currentWatchTime = potentialEndTime;
      marathonEpisodeCounter++;
    } else {
      // 6. Bloco 'else' (Mudança para usar os novos horários)
      do {
        currentDay = addDays(currentDay, 1);
      } while (!allowedDays.includes(getDay(currentDay)));

      // --- 7. USAR OS NOVOS HORÁRIOS PARSEADOS AQUI TAMBÉM ---
      blockStartTime = setSeconds(setMinutes(setHours(currentDay, startHour), startMinute), 0);
      blockEndTime = setSeconds(setMinutes(setHours(currentDay, endHour), endMinute), 0); 
      currentWatchTime = blockStartTime;
      // --- FIM DA MUDANÇA ---

      potentialEndTime = addMinutes(currentWatchTime, episodeDuration);

      outputSchedule.push({
        marathonEp: marathonEpisodeCounter,
        day: currentWatchTime,
        startTime: currentWatchTime,
        endTime: potentialEndTime,
        ...episode,
      });

      currentWatchTime = potentialEndTime;
      marathonEpisodeCounter++;
    }
  }

  return outputSchedule;
}