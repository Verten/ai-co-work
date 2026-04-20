# 你画我猜 - 实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 创建一个实时多人在线你画我猜游戏

**Architecture:** React前端 + Node.js后端 + Socket.io实时通信，前端负责绘画和UI，后端管理游戏状态和实时同步

**Tech Stack:** React 18, Vite, Socket.io-client (前端) | Node.js, Express, Socket.io (后端)

---

## Task 1: 项目初始化 - 创建前后端项目结构

**Files:**
- Create: `server/package.json`
- Create: `client/package.json`
- Create: `client/index.html`
- Create: `client/vite.config.js`

- [ ] **Step 1: 创建服务端目录结构**

```bash
mkdir -p server
cd server
npm init -y
```

- [ ] **Step 2: 创建客户端目录结构**

```bash
mkdir -p client
cd client
npm create vite@latest . -- --template react
```

---

## Task 2: 服务端初始化 - Node.js + Socket.io 服务器

**Files:**
- Create: `server/index.js`
- Create: `server/package.json` (如果Task 1未创建)

- [ ] **Step 1: 安装服务端依赖**

```bash
cd server
npm install express socket.io cors
```

- [ ] **Step 2: 创建服务器文件**

```javascript
// server/index.js
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

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

- [ ] **Step 3: 测试服务器启动**

```bash
node index.js
# 预期输出: Server running on port 3001
```

---

## Task 3: 前端初始化 - React + Vite 项目

**Files:**
- Create: `client/src/main.jsx`
- Create: `client/src/App.jsx`
- Create: `client/src/index.css`

- [ ] **Step 1: 安装客户端依赖**

```bash
cd client
npm install socket.io-client
```

- [ ] **Step 2: 创建基础React组件**

```jsx
// client/src/App.jsx
import { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3001');

function App() {
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    socket.on('connect', () => setConnected(true));
    socket.on('disconnect', () => setConnected(false));
    return () => socket.off();
  }, []);

  return (
    <div className="app">
      <h1>你画我猜</h1>
      <p>状态: {connected ? '已连接' : '未连接'}</p>
    </div>
  );
}

export default App;
```

- [ ] **Step 3: 配置Vite代理（开发时）**

```javascript
// client/vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/socket.io': {
        target: 'http://localhost:3001',
        ws: true
      }
    }
  }
});
```

- [ ] **Step 4: 启动开发服务器测试**

```bash
npm run dev
# 预期: Vite开发服务器启动，无报错
```

---

## Task 4: Canvas绘画功能

**Files:**
- Create: `client/src/components/Canvas.jsx`
- Create: `client/src/components/Toolbar.jsx`

- [ ] **Step 1: 创建Canvas组件（支持触摸和鼠标）**

```jsx
// client/src/components/Canvas.jsx
import { useRef, useEffect, useState, useCallback } from 'react';

const Canvas = ({ isDrawingEnabled, tool, color, size, onStrokeComplete }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentStroke, setCurrentStroke] = useState([]);

  const getCoordinates = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    if (e.touches) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY
      };
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  };

  const startDrawing = (e) => {
    if (!isDrawingEnabled) return;
    e.preventDefault();
    setIsDrawing(true);
    const pos = getCoordinates(e);
    setCurrentStroke([pos]);
  };

  const draw = (e) => {
    if (!isDrawing || !isDrawingEnabled) return;
    e.preventDefault();
    const pos = getCoordinates(e);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    ctx.strokeStyle = tool === 'eraser' ? '#ffffff' : color;
    ctx.lineWidth = tool === 'eraser' ? size * 2 : size;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    const lastPos = currentStroke[currentStroke.length - 1];
    ctx.beginPath();
    ctx.moveTo(lastPos.x, lastPos.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    
    setCurrentStroke([...currentStroke, pos]);
  };

  const endDrawing = () => {
    if (isDrawing && currentStroke.length > 0) {
      onStrokeComplete({
        tool,
        color: tool === 'eraser' ? '#ffffff' : color,
        size,
        points: currentStroke
      });
    }
    setIsDrawing(false);
    setCurrentStroke([]);
  };

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={600}
      onMouseDown={startDrawing}
      onMouseMove={draw}
      onMouseUp={endDrawing}
      onMouseLeave={endDrawing}
      onTouchStart={startDrawing}
      onTouchMove={draw}
      onTouchEnd={endDrawing}
      style={{ touchAction: 'none', cursor: isDrawingEnabled ? 'crosshair' : 'not-allowed' }}
    />
  );
};

