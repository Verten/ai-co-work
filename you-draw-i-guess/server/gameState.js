const players = new Map();
let currentDrawer = null;
let currentWord = null;
let gamePhase = 'waiting';
let phaseStartTime = null;
const DRAWING_DURATION = 120000;  // 2分钟
const GUESSING_DURATION = 60000;  // 1分钟

function addPlayer(socketId, userData) {
  players.set(socketId, {
    ...userData,
    socketId,
    score: 0,
    isDrawer: false
  });
}

function removePlayer(socketId) {
  players.delete(socketId);
}

function getPlayers() {
  return Array.from(players.values());
}

function setDrawer(socketId) {
  currentDrawer = socketId;
  players.forEach((p) => {
    p.isDrawer = p.socketId === socketId;
  });
}

function getDrawer() { return currentDrawer; }
function setWord(word) { currentWord = word; }
function getWord() { return currentWord; }
function setPhase(phase) {
  gamePhase = phase;
  if (phase === 'drawing' || phase === 'guessing') {
    phaseStartTime = Date.now();
  }
}
function getPhase() { return gamePhase; }

function getRemainingTime() {
  if (!phaseStartTime) return null;
  const elapsed = Date.now() - phaseStartTime;
  if (gamePhase === 'drawing') {
    return Math.max(0, Math.ceil((DRAWING_DURATION - elapsed) / 1000));
  } else if (gamePhase === 'guessing') {
    return Math.max(0, Math.ceil((GUESSING_DURATION - elapsed) / 1000));
  }
  return null;
}

function getPhaseStartTime() {
  return phaseStartTime;
}

function resetScores() {
  players.forEach((p) => { p.score = 0; });
}

module.exports = {
  addPlayer,
  removePlayer,
  getPlayers,
  setDrawer,
  getDrawer,
  setWord,
  getWord,
  setPhase,
  getPhase,
  getRemainingTime,
  getPhaseStartTime,
  resetScores
};