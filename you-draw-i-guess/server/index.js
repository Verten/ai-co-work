const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// 导入游戏状态和词库
const { addPlayer, removePlayer, getPlayers, setDrawer, getDrawer, setWord, getWord, setPhase, getPhase, getRemainingTime, resetScores } = require('./gameState');
const { getRandomWord } = require('./words');

// Timer management to prevent multiple timers
let drawingTimer = null;
let guessingTimer = null;

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join', (userData) => {
    addPlayer(socket.id, userData);
    io.emit('usersUpdate', { users: getPlayers() });
    console.log('User joined:', userData.name);

    if (getPlayers().length >= 2 && getPhase() === 'waiting') {
      startNewRound();
    } else if (getPhase() !== 'waiting') {
      // Player joining mid-game - send current game state
      const currentPhase = getPhase();
      socket.emit('phaseChange', { phase: currentPhase });
      socket.emit('drawerStatus', { drawer: getDrawer() });
      // Send remaining time to the new player with current phase
      const remainingTime = getRemainingTime();
      if (remainingTime !== null) {
        socket.emit('timeSync', { remainingTime, phase: currentPhase });
      }
      // If new player is the drawer, send them the word
      if (getDrawer() === socket.id) {
        socket.emit('gameStart', { word: getWord(), isDrawer: true });
      }
    }
  });

  socket.on('stroke', (stroke) => {
    socket.broadcast.emit('stroke', stroke);
  });

  socket.on('clear', () => {
    socket.broadcast.emit('clearCanvas');
  });

  socket.on('guess', (data) => {
    const word = getWord();
    const drawer = getDrawer();
    const currentPhase = getPhase();
    const guessText = data.text ? data.text.toString().trim() : '';
    console.log('=== Guess Debug ===');
    console.log('Guess text:', guessText, 'type:', typeof guessText);
    console.log('Word:', word, 'type:', typeof word);
    console.log('Drawer:', drawer);
    console.log('Phase:', currentPhase);
    console.log('Comparison result:', guessText === word, '|', guessText, '!==', word);
    console.log('==================');

    // Allow guesses during drawing or guessing phase (not by the drawer)
    if (currentPhase !== 'drawing' && currentPhase !== 'guessing') {
      console.log('Guess ignored - not in drawing or guessing phase');
      return;
    }
    if (!word || typeof word !== 'string' || word.trim() === '') {
      console.log('Guess ignored - no word set');
      return;
    }
    if (socket.id === drawer) {
      console.log('Guess ignored - guesser is the drawer');
      return;
    }
    if (guessText !== word) {
      console.log('Guess incorrect');
      return;
    }
    // Correct guess!
    console.log('CORRECT GUESS!');
    io.emit('guessResult', { correct: true, guesser: socket.id, word });
    endRound(socket.id);
  });

  // finishDrawing event removed - drawer can only stop by timer running out or correct guess

  socket.on('disconnect', () => {
    const user = getPlayers().find(p => p.socketId === socket.id);
    removePlayer(socket.id);
    io.emit('usersUpdate', { users: getPlayers() });
    console.log('User disconnected:', socket.id, user?.name);

    // Only set to waiting if game is actually in progress (not during end-round countdown)
    const currentPhase = getPhase();
    if (getPlayers().length < 2 && (currentPhase === 'drawing' || currentPhase === 'guessing')) {
      setPhase('waiting');
    }
  });
});

function startNewRound() {
  const players = getPlayers();
  if (players.length < 2) {
    console.log('startNewRound: not enough players');
    return;
  }

  const currentPhase = getPhase();
  if (currentPhase !== 'ended' && currentPhase !== 'waiting') {
    console.log('startNewRound: current phase is', currentPhase, '- not starting new round');
    return;
  }

  // Clear any existing timers
  if (drawingTimer) {
    clearTimeout(drawingTimer);
    drawingTimer = null;
  }
  if (guessingTimer) {
    clearTimeout(guessingTimer);
    guessingTimer = null;
  }

  const drawerIndex = Math.floor(Math.random() * players.length);
  const drawer = players[drawerIndex];

  setDrawer(drawer.socketId);
  const word = getRandomWord();
  setWord(word);
  setPhase('drawing');

  io.to(drawer.socketId).emit('gameStart', { word, isDrawer: true });
  io.emit('drawerStatus', { drawer: getDrawer() });
  io.emit('phaseChange', { phase: 'drawing' });
  io.emit('clearCanvas');

  console.log(`Round started: ${drawer.name} is drawing, word: ${word}`);

  // 2分钟画画时间
  drawingTimer = setTimeout(() => {
    console.log('Drawing timer fired');
    if (getPhase() === 'drawing' && getDrawer() === drawer.socketId) {
      startGuessing();
    }
  }, 120000);
}

function startGuessing() {
  // Only start guessing if we have enough players and are in drawing phase
  const currentPhase = getPhase();
  const players = getPlayers();
  console.log('startGuessing called:', { playersCount: players.length, currentPhase, drawer: getDrawer() });

  if (players.length < 2) {
    console.log('startGuessing: not enough players');
    return;
  }
  if (currentPhase !== 'drawing') {
    console.log('startGuessing: not in drawing phase, current phase is', currentPhase);
    return;
  }

  // Clear any existing guessing timer
  if (guessingTimer) {
    clearTimeout(guessingTimer);
    guessingTimer = null;
  }

  setPhase('guessing');
  io.emit('phaseChange', { phase: 'guessing' });
  console.log('Guessing phase started - setting timer for 60 seconds');

  // 1分钟猜词时间
  guessingTimer = setTimeout(() => {
    const phaseNow = getPhase();
    console.log('Guess timer fired, current phase:', phaseNow);
    guessingTimer = null;
    if (phaseNow === 'guessing') {
      endRound(null);
    } else {
      console.log('Guess timer: phase is', phaseNow, ', not calling endRound');
    }
  }, 60000);
}

function endRound(winnerSocketId) {
  // Guard against multiple calls - if already ended or waiting, don't process
  const currentPhase = getPhase();
  if (currentPhase === 'ended' || currentPhase === 'waiting') {
    console.log('endRound called but phase is already:', currentPhase, '- ignoring');
    return;
  }

  // Clear timers
  if (drawingTimer) {
    clearTimeout(drawingTimer);
    drawingTimer = null;
  }
  if (guessingTimer) {
    clearTimeout(guessingTimer);
    guessingTimer = null;
  }

  console.log('endRound called with winner:', winnerSocketId, 'current phase:', currentPhase);

  if (winnerSocketId) {
    const winner = getPlayers().find(p => p.socketId === winnerSocketId);
    if (winner) {
      winner.score++;
      console.log(`Correct guess by ${winner.name}!`);
    }
  }

  const scores = getPlayers().map(p => ({ id: p.socketId, name: p.name, score: p.score }));
  io.emit('roundEnd', { winner: winnerSocketId, scores });
  io.emit('usersUpdate', { users: getPlayers() }); // Send updated scores to all clients

  setPhase('ended');
  console.log('Round ended');

  // 10秒后开始下一轮
  setTimeout(() => {
    if (getPlayers().length >= 2) {
      startNewRound();
    }
  }, 10000);
}

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});