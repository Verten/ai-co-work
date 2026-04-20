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
const { addPlayer, removePlayer, getPlayers, setDrawer, getDrawer, setWord, getWord, setPhase, getPhase, resetScores } = require('./gameState');
const { getRandomWord } = require('./words');

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join', (userData) => {
    addPlayer(socket.id, userData);
    io.emit('usersUpdate', { users: getPlayers() });
    console.log('User joined:', userData.name);

    if (getPlayers().length >= 2 && getPhase() === 'waiting') {
      startNewRound();
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
    if (word && socket.id !== drawer && data.text === word) {
      io.emit('guessResult', { correct: true, guesser: socket.id, word });
      endRound(socket.id);
    }
  });

  socket.on('finishDrawing', () => {
    if (socket.id === getDrawer()) {
      startGuessing();
    }
  });

  socket.on('disconnect', () => {
    const user = getPlayers().find(p => p.socketId === socket.id);
    removePlayer(socket.id);
    io.emit('usersUpdate', { users: getPlayers() });
    console.log('User disconnected:', socket.id, user?.name);

    if (getPlayers().length < 2) {
      setPhase('waiting');
    }
  });
});

function startNewRound() {
  const players = getPlayers();
  if (players.length < 2) return;

  const drawerIndex = Math.floor(Math.random() * players.length);
  const drawer = players[drawerIndex];

  setDrawer(drawer.socketId);
  const word = getRandomWord();
  setWord(word);
  setPhase('drawing');

  io.to(drawer.socketId).emit('gameStart', { word, isDrawer: true });
  io.emit('drawerStatus', { drawer: getDrawer() });
  io.emit('phaseChange', { phase: 'drawing' });

  console.log(`Round started: ${drawer.name} is drawing, word: ${word}`);

  // 2分钟画画时间
  setTimeout(() => {
    if (getPhase() === 'drawing' && getDrawer() === drawer.socketId) {
      startGuessing();
    }
  }, 120000);
}

function startGuessing() {
  setPhase('guessing');
  io.emit('phaseChange', { phase: 'guessing' });
  console.log('Guessing phase started');

  // 1分钟猜词时间
  setTimeout(() => {
    if (getPhase() === 'guessing') {
      endRound(null);
    }
  }, 60000);
}

function endRound(winnerSocketId) {
  if (winnerSocketId) {
    const winner = getPlayers().find(p => p.socketId === winnerSocketId);
    if (winner) {
      winner.score++;
      console.log(`Correct guess by ${winner.name}!`);
    }
  }

  const scores = getPlayers().map(p => ({ id: p.socketId, name: p.name, score: p.score }));
  io.emit('roundEnd', { winner: winnerSocketId, scores });

  setPhase('ended');
  console.log('Round ended');

  // 30秒后开始下一轮
  setTimeout(() => {
    if (getPlayers().length >= 2) {
      startNewRound();
    }
  }, 30000);
}

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});