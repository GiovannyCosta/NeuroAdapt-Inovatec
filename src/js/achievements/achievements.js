// =============================================
// ARQUIVO: src/js/achievements/achievements.js
// DESCRIÇÃO: Sistema de Conquistas
// =============================================

const ACHIEVEMENTS_STORAGE_KEY = "neuro_achievements_v2";
let popupTimeout = null;

let achievementsState = {
  unlocked: [],
  played: [],
  progress: {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
    7: 0,
    8: 0,
    9: 0,
    10: 0,
    consecutive: 0,
    consecutiveWord: 0,
    mastery: { animals: [], fruits: [], diversos: [] },
  },
};

function loadAchievements() {
  try {
    const storedState = localStorage.getItem(ACHIEVEMENTS_STORAGE_KEY);
    if (storedState) {
      const loaded = JSON.parse(storedState);
      achievementsState = { ...achievementsState, ...loaded };
      // Garante arrays
      if (!achievementsState.unlocked) achievementsState.unlocked = [];
      if (!achievementsState.played) achievementsState.played = [];
      if (!achievementsState.progress) achievementsState.progress = {};
    }
  } catch (e) {
    console.error(e);
  }
}

function saveAchievements() {
  localStorage.setItem(
    ACHIEVEMENTS_STORAGE_KEY,
    JSON.stringify(achievementsState)
  );
  updateStarCount();
}

function isUnlocked(id) {
  return achievementsState.unlocked.includes(id);
}

function markUnlocked(id) {
  if (!isUnlocked(id)) {
    achievementsState.unlocked.push(id);
    const ach = achievementsList.find(a => a.id === id);
    if (ach && typeof showAchievementPopup === "function") {
      showAchievementPopup(ach.icon, ach.name);
    }
    saveAchievements();
    checkBonusAchievement();
  }
}

function checkBonusAchievement() {
  const bonusAch = achievementsList.find(a => a.type === "bonus");
  if (!bonusAch) return;
  const totalUnlocked = achievementsState.unlocked.filter(
    id => id !== bonusAch.id
  ).length;
  if (totalUnlocked >= bonusAch.target && !isUnlocked(bonusAch.id)) {
    markUnlocked(bonusAch.id);
  }
}

// --- FUNÇÕES PÚBLICAS ---

window.registerPlayed = function (gameId) {
  if (!achievementsState.played.includes(gameId)) {
    achievementsState.played.push(gameId);
    const achievement = achievementsList.find(
      a => a.type === "played" && a.gameId === gameId
    );
    if (achievement) markUnlocked(achievement.id);
    saveAchievements();
  }
};

window.registerProgress = function (gameId, amount = 1) {
  achievementsState.progress[gameId] =
    (achievementsState.progress[gameId] || 0) + amount;
  const related = achievementsList.filter(
    a => a.type === "progress" && a.gameId === gameId
  );
  related.forEach(ach => {
    if (
      !isUnlocked(ach.id) &&
      achievementsState.progress[gameId] >= ach.target
    ) {
      markUnlocked(ach.id);
    }
  });
  if (gameId === 10) checkSoundUniversalProgress();
  saveAchievements();
};

// --- CHECADORES ESPECÍFICOS ---

// JORNADAS (Genérico para Som e Emoção)
window.checkJourneyCompletion = function (worldId) {
  const achievement = achievementsList.find(
    a => a.type === "journey" && a.target === worldId
  );
  if (achievement && !isUnlocked(achievement.id)) {
    markUnlocked(achievement.id);

    // Hooks específicos
    if (achievement.gameId === 10) checkSoundUniversalProgress();
    if (achievement.gameId === 10) checkAllWorldsCompleted(42);
    if (achievement.gameId === 4) checkAllEmotionLevelsCompleted(57);
  }
};

// EMOÇÃO: Checa Coleção (Álbum)
window.checkEmotionCollection = function (id) {
  if (isUnlocked(id) || typeof EmotionLevels === "undefined") return false;
  const ach = achievementsList.find(a => a.id === id);
  if (!ach) return false;

  const collectionCount = EmotionLevels.state.collection.length;
  if (collectionCount >= ach.target) {
    markUnlocked(id);
    return true;
  }
  return false;
};

// EMOÇÃO: Checa Streak (Acertos seguidos)
window.checkEmotionStreak = function (id) {
  if (isUnlocked(id) || typeof EmotionLogic === "undefined") return false;
  const ach = achievementsList.find(a => a.id === id);

  // Usa a variável correctStreak do EmotionLogic
  if (EmotionLogic.correctStreak >= ach.target) {
    markUnlocked(id);
    return true;
  }
  return false;
};