export default Canvas;
```

- [ ] **Step 2: 创建工具栏组件**

```jsx
// client/src/components/Toolbar.jsx
const COLORS = ['#000000', '#ffffff', '#ff0000', '#ff8800', '#ffff00', '#00ff00', '#00ffff', '#8800ff', '#ff00ff', '#8b4513', '#808080', '#333333'];
const SIZES = [4, 8, 12, 20];

const Toolbar = ({ tool, setTool, color, setColor, size, setSize, onUndo, onRedo, onClear, canUndo, canRedo }) => {
  return (
    <div className="toolbar">
      <div className="tool-group">
        <button className={tool === 'brush' ? 'active' : ''} onClick={() => setTool('brush')}>画笔</button>
        <button className={tool === 'eraser' ? 'active' : ''} onClick={() => setTool('eraser')}>橡皮擦</button>
      </div>
      <div className="color-picker">
        {COLORS.map(c => (
          <button
            key={c}
            className={`color-btn ${color === c ? 'active' : ''}`}
            style={{ backgroundColor: c }}
            onClick={() => setColor(c)}
          />
        ))}
      </div>
      <div className="size-picker">
        {SIZES.map(s => (
          <button
            key={s}
            className={`size-btn ${size === s ? 'active' : ''}`}
            onClick={() => setSize(s)}
          >
            <span style={{ width: s, height: s, backgroundColor: '#fff', borderRadius: '50%', display: 'block' }} />
          </button>
        ))}
      </div>
      <div className="actions">
        <button onClick={onUndo} disabled={!canUndo}>撤销</button>
        <button onClick={onRedo} disabled={!canRedo}>重做</button>
        <button onClick={onClear}>清空</button>
      </div>
    </div>
  );
};

export default Toolbar;
```

---

## Task 5: 用户身份系统

**Files:**
- Create: `client/src/utils/identity.js`
- Create: `client/src/utils/avatarGenerator.js`
- Create: `client/src/utils/nameGenerator.js`

- [ ] **Step 1: 创建用户ID生成器**

```javascript
// client/src/utils/identity.js
export const generateUserId = () => {
  const data = [
    navigator.userAgent,
    screen.width,
    screen.height,
    screen.colorDepth,
    new Date().getTimezoneOffset()
  ].join('|');
  
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16).substring(0, 8);
};
```

- [ ] **Step 2: 创建趣味名称生成器**

```javascript
// client/src/utils/nameGenerator.js
const ADJECTIVES = ['神秘的', '快乐的', '勇敢的', '温柔的', '聪明的', '可爱的', '帅气的', '调皮的', '安静的', '活泼的'];
const ANIMALS = ['猫', '狗', '兔子', '狐狸', '鹰', '鲸鱼', '熊猫', '狮子', '老虎', '海豚', '狼', '熊', '猫头鹰', '鹦鹉'];

