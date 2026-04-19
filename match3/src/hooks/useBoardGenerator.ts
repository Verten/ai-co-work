import { useCallback } from 'react';
import { CellContent } from '../types/game';
import { generateBoard } from '../utils/boardFiller';
import { hasValidMoves } from '../utils/matchFinder';

export function useBoardGenerator() {
  const createBoard = useCallback((): (CellContent | null)[][] => {
    let board = generateBoard();

    // Ensure there's at least one valid move
    while (!hasValidMoves(board)) {
      board = generateBoard();
    }

    return board;
  }, []);

  return { createBoard };
}
