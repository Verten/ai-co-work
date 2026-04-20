import { useEffect, useState, useCallback, useRef } from 'react';
import { SocketProvider, useSocket } from './context/SocketContext';
import { generateUserId } from './utils/identity';
import { generateName } from './utils/nameGenerator';
import Canvas from './components/Canvas';
import Toolbar from './components/Toolbar';
import UserList from './components/UserList';
import GuessInput from './components/GuessInput';
import GameStatus from './components/GameStatus';
import ResultsModal from './components/ResultsModal';

function Game() {
  const { socket, connected } = useSocket();
  const [userId] = useState(() => generateUserId());
  const [userName] = useState(() => generateName());

  // 游戏状态
  const [users, setUsers] = useState([]);
  const [phase, setPhase] = useState('waiting');
  const [currentWord, setCurrentWord] = useState('');
  const [isDrawer, setIsDrawer] = useState(false);
  const [strokes, setStrokes] = useState([]);
  const [drawTimeLeft, setDrawTimeLeft] = useState(120);
  const [guessTimeLeft, setGuessTimeLeft] = useState(60);
  const [showResults, setShowResults] = useState(false);
  const [scores, setScores] = useState([]);
  const [nextRoundTime, setNextRoundTime] = useState(30);

  // 画笔状态
  const [tool, setTool] = useState('brush');
  const [color, setColor] = useState('#000000');
  const [size, setSize] = useState(8);

  // 撤销/重做
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const clearCanvasRef = useRef(null);

  // 初始化用户
  useEffect(() => {
    if (socket && connected) {
      socket.emit('join', { userId, name: userName });
    }
  }, [socket, connected, userId, userName]);

  // Socket事件监听
  useEffect(() => {
    if (!socket) return;

    socket.on('usersUpdate', ({ users }) => {
      setUsers(users);
    });

    socket.on('gameStart', ({ word, isDrawer: drawer }) => {
      setCurrentWord(word);
      setIsDrawer(drawer);
      setPhase('drawing');
      setStrokes([]);
      setHistory([]);
      setHistoryIndex(-1);
      setDrawTimeLeft(120);
    });

    socket.on('drawerStatus', ({ drawer }) => {
      const isMe = socket.id === drawer;
      setIsDrawer(isMe);
      if (!isMe) {
        setCurrentWord('');
      }
    });

    socket.on('stroke', (stroke) => {
      setStrokes(prev => [...prev, stroke]);
    });

    socket.on('clearCanvas', () => {
      setStrokes([]);
      setHistory([]);
      setHistoryIndex(-1);
      if (clearCanvasRef.current) {
        clearCanvasRef.current();
      }
    });

    socket.on('guessResult', ({ correct, guesser, word }) => {
      if (correct) {
        setPhase('ended');
        setShowResults(true);
      }
    });

    socket.on('phaseChange', ({ phase: newPhase }) => {
      setPhase(newPhase);
      if (newPhase === 'guessing') {
        setGuessTimeLeft(60);
      }
    });

    socket.on('roundEnd', ({ scores: newScores }) => {
      setScores(newScores);
      setShowResults(true);
      setNextRoundTime(30);
    });

    return () => {
      socket.off('usersUpdate');
      socket.off('gameStart');
      socket.off('drawerStatus');
      socket.off('stroke');
      socket.off('clearCanvas');
      socket.off('guessResult');
      socket.off('phaseChange');
      socket.off('roundEnd');
    };
  }, [socket]);

  // 倒计时
  useEffect(() => {
    if (phase === 'drawing' && drawTimeLeft > 0) {
      const timer = setTimeout(() => setDrawTimeLeft(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [phase, drawTimeLeft]);

  useEffect(() => {
    if (phase === 'guessing' && guessTimeLeft > 0) {
      const timer = setTimeout(() => setGuessTimeLeft(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [phase, guessTimeLeft]);

  useEffect(() => {
    if (showResults && nextRoundTime > 0) {
      const timer = setTimeout(() => setNextRoundTime(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else if (showResults && nextRoundTime === 0) {
      setShowResults(false);
      setPhase('waiting');
    }
  }, [showResults, nextRoundTime]);

  // 处理笔触完成
  const handleStrokeComplete = useCallback((stroke) => {
    setStrokes(prev => [...prev, stroke]);
    setHistory(prev => [...prev.slice(0, historyIndex + 1), stroke]);
    setHistoryIndex(prev => prev + 1);

    if (socket) {
      socket.emit('stroke', stroke);
    }
  }, [socket, historyIndex]);

  // 撤销/重做
  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex(prev => prev - 1);
      setStrokes(history.slice(0, historyIndex));
    }
  }, [history, historyIndex]);

  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(prev => prev + 1);
      setStrokes(history.slice(0, historyIndex + 2));
    }
  }, [history, historyIndex]);

  // 清空画布
  const handleClear = useCallback(() => {
    setStrokes([]);
    setHistory([]);
    setHistoryIndex(-1);
    if (socket) {
      socket.emit('clear');
    }
  }, [socket]);

  // 猜词
  const handleGuess = useCallback((text) => {
    if (socket && phase === 'guessing') {
      socket.emit('guess', { text });
    }
  }, [socket, phase]);

  // 完成绘画
  const handleFinishDrawing = useCallback(() => {
    if (socket && isDrawer) {
      socket.emit('finishDrawing');
    }
  }, [socket, isDrawer]);

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#1a1a2e',
      padding: '20px'
    }}>
      {/* 头部 */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <h1 style={{
          fontSize: '28px',
          color: '#0ff',
          textShadow: '0 0 10px #0ff'
        }}>
          你画我猜
        </h1>
        <div style={{
          padding: '8px 16px',
          backgroundColor: connected ? '#26de81' : '#eb3b5a',
          borderRadius: '20px',
          fontSize: '14px'
        }}>
          {connected ? '已连接' : '未连接'}
        </div>
      </div>

      {/* 游戏状态 */}
      <GameStatus
        phase={phase}
        timeLeft={drawTimeLeft}
        guessTimeLeft={guessTimeLeft}
        word={currentWord}
        isDrawer={isDrawer}
      />

      {/* 主内容 */}
      <div style={{
        display: 'flex',
        gap: '20px',
        marginTop: '20px',
        flexWrap: 'wrap'
      }}>
        {/* 用户列表 */}
        <div style={{ flex: '0 0 250px' }}>
          <UserList
            users={users}
            currentUserId={socket?.id}
            isDrawer={isDrawer}
          />
        </div>

        {/* 画布区域 */}
        <div style={{ flex: 1 }}>
          <div style={{
            backgroundColor: '#16213e',
            borderRadius: '12px',
            padding: '20px'
          }}>
            <Canvas
              width={800}
              height={600}
              isDrawingEnabled={isDrawer && phase === 'drawing'}
              tool={tool}
              color={color}
              size={size}
              onStrokeComplete={handleStrokeComplete}
              strokes={strokes}
              onClear={(fn) => { clearCanvasRef.current = fn; }}
            />
          </div>

          {/* 工具栏 */}
          <div style={{ marginTop: '15px' }}>
            <Toolbar
              tool={tool}
              setTool={setTool}
              color={color}
              setColor={setColor}
              size={size}
              setSize={setSize}
              onUndo={handleUndo}
              onRedo={handleRedo}
              onClear={handleClear}
              canUndo={canUndo}
              canRedo={canRedo}
              isDrawer={isDrawer}
            />
          </div>

          {/* 完成绘画按钮 */}
          {isDrawer && phase === 'drawing' && (
            <button
              onClick={handleFinishDrawing}
              style={{
                marginTop: '15px',
                padding: '12px 30px',
                fontSize: '16px',
                fontWeight: 'bold',
                backgroundColor: '#0ff',
                color: '#000',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              完成绘画
            </button>
          )}

          {/* 猜词输入 */}
          {!isDrawer && phase !== 'waiting' && (
            <div style={{ marginTop: '15px' }}>
              <GuessInput
                onGuess={handleGuess}
                disabled={phase !== 'guessing'}
                placeholder={phase === 'guessing' ? '输入你的猜测...' : '等待绘画完成...'}
              />
            </div>
          )}
        </div>
      </div>

      {/* 结果弹窗 */}
      {showResults && (
        <ResultsModal scores={scores} nextRoundTime={nextRoundTime} />
      )}
    </div>
  );
}

function App() {
  return (
    <SocketProvider>
      <Game />
    </SocketProvider>
  );
}

export default App;