export const generateName = () => {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const animal = ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
  return `${adj}${animal}`;
};
```

- [ ] **Step 3: 创建几何头像生成器**

```javascript
// client/src/utils/avatarGenerator.js
export const generateAvatar = (userId) => {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  
  const seed = parseInt(userId.substring(0, 8), 16) || 0;
  
  const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#dfe6e9', '#fd79a8', '#a29bfe'];
  
  ctx.fillStyle = colors[seed % colors.length];
  ctx.fillRect(0, 0, 64, 64);
  
  const cx = 32, cy = 32;
  
  ctx.fillStyle = colors[(seed + 1) % colors.length];
  ctx.beginPath();
  ctx.arc(cx + 10, cy - 5, 12, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.fillStyle = colors[(seed + 2) % colors.length];
  ctx.fillRect(cx - 20, cy + 8, 18, 18);
  
  ctx.fillStyle = colors[(seed + 3) % colors.length];
  ctx.beginPath();
  ctx.moveTo(cx, cy - 25);
  ctx.lineTo(cx + 12, cy - 10);
  ctx.lineTo(cx - 12, cy - 10);
  ctx.closePath();
  ctx.fill();
  
  return canvas.toDataURL();
};
```

---

## Task 6: Socket.io 通信层

**Files:**
- Create: `client/src/hooks/useSocket.js`
- Create: `client/src/context/SocketContext.jsx`

- [ ] **Step 1: 创建Socket上下文**

```jsx
// client/src/context/SocketContext.jsx
import { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';

const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const socket = io('http://localhost:3001');
    
    socket.on('connect', () => setConnected(true));
    socket.on('disconnect', () => setConnected(false));
    
    setSocket(socket);
    return () => socket.close();
  }, []);

  return (
    <SocketContext.Provider value={{ socket, connected }}>
      {children}
    </SocketContext.Provider>
  );
};
```

- [ ] **Step 2: 服务端添加连接日志**

```javascript
// server/index.js - 添加到 io.on('connection')
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  socket.on('join', (userData) => {
    console.log('User joined:', userData);
    socket.broadcast.emit('userJoined', userData);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});
```

---

## Task 7: 服务端游戏逻辑

**Files:**
- Create: `server/gameState.js`
- Create: `server/words.js`
- Modify: `server/index.js`

- [ ] **Step 1: 创建词库**

```javascript
// server/words.js
const WORDS = [
  // 动物
  '猫', '狗', '鱼', '鸟', '熊', '兔子', '狐狸', '鹰', '鲸鱼', '熊猫',
  '狮子', '老虎', '海豚', '狼', '熊', '猫头鹰', '鹦鹉', '乌龟', '青蛙', '蛇',
  // 食物
  '苹果', '香蕉', '面包', '披萨', '寿司', '汉堡', '蛋糕', '冰淇淋', '咖啡', '茶',
  '肉丸', '饺子', '面条', '炒饭', '沙拉', '三明治', '果汁', '牛奶', '奶酪', '鸡蛋',
  // 物品
  '汽车', '房子', '手机', '书', '电脑', '电视', '自行车', '飞机', '火车', '船',
  '椅子', '桌子', '床', '灯', '钟', '相机', '眼镜', '帽子', '包', '鞋'
];

export const getRandomWord = () => {
  return WORDS[Math.floor(Math.random() * WORDS.length)];
};
```

- [ ] **Step 2: 创建游戏状态管理器**

```javascript
// server/gameState.js
const players = new Map();
let currentDrawer = null;
let currentWord = null;
let gamePhase = 'waiting'; // waiting, drawing, guessing, ended
let drawTimeLeft = 120;
let guessTimeLeft = 60;

export const addPlayer = (socketId, userData) => {
  players.set(socketId, {
    ...userData,
    socketId,
    score: 0,
    isDrawer: false
  });
};

export const removePlayer = (socketId) => {
  players.delete(socketId);
};

export const getPlayers = () => {
  return Array.from(players.values());
};

export const setDrawer = (socketId) => {
  currentDrawer = socketId;
  players.forEach((p) => {
    p.isDrawer = p.socketId === socketId;
  });
};

export const getDrawer = () => currentDrawer;

export const setWord = (word) => {
  currentWord = word;
};

export const getWord = () => currentWord;

export const setPhase = (phase) => {
  gamePhase = phase;
};

export const getPhase = () => gamePhase;

