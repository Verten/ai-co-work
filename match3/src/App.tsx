import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { GameBoard } from './components/GameBoard';
import { GameHeader } from './components/GameHeader';
import { TargetPanel } from './components/TargetPanel';
import { LevelComplete } from './components/LevelComplete';
import { GameOver } from './components/GameOver';
import { LevelSelector } from './components/LevelSelector';
import { useGameReducer } from './hooks/useGameReducer';

type Screen = 'game' | 'levelSelect';

export default function App() {
  const [screen, setScreen] = useState<Screen>('levelSelect');
  const { state, selectCell, swapCells, startLevel } = useGameReducer();

  const handleCellClick = (row: number, col: number) => {
    const selected = state.selectedCell;
    if (selected) {
      const [selectedRow, selectedCol] = selected;

      // Check if adjacent
      const isAdjacent =
        (Math.abs(selectedRow - row) === 1 && selectedCol === col) ||
        (Math.abs(selectedCol - col) === 1 && selectedRow === row);

      if (isAdjacent) {
        swapCells(
          { row: selectedRow, col: selectedCol },
          { row, col }
        );
      } else {
        selectCell(row, col);
      }
    } else {
      selectCell(row, col);
    }
  };

  const handleNextLevel = () => {
    startLevel(state.level + 1);
    setScreen('game');
  };

  const handleReplay = () => {
    startLevel(state.level);
  };

  const handleRetry = () => {
    startLevel(state.level);
  };

  const handleLevelSelect = (level: number) => {
    startLevel(level);
    setScreen('game');
  };

  const handleBackToSelect = () => {
    setScreen('levelSelect');
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '20px',
        minHeight: '100vh',
      }}
    >
      <AnimatePresence mode="wait">
        {screen === 'levelSelect' ? (
          <motion.div
            key="levelSelect"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <LevelSelector
              currentLevel={Math.max(1, state.level)}
              onSelectLevel={handleLevelSelect}
            />
          </motion.div>
        ) : (
          <motion.div
            key="game"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <button
              onClick={handleBackToSelect}
              style={{
                marginBottom: '16px',
                padding: '8px 16px',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                color: '#666',
              }}
            >
              ← 返回选关
            </button>

            <GameHeader level={state.level} moves={state.moves} score={state.score} />

            <GameBoard
              board={state.board}
              selectedCell={state.selectedCell}
              onCellClick={handleCellClick}
            />

            <TargetPanel targets={state.targets} progress={state.progress} />

            {state.gameStatus === 'won' && (
              <LevelComplete
                level={state.level}
                score={state.score}
                onNextLevel={handleNextLevel}
                onReplay={handleReplay}
              />
            )}

            {state.gameStatus === 'lost' && (
              <GameOver
                level={state.level}
                score={state.score}
                onRetry={handleRetry}
                onLevelSelect={handleBackToSelect}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
