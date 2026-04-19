import { useReducer, useCallback, useEffect, useRef } from 'react';
import { GameState, GameAction, Position, ElementType, CellContent } from '../types/game';
import { getLevelConfig } from '../utils/levelConfig';
import { findMatches, wouldCreateMatch, calculateScore } from '../utils/matchFinder';
import { generateBoard, swapElements, fillGaps, removeMatches } from '../utils/boardFiller';
import { hasValidMoves } from '../utils/matchFinder';

const SWAP_DURATION = 200;
const MATCH_DURATION = 300;
const REMOVE_DURATION = 300;
const FALL_DURATION = 300;

function createBoard(): (CellContent | null)[][] {
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
    animationPhase: 'idle',
    matchingCells: [],
  };
}

function findAllMatches(board: (CellContent | null)[][]): Position[] {
  const matches = findMatches(board);
  const positions: Position[] = [];
  matches.forEach(match => {
    match.forEach(pos => {
      if (!positions.some(p => p.row === pos.row && p.col === pos.col)) {
        positions.push(pos);
      }
    });
  });
  return positions;
}

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'SELECT_CELL': {
      if (state.gameStatus !== 'playing') return state;
      if (state.animationPhase !== 'idle') return state;

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
      if (state.animationPhase !== 'idle') return state;

      const { pos1, pos2 } = action;
      const newBoard = swapElements(state.board, pos1, pos2);
      const matches = findMatches(newBoard);

      if (matches.length === 0) {
        // Invalid swap, swap back - just deselect
        return { ...state, selectedCell: null };
      }

      // Valid swap - start animation sequence
      return {
        ...state,
        board: newBoard,
        selectedCell: null,
        animationPhase: 'swapping',
        matchingCells: [],
      };
    }

    case 'SET_MATCHING': {
      const matchingCells = action.cells;

      if (matchingCells.length === 0) {
        // No more matches, animation complete
        const allTargetsMet = state.targets.every(
          t => state.progress[t.type] >= t.count
        );
        const gameStatus = allTargetsMet ? 'won' : state.gameStatus === 'lost' ? 'lost' : 'playing';

        return {
          ...state,
          animationPhase: 'idle',
          matchingCells: [],
          gameStatus,
        };
      }

      return {
        ...state,
        animationPhase: 'matching',
        matchingCells,
      };
    }

    case 'REMOVE_MATCHES': {
      const matchingCells = state.matchingCells;
      if (matchingCells.length === 0) {
        return { ...state, animationPhase: 'idle' };
      }

      // Calculate score and update progress
      let totalScore = 0;
      const progress = { ...state.progress };

      // Group matching cells by type for scoring
      const typeCount: Record<ElementType, number> = { cat: 0, dog: 0, rabbit: 0, bear: 0, panda: 0 };
      matchingCells.forEach(pos => {
        const cell = state.board[pos.row][pos.col];
        if (cell) {
          typeCount[cell.type]++;
        }
      });

      // Calculate score for this match
      Object.values(typeCount).forEach(count => {
        if (count > 0) {
          totalScore += calculateScore(count, 0);
        }
      });

      // Update progress
      matchingCells.forEach(pos => {
        const cell = state.board[pos.row][pos.col];
        if (cell) {
          progress[cell.type] += 1;
        }
      });

      // Remove matches from board
      const newBoard = removeMatches(state.board, findMatches(state.board));

      return {
        ...state,
        board: newBoard,
        score: state.score + totalScore,
        progress,
        animationPhase: 'removing',
      };
    }

    case 'FILL_AND_CASCADE': {
      // Fill gaps and check for new matches
      const { newBoard: filled } = fillGaps(state.board);

      // Check for new matches
      const newMatches = findAllMatches(filled);

      if (newMatches.length > 0) {
        // Continue cascade with new matches
        return {
          ...state,
          board: filled,
          animationPhase: 'falling',
          matchingCells: newMatches,
        };
      }

      // No more matches - check win/lose conditions
      const allTargetsMet = state.targets.every(
        t => state.progress[t.type] >= t.count
      );

      const newMoves = state.moves - 1;
      const gameStatus = allTargetsMet ? 'won' : newMoves <= 0 ? 'lost' : 'playing';

      return {
        ...state,
        board: filled,
        animationPhase: 'idle',
        matchingCells: [],
        moves: newMoves,
        gameStatus,
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
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stateRef = useRef(state);

  // Keep stateRef in sync
  stateRef.current = state;

  // Handle animation sequence
  useEffect(() => {
    const currentPhase = state.animationPhase;

    if (currentPhase === 'idle') {
      return;
    }

    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    const runAnimation = () => {
      const currentState = stateRef.current;

      if (currentState.animationPhase === 'swapping') {
        timeoutRef.current = setTimeout(() => {
          const matches = findAllMatches(stateRef.current.board);
          dispatch({ type: 'SET_MATCHING', cells: matches });
        }, SWAP_DURATION);
      } else if (currentState.animationPhase === 'matching') {
        timeoutRef.current = setTimeout(() => {
          dispatch({ type: 'REMOVE_MATCHES' });
        }, MATCH_DURATION);
      } else if (currentState.animationPhase === 'removing') {
        timeoutRef.current = setTimeout(() => {
          dispatch({ type: 'FILL_AND_CASCADE' });
        }, REMOVE_DURATION);
      } else if (currentState.animationPhase === 'falling') {
        timeoutRef.current = setTimeout(() => {
          const matches = findAllMatches(stateRef.current.board);
          dispatch({ type: 'SET_MATCHING', cells: matches });
        }, FALL_DURATION);
      }
    };

    runAnimation();

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [state.animationPhase]);

  const selectCell = useCallback((row: number, col: number) => {
    dispatch({ type: 'SELECT_CELL', row, col });
  }, []);

  const swapCells = useCallback((pos1: Position, pos2: Position) => {
    dispatch({ type: 'SWAP_ELEMENTS', pos1, pos2 });
  }, []);

  const startLevel = useCallback((level: number) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    dispatch({ type: 'START_LEVEL', level });
  }, []);

  const resetGame = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
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