export const resetScores = () => {
  players.forEach((p) => {
    p.score = 0;
  });
};
```

- [ ] **Step 3: 更新服务器处理Socket事件**

```javascript
// server/index.js - 完整实现
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const { addPlayer, removePlayer, getPlayers, setDrawer, getDrawer, setWord, getWord, setPhase, getPhase, resetScores } = require('./gameState');
const { getRandomWord } = require('./words');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join', (userData) => {
    addPlayer(socket.id, userData);
    io.emit('usersUpdate', { users: getPlayers() });
    
    // 如果玩家数>=2，开始游戏
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
    if (data.text === getWord() && socket.id !== getDrawer()) {
      io.emit('guessResult', { correct: true, guesser: socket.id, word: getWord() });
      endRound(socket.id);
    }
  });

  socket.on('finishDrawing', () => {
    if (socket.id === getDrawer()) {
      startGuessing();
    }
  });

  socket.on('disconnect', () => {
    removePlayer(socket.id);
    io.emit('usersUpdate', { users: getPlayers() });
    
    if (getPlayers().length < 2) {
      setPhase('waiting');
    }
  });
});

function startNewRound() {
  const players = getPlayers();
  const drawerIndex = Math.floor(Math.random() * players.length);
  const drawer = players[drawerIndex];
  
  setDrawer(drawer.socketId);
  setWord(getRandomWord());
  setPhase('drawing');
  
  io.to(drawer.socketId).emit('gameStart', { word: getWord(), isDrawer: true });
  io.emit('drawerStatus', { drawer: getDrawer() });
  
  // 2分钟倒计时
  setTimeout(() => {
    if (getPhase() === 'drawing') {
      startGuessing();
    }
  }, 120000);
}

function startGuessing() {
  setPhase('guessing');
  io.emit('phaseChange', { phase: 'guessing', word: null });
  
  // 1分钟猜词
  setTimeout(() => {
    if (getPhase() === 'guessing') {
      endRound(null);
    }
  }, 60000);
}

