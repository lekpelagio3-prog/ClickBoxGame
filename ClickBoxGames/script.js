let score = 0;
let level = 1;
let timeLeft = 30;
let timer;
let difficulty = "normal";
let isGameRunning = false;

const box = document.getElementById("box");
const scoreDisplay = document.getElementById("score");
const levelDisplay = document.getElementById("level");
const timeDisplay = document.getElementById("time");
const highScoreDisplay = document.getElementById("highScore");
const clickSound = document.getElementById("clickSound");
const gameArea = document.getElementById("game-area");
const restartBtn = document.getElementById("restart-btn");
const difficultySelect = document.getElementById("difficulty");

let highScore = Number(localStorage.getItem("highScore")) || 0;
highScoreDisplay.textContent = highScore;

const difficultySettings = {
  easy: { time: 40, baseSize: 56, levelStep: 4 },
  normal: { time: 30, baseSize: 50, levelStep: 6 },
  hard: { time: 22, baseSize: 44, levelStep: 8 }
};

function getDifficultyConfig() {
  return difficultySettings[difficulty] || difficultySettings.normal;
}

function applyBackgroundForLevel() {
  for (let backgroundLevel = 1; backgroundLevel <= 7; backgroundLevel++) {
    gameArea.classList.remove("level-" + backgroundLevel);
  }

  const backgroundLevel = Math.min(7, Math.max(1, level));
  gameArea.classList.add("level-" + backgroundLevel);
}

function createBurst(x, y) {
  const burstCount = 10;

  for (let i = 0; i < burstCount; i++) {
    const burst = document.createElement("span");
    burst.className = "burst";

    const angle = (Math.PI * 2 * i) / burstCount;
    const distance = 18 + Math.random() * 24;
    const dx = Math.cos(angle) * distance;
    const dy = Math.sin(angle) * distance;

    burst.style.left = x + "px";
    burst.style.top = y + "px";
    burst.style.setProperty("--dx", dx + "px");
    burst.style.setProperty("--dy", dy + "px");
    burst.style.background = i % 2 === 0 ? "#fff7a8" : "#ff9f43";

    gameArea.appendChild(burst);
    setTimeout(() => burst.remove(), 700);
  }
}

function resetBoxSize() {
  const config = getDifficultyConfig();
  const size = config.baseSize;
  box.style.width = size + "px";
  box.style.height = size + "px";
}

function moveBox() {
  const maxX = Math.max(0, gameArea.clientWidth - box.offsetWidth);
  const maxY = Math.max(0, gameArea.clientHeight - box.offsetHeight);
  const x = Math.floor(Math.random() * (maxX + 1));
  const y = Math.floor(Math.random() * (maxY + 1));

  box.style.left = x + "px";
  box.style.top = y + "px";
}

function updateLevel() {
  const nextLevel = Math.min(7, Math.floor(score / 5) + 1);

  if (nextLevel !== level) {
    level = nextLevel;
    const config = getDifficultyConfig();
    const newSize = Math.max(18, config.baseSize - (level - 1) * config.levelStep);
    box.style.width = newSize + "px";
    box.style.height = newSize + "px";
    applyBackgroundForLevel();

    if (level === 2) {
      alert("Level 2! Mas maliit na box.");
    } else if (level === 3) {
      alert("Level 3! Mas challenging na.");
    } else if (level === 4) {
      alert("Level 4! Tumatakbo ka na ng mabilis!");
    } else if (level === 5) {
      alert("Level 5! Konting error na lang, kaya mo yan!");
    } else if (level === 6) {
      alert("Level 6! Sobrang mahirap na!");
    } else if (level === 7) {
      alert("Level 7! Peak difficulty!");
    }
  }

  levelDisplay.textContent = level;
}

function startTimer() {
  clearInterval(timer);
  timer = setInterval(() => {
    if (!isGameRunning) {
      return;
    }

    timeLeft = Math.max(0, timeLeft - 1);
    timeDisplay.textContent = timeLeft;

    if (timeLeft <= 0) {
      endGame();
    }
  }, 1000);
}

function endGame() {
  if (!isGameRunning) {
    return;
  }

  isGameRunning = false;
  clearInterval(timer);
  alert("Game Over! Final Score: " + score);

  if (score > highScore) {
    highScore = score;
    localStorage.setItem("highScore", highScore);
    highScoreDisplay.textContent = highScore;
    alert("New High Score!");
  }

  box.style.display = "none";
}

function startGame() {
  const config = getDifficultyConfig();
  isGameRunning = true;
  score = 0;
  level = 1;
  timeLeft = config.time;
  scoreDisplay.textContent = score;
  levelDisplay.textContent = level;
  timeDisplay.textContent = timeLeft;
  resetBoxSize();
  applyBackgroundForLevel();
  box.classList.remove("is-hit");
  box.style.display = "block";
  moveBox();
  startTimer();
}

box.addEventListener("click", (event) => {
  if (!isGameRunning || timeLeft <= 0) {
    return;
  }

  const rect = gameArea.getBoundingClientRect();
  const clickX = event.clientX - rect.left;
  const clickY = event.clientY - rect.top;

  box.classList.remove("is-hit");
  void box.offsetWidth;
  box.classList.add("is-hit");

  score++;
  scoreDisplay.textContent = score;
  createBurst(clickX, clickY);
  moveBox();
  updateLevel();
  clickSound.currentTime = 0;
  clickSound.play().catch(() => {});

  setTimeout(() => box.classList.remove("is-hit"), 90);
});

restartBtn.addEventListener("click", () => {
  startGame();
});

difficultySelect.addEventListener("change", (event) => {
  difficulty = event.target.value;
  startGame();
});

startGame();
