import { CellContent, Position } from '../types/game';
import { ELEMENT_TYPES } from './levelConfig';

const BOARD_SIZE = 10;

let idCounter = 0;

function generateId(): string {
  return `element-${++idCounter}`;
}

export function generateBoard(): (CellContent | null)[][] {
  const board: (CellContent | null)[][] = [];

  for (let row = 0; row < BOARD_SIZE; row++) {
    board[row] = [];
    for (let col = 0; col < BOARD_SIZE; col++) {
      board[row][col] = getRandomElement(board, row, col);
    }
  }

  return board;
}

function getRandomElement(board: (CellContent | null)[][], row: number, col: number): CellContent {
  const available = [...ELEMENT_TYPES];

  // Avoid creating horizontal matches
  if (col >= 2) {
    const left1 = board[row][col - 1];
    const left2 = board[row][col - 2];
    if (left1 && left2 && left1.type === left2.type) {
      const idx = available.indexOf(left1.type);
      if (idx > -1) available.splice(idx, 1);
    }
  }

  // Avoid creating vertical matches
  if (row >= 2) {
    const up1 = board[row - 1][col];
    const up2 = board[row - 2][col];
    if (up1 && up2 && up1.type === up2.type) {
      const idx = available.indexOf(up1.type);
      if (idx > -1) available.splice(idx, 1);
    }
  }

  const finalType = available[Math.floor(Math.random() * available.length)];
  return { id: generateId(), type: finalType };
}

export function fillGaps(board: (CellContent | null)[][]): {
  newBoard: (CellContent | null)[][];
} {
  const newBoard = board.map(row => [...row]);

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
      }
    }

    // Fill top empty spaces with new elements
    for (let row = emptySpaces - 1; row >= 0; row--) {
      newBoard[row][col] = getRandomElement(newBoard, row, col);
    }
  }

  return { newBoard };
}

export function swapElements(
  board: (CellContent | null)[][],
  pos1: Position,
  pos2: Position
): (CellContent | null)[][] {
  const newBoard = board.map(row => [...row]);
  const temp = newBoard[pos1.row][pos1.col];
  newBoard[pos1.row][pos1.col] = newBoard[pos2.row][pos2.col];
  newBoard[pos2.row][pos2.col] = temp;
  return newBoard;
}

export function removeMatches(
  board: (CellContent | null)[][],
  matches: Position[][]
): (CellContent | null)[][] {
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
