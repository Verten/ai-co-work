import { useReducer, useCallback } from 'react';
import { GameState, GameAction, Position } from '../types/game';
import { getLevelConfig } from '../utils/levelConfig';
import { findMatches, wouldCreateMatch, calculateScore } from '../utils/matchFinder';
import { swapElements, fillGaps, removeMatches } from '../utils/boardFiller';
import { useBoardGenerator } from './useBoardGenerator';

function createInitialState(level: number): GameState {
  const config = getLevelConfig(level);
  const { createBoard } = useBoardGenerator();

  return {
    board: createBoard(),
    level,
    moves: config.moves,
    score: 0,
    targets: config.targets,
    progress: { cat: 0, dog: 0, rabbit: 0, bear: 0, panda: 0 },
    gameStatus: 'playing',
    selectedCell: null,
  };
}

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'SELECT_CELL': {
      if (state.gameStatus !== 'playing') return state;

      const { row, col } = action;
      const selected = state.selectedCell;

      if (!selected) {
        return { ...state, selectedCell: [row, col] };
      }

      // Check if adjacent
      const isAdjacent =
        (Math.abs(selected[0] - row) === 1 && selected[1] === col) ||
        (Math.abs(selected[1] - col) === 1 && selected[0] === row);

      if (isAdjacent && !wouldCreateMatch(state.board, { row: selected[0], col: selected[1] }, { row, col })) {
        // Not a valid move, deselect
        return { ...state, selectedCell: null };
      }

      return {
        ...state,
        selectedCell: [row, col],
      };
    }

    case 'SWAP_ELEMENTS': {
      const { pos1, pos2 } = action;
      const newBoard = swapElements(state.board, pos1, pos2);
      const matches = findMatches(newBoard);

      if (matches.length === 0) {
        // Invalid swap, swap back
        return { ...state, selectedCell: null };
      }

      // Process matches and cascade
      let currentBoard = newBoard;
      let totalScore = 0;
      let cascadeLevel = 0;
      const progress = { ...state.progress };

      while (matches.length > 0) {
        // Calculate score
        matches.forEach(match => {
          totalScore += calculateScore(match.length, cascadeLevel);
          // Update progress
          const elementType = currentBoard[match[0].row][match[0].col];
          if (elementType) {
            progress[elementType] += match.length;
          }
        });

        // Remove matches
        currentBoard = removeMatches(currentBoard, matches);
        // Fill gaps
        const { newBoard: filled } = fillGaps(currentBoard);
        currentBoard = filled;

        cascadeLevel++;
        matches.length = 0; // Will be recalculated below
      }

      // Check for new matches after cascade
      let hasMoreMatches = true;
      while (hasMoreMatches) {
        const newMatches = findMatches(currentBoard);
        if (newMatches.length === 0) {
          hasMoreMatches = false;
        } else {
          newMatches.forEach(match => {
            totalScore += calculateScore(match.length, cascadeLevel);
            const elementType = currentBoard[match[0].row][match[0].col];
            if (elementType) {
              progress[elementType] += match.length;
            }
          });
          currentBoard = removeMatches(currentBoard, newMatches);
          const { newBoard: filled } = fillGaps(currentBoard);
          currentBoard = filled;
          cascadeLevel++;
        }
      }

      // Check win condition
      const allTargetsMet = state.targets.every(
        t => progress[t.type] >= t.count
      );

      const newMoves = state.moves - 1;
      const gameStatus = allTargetsMet ? 'won' : newMoves <= 0 ? 'lost' : 'playing';

      return {
        ...state,
        board: currentBoard,
        score: state.score + totalScore,
        progress,
        moves: newMoves,
        gameStatus,
        selectedCell: null,
      };
    }

    case 'START_LEVEL': {
      return createInitialState(action.level);
    }

    case 'RESET_GAME': {
      return createInitialState(1);
    }

    default:
      return state;
  }
}

export function useGameReducer() {
  const [state, dispatch] = useReducer(gameReducer, 1, createInitialState);

  const selectCell = useCallback((row: number, col: number) => {
    dispatch({ type: 'SELECT_CELL', row, col });
  }, []);

  const swapCells = useCallback((pos1: Position, pos2: Position) => {
    dispatch({ type: 'SWAP_ELEMENTS', pos1, pos2 });
  }, []);

  const startLevel = useCallback((level: number) => {
    dispatch({ type: 'START_LEVEL', level });
  }, []);

  const resetGame = useCallback(() => {
    dispatch({ type: 'RESET_GAME' });
  }, []);

  return {
    state,
    selectCell,
    swapCells,
    startLevel,
    resetGame,
  };
}
