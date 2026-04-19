import { useReducer, useCallback } from 'react';
import { GameState, GameAction, Position, ElementType } from '../types/game';
import { getLevelConfig } from '../utils/levelConfig';
import { findMatches, wouldCreateMatch, calculateScore } from '../utils/matchFinder';
import { generateBoard, swapElements, fillGaps, removeMatches } from '../utils/boardFiller';
import { hasValidMoves } from '../utils/matchFinder';

function createBoard(): (ElementType | null)[][] {
  let board = generateBoard();
  while (!hasValidMoves(board)) {
    board = generateBoard();
  }
  return board;
}

function createInitialState(level: number): GameState {
  const config = getLevelConfig(level);

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

function processMatchesAndCascade(board: (ElementType | null)[][], progress: Record<ElementType, number>) {
  let currentBoard = board;
  let totalScore = 0;
  let cascadeLevel = 0;

  // Find initial matches
  let matches = findMatches(currentBoard);

  // Process matches and cascades
  while (matches.length > 0) {
    // Calculate score and update progress for this round
    matches.forEach(match => {
      totalScore += calculateScore(match.length, cascadeLevel);
      const elementType = currentBoard[match[0].row][match[0].col];
      if (elementType) {
        progress[elementType] += match.length;
      }
    });

    // Remove matches
    currentBoard = removeMatches(currentBoard, matches);

    // Fill gaps - this creates new board
    const { newBoard: filled } = fillGaps(currentBoard);
    currentBoard = filled;

    cascadeLevel++;

    // Find new matches in the filled board
    matches = findMatches(currentBoard);
  }

  return { board: currentBoard, score: totalScore, cascadeLevel };
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
        // Invalid swap, swap back - just deselect
        return { ...state, selectedCell: null };
      }

      // Valid swap - process matches and cascade
      const progress = { ...state.progress };
      const { board: finalBoard, score: matchScore } = processMatchesAndCascade(newBoard, progress);

      const totalScore = state.score + matchScore;

      // Check win condition
      const allTargetsMet = state.targets.every(
        t => progress[t.type] >= t.count
      );

      const newMoves = state.moves - 1;
      const gameStatus = allTargetsMet ? 'won' : newMoves <= 0 ? 'lost' : 'playing';

      return {
        ...state,
        board: finalBoard,
        score: totalScore,
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
