const players = new Map();
let currentDrawer = null;
let currentWord = null;
let gamePhase = 'waiting';

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
function setPhase(phase) { gamePhase = phase; }
function getPhase() { return gamePhase; }

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
  resetScores
};