// EMOÇÃO: Checa Todos os Níveis
window.checkAllEmotionLevelsCompleted = function (id) {
  if (isUnlocked(id) || typeof EmotionLevels === "undefined") return false;

  // Verifica se completou os 4 níveis principais
  const required = [
    "level_1_basic",
    "level_2_social",
    "level_3_complex",
    "level_4_physical",
  ];
  const completed = EmotionLevels.state.completedWorlds || [];

  const allDone = required.every(wId => completed.includes(wId));

  if (allDone) {
    markUnlocked(id);
    return true;
  }
  return false;
};

// SOM: Checagens Universais (Mantido)
function checkSoundUniversalProgress() {
  const hits = GameAnalytics.data.games.sound?.hits || 0;
  const maps = SoundLevels.state?.totalMaps || 0;
  if (hits >= 10 && !isUnlocked(25)) markUnlocked(25);
  if (hits >= 20 && !isUnlocked(26)) markUnlocked(26);
  if (maps >= 5 && !isUnlocked(27)) markUnlocked(27);
  if (maps >= 10 && !isUnlocked(28)) markUnlocked(28);
}

function checkAllWorldsCompleted(id) {
  if (isUnlocked(id)) return false;
  const total = SoundJourneyData.length;
  const completed = SoundLevels.state?.completedWorlds?.length || 0;
  if (completed >= total) {
    markUnlocked(id);
    return true;
  }
  return false;
}

window.checkFreeModePlayed = function (id) {
  if (isUnlocked(id)) return false;
  if (SoundLogic.freeModePlayed) {
    markUnlocked(id);
    return true;
  }
  return false;
};

window.checkCorrectStreak = function (id) {
  /* Som */
  if (isUnlocked(id)) return false;
  if (SoundLogic.correctStreak >= 10) {
    markUnlocked(id);
    return true;
  }
  return false;
};
window.checkWrongStreak = function (id) {
  /* Som */
  if (isUnlocked(id)) return false;
  if (SoundLogic.wrongAttempts >= 3) {
    markUnlocked(id);
    return true;
  }
  return false;
};

// --- RENDERIZAÇÃO ---
function updateStarCount() {
  const total = achievementsState.unlocked.length;
  const el1 = document.getElementById("total-stars-home");
  const el2 = document.getElementById("achievements-star-count");
  if (el1) el1.textContent = total;
  if (el2) el2.textContent = total;
}

function renderAchievements() {
  const container = document.getElementById("achievements-list");
  if (!container) return;
  container.innerHTML = "";
  updateStarCount();

  achievementsList.forEach(ach => {
    const unlocked = isUnlocked(ach.id);
    let progressText = "";

    // Lógica de exibição de progresso visual
    if (
      !unlocked &&
      (ach.type === "progress" || ach.check === "checkEmotionCollection")
    ) {
      let current = 0;
      if (ach.gameId === 4 && ach.check === "checkEmotionCollection") {
        current =
          typeof EmotionLevels !== "undefined"
            ? EmotionLevels.state.collection.length
            : 0;
      } else {
        current = achievementsState.progress[ach.gameId] || 0;
      }
      progressText = ` (${current}/${ach.target})`;
    }

    const div = document.createElement("div");
    div.className = `achievement-card card p-4 rounded-xl shadow-md flex items-center space-x-4 transition-all ${
      unlocked ? "ach-unlocked-pulse" : "opacity-40"
    }`;
    div.innerHTML = `
        <div class="text-4xl">${ach.icon}</div>
        <div>
            <h3 class="font-bold text-lg ${unlocked ? "accent-text" : ""}">${
      ach.name
    }</h3>
            <p class="text-sm text-gray-500">${ach.desc}${progressText}</p>
        </div>
    `;
    container.appendChild(div);
  });
}

function showAchievementPopup(icon, name) {
  const popup = document.getElementById("achievement-popup");
  const iconEl = document.getElementById("popup-icon");
  const nameEl = document.getElementById("popup-name");
  const audio = document.getElementById("achievement-sound");

  if (!popup) return;
  clearTimeout(popupTimeout);
  popup.classList.remove("show");

  if (iconEl) iconEl.textContent = icon;
  if (nameEl) nameEl.textContent = name;
  if (audio) {
    audio.src = "src/assets/sounds/Achievement.mp3";
    audio.play().catch(() => {});
  }

  setTimeout(() => popup.classList.add("show"), 50);
  popupTimeout = setTimeout(() => popup.classList.remove("show"), 3000);
}

loadAchievements();
