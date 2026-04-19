import { CellContent, Position } from '../types/game';

const BOARD_SIZE = 10;

export function findMatches(board: (CellContent | null)[][]): Position[][] {
  const matches: Position[][] = [];

  // Check horizontal matches
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col <= BOARD_SIZE - 3; col++) {
      const element = board[row][col];
      if (!element) continue;

      let matchLength = 1;
      while (true) {
        const nextCol = col + matchLength;
        if (nextCol >= BOARD_SIZE) break;
        const next = board[row][nextCol];
        if (!next || next.type !== element.type) break;
        matchLength++;
      }

      if (matchLength >= 3) {
        const match: Position[] = [];
        for (let i = 0; i < matchLength; i++) {
          match.push({ row, col: col + i });
        }
        matches.push(match);
        col += matchLength - 1;
      }
    }
  }

  // Check vertical matches
  for (let col = 0; col < BOARD_SIZE; col++) {
    for (let row = 0; row <= BOARD_SIZE - 3; row++) {
      const element = board[row][col];
      if (!element) continue;

      let matchLength = 1;
      while (true) {
        const nextRow = row + matchLength;
        if (nextRow >= BOARD_SIZE) break;
        const next = board[nextRow][col];
        if (!next || next.type !== element.type) break;
        matchLength++;
      }

      if (matchLength >= 3) {
        const match: Position[] = [];
        for (let i = 0; i < matchLength; i++) {
          match.push({ row: row + i, col });
        }
        matches.push(match);
        row += matchLength - 1;
      }
    }
  }

  return matches;
}

export function hasValidMoves(board: (CellContent | null)[][]): boolean {
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      // Try swap right
      if (col < BOARD_SIZE - 1) {
        const swapped = swap(board, row, col, row, col + 1);
        if (findMatches(swapped).length > 0) return true;
      }
      // Try swap down
      if (row < BOARD_SIZE - 1) {
        const swapped = swap(board, row, col, row + 1, col);
        if (findMatches(swapped).length > 0) return true;
      }
    }
  }
  return false;
}

function swap(
  board: (CellContent | null)[][],
  r1: number,
  c1: number,
  r2: number,
  c2: number
): (CellContent | null)[][] {
  const newBoard = board.map(row => [...row]);
  const temp = newBoard[r1][c1];
  newBoard[r1][c1] = newBoard[r2][c2];
  newBoard[r2][c2] = temp;
  return newBoard;
}

export function wouldCreateMatch(
  board: (CellContent | null)[][],
  pos1: Position,
  pos2: Position
): boolean {
  const swapped = swap(board, pos1.row, pos1.col, pos2.row, pos2.col);
  return findMatches(swapped).length > 0;
}

export function calculateScore(matchLength: number, cascadeLevel: number): number {
  const baseScore = matchLength === 3 ? 30 : matchLength === 4 ? 50 : 80;
  const cascadeBonus = cascadeLevel * 20;
  return baseScore + cascadeBonus;
}