function endRound(winnerSocketId) {
  if (winnerSocketId) {
    const winner = getPlayers().find(p => p.socketId === winnerSocketId);
    if (winner) winner.score++;
  }
  
  io.emit('roundEnd', {
    winner: winnerSocketId,
    scores: getPlayers().map(p => ({ id: p.socketId, name: p.name, score: p.score }))
  });
  
  setPhase('ended');
  
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
```

---

## Task 8: 前端游戏UI

**Files:**
- Create: `client/src/components/UserList.jsx`
- Create: `client/src/components/GuessInput.jsx`
- Create: `client/src/components/GameStatus.jsx`
- Modify: `client/src/App.jsx`

- [ ] **Step 1: 创建用户列表组件**

```jsx
// client/src/components/UserList.jsx
const UserList = ({ users, currentUserId, isDrawer }) => {
  return (
    <div className="user-list">
      <h3>玩家 ({users.length})</h3>
      <ul>
        {users.map(user => (
          <li key={user.userId} className={user.socketId === currentUserId ? 'current' : ''}>
            <img src={user.avatar} alt={user.name} className="avatar" />
            <span className="name">{user.name}</span>
            {user.isDrawer && <span className="badge">画画中</span>}
            <span className="score">{user.score}分</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
```

- [ ] **Step 2: 创建猜词输入组件**

```jsx
// client/src/components/GuessInput.jsx
const GuessInput = ({ onGuess, disabled }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      onGuess(text.trim());
      setText('');
    }
  };

  return (
    <form className="guess-input" onSubmit={handleSubmit}>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={disabled ? '等待绘画...' : '输入你的猜测...'}
        disabled={disabled}
      />
      <button type="submit" disabled={disabled}>发送</button>
    </form>
  );
};

export default GuessInput;
```

- [ ] **Step 3: 创建游戏状态组件**

```jsx
// client/src/components/GameStatus.jsx
const GameStatus = ({ phase, timeLeft, word, isDrawer }) => {
  return (
    <div className="game-status">
      {phase === 'waiting' && <p>等待其他玩家加入...</p>}
      {phase === 'drawing' && (
        <>
          <p>{isDrawer ? `请画: ${word}` : '绘画中...'}</p>
          <p className="timer">剩余时间: {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}</p>
        </>
      )}
      {phase === 'guessing' && <p>猜词时间!</p>}
      {phase === 'ended' && <p>本轮结束</p>}
    </div>
  );
};

export default GameStatus;
```

---

## Task 9: 游戏结束与重新开始

**Files:**
- Create: `client/src/components/ResultsModal.jsx`
- Modify: `client/src/App.jsx`

- [ ] **Step 1: 创建结果展示组件**

```jsx
// client/src/components/ResultsModal.jsx
const ResultsModal = ({ scores, nextRoundTime }) => {
  const sorted = [...scores].sort((a, b) => b.score - a.score);
  
  return (
    <div className="modal-overlay">
      <div className="results-modal">
        <h2>游戏结束</h2>
        <div className="rankings">
          {sorted.map((player, index) => (
            <div key={player.id} className={`rank rank-${index + 1}`}>
              <span className="position">#{index + 1}</span>
              <span className="name">{player.name}</span>
              <span className="score">{player.score}分</span>
            </div>
          ))}
        </div>
        <p className="next-round">下一轮开始: {nextRoundTime}秒</p>
      </div>
    </div>
  );
};

export default ResultsModal;
```

---

## Task 10: 移动端适配

**Files:**
- Modify: `client/src/App.jsx`
- Modify: `client/src/index.css`

- [ ] **Step 1: 添加响应式CSS**

```css
/* client/src/index.css */
@media (max-width: 768px) {
  .app {
    flex-direction: column;
  }
  
  .user-list {
    position: fixed;
    left: -100%;
    top: 0;
    height: 100vh;
    width: 200px;
    background: #16213e;
    transition: left 0.3s;
    z-index: 100;
  }
  
  .user-list.open {
    left: 0;
  }
  
  .menu-toggle {
    display: block;
    position: fixed;
    top: 10px;
    left: 10px;
    z-index: 101;
  }
  
  .canvas-container {
    width: 100%;
    height: auto;
  }
  
  canvas {
    max-width: 100%;
    height: auto;
  }
  
  .toolbar {
    flex-wrap: wrap;
    padding: 10px;
  }
  
  .guess-input {
    position: fixed;
    bottom: 10px;
    left: 10px;
    right: 10px;
  }
}
```

- [ ] **Step 2: 添加移动端菜单按钮**

```jsx
// 在App.jsx中添加
const [menuOpen, setMenuOpen] = useState(false);

// 在JSX中添加
<button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
  ☰
</button>
```

---

## 任务依赖关系

1. Task 1 → Task 2, Task 3 (项目初始化)
2. Task 2, Task 3 → Task 4, Task 5, Task 6 (基础功能)
3. Task 6 → Task 7 (通信层完成后再实现服务端游戏逻辑)
4. Task 4, Task 5, Task 7 → Task 8 (绘画和游戏逻辑完成后实现UI)
5. Task 8 → Task 9 (UI完成后实现游戏结束)
6. Task 8, Task 9 → Task 10 (基础完成后做移动端适配)

## 建议执行顺序

1. Task 2 (服务端初始化) - 快速独立
2. Task 3 (前端初始化) - 快速独立
3. Task 5 (用户身份系统) - 独立可测试
4. Task 4 (Canvas绘画) - 独立可测试
5. Task 6 (Socket.io通信) - 需要服务端
6. Task 7 (服务端游戏逻辑) - 需要通信层
7. Task 8 (前端游戏UI) - 依赖Canvas和通信
8. Task 9 (游戏结束) - 依赖游戏UI
9. Task 10 (移动端适配) - 最后做