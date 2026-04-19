import { ElementType, Position } from '../types/game';
import { ELEMENT_TYPES } from './levelConfig';

const BOARD_SIZE = 10;

export function generateBoard(): (ElementType | null)[][] {
  const board: (ElementType | null)[][] = [];

  for (let row = 0; row < BOARD_SIZE; row++) {
    board[row] = [];
    for (let col = 0; col < BOARD_SIZE; col++) {
      board[row][col] = getRandomElement(board, row, col);
    }
  }

  return board;
}

function getRandomElement(board: (ElementType | null)[][], row: number, col: number): ElementType {
  const available = [...ELEMENT_TYPES];

  // Avoid creating horizontal matches
  if (col >= 2) {
    const left1 = board[row][col - 1];
    const left2 = board[row][col - 2];
    if (left1 && left1 === left2) {
      const idx = available.indexOf(left1);
      if (idx > -1) available.splice(idx, 1);
    }
  }

  // Avoid creating vertical matches
  if (row >= 2) {
    const up1 = board[row - 1][col];
    const up2 = board[row - 2][col];
    if (up1 && up1 === up2) {
      const idx = available.indexOf(up1);
      if (idx > -1) available.splice(idx, 1);
    }
  }

  return available[Math.floor(Math.random() * available.length)];
}

export function fillGaps(board: (ElementType | null)[][]): {
  newBoard: (ElementType | null)[][];
  updates: { from: Position; to: Position; element: ElementType }[];
} {
  const newBoard = board.map(row => [...row]);
  const updates: { from: Position; to: Position; element: ElementType }[] = [];

  for (let col = 0; col < BOARD_SIZE; col++) {
    let emptySpaces = 0;

    // Process from bottom to top
    for (let row = BOARD_SIZE - 1; row >= 0; row--) {
      if (newBoard[row][col] === null) {
        emptySpaces++;
      } else if (emptySpaces > 0) {
        // Move element down
        const element = newBoard[row][col];
        const newRow = row + emptySpaces;
        newBoard[newRow][col] = element;
        newBoard[row][col] = null;
        updates.push({
          from: { row, col },
          to: { row: newRow, col },
          element: element!,
        });
      }
    }

    // Fill top empty spaces with new elements
    for (let row = emptySpaces - 1; row >= 0; row--) {
      const element = ELEMENT_TYPES[Math.floor(Math.random() * ELEMENT_TYPES.length)];
      newBoard[row][col] = element;
      updates.push({
        from: { row: -1, col },
        to: { row, col },
        element,
      });
    }
  }

  return { newBoard, updates };
}

export function swapElements(
  board: (ElementType | null)[][],
  pos1: Position,
  pos2: Position
): (ElementType | null)[][] {
  const newBoard = board.map(row => [...row]);
  const temp = newBoard[pos1.row][pos1.col];
  newBoard[pos1.row][pos1.col] = newBoard[pos2.row][pos2.col];
  newBoard[pos2.row][pos2.col] = temp;
  return newBoard;
}

export function removeMatches(
  board: (ElementType | null)[][],
  matches: Position[][]
): (ElementType | null)[][] {
  const newBoard = board.map(row => [...row]);
  const toRemove = new Set<string>();

  matches.forEach(match => {
    match.forEach(pos => {
      toRemove.add(`${pos.row},${pos.col}`);
    });
  });

  toRemove.forEach(key => {
    const [row, col] = key.split(',').map(Number);
    newBoard[row][col] = null;
  });

  return newBoard;
}
