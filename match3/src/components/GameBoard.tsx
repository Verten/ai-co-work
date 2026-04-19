import React from 'react';
import { CellContent } from '../types/game';
import { Cell } from './Cell';

interface GameBoardProps {
  board: (CellContent | null)[][];
  selectedCell: [number, number] | null;
  onCellClick: (row: number, col: number) => void;
}

const BOARD_SIZE = 10;

export const GameBoard: React.FC<GameBoardProps> = ({
  board,
  selectedCell,
  onCellClick,
}) => {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${BOARD_SIZE}, 1fr)`,
        gridTemplateRows: `repeat(${BOARD_SIZE}, 1fr)`,
        gap: '4px',
        padding: '12px',
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        borderRadius: '12px',
        width: 'min(90vw, 500px)',
        height: 'min(90vw, 500px)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
      }}
    >
      {board.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <Cell
            key={`${rowIndex}-${colIndex}`}
            cell={cell}
            row={rowIndex}
            col={colIndex}
            isSelected={
              selectedCell !== null &&
              selectedCell[0] === rowIndex &&
              selectedCell[1] === colIndex
            }
            onClick={() => onCellClick(rowIndex, colIndex)}
          />
        ))
      )}
    </div>
  );
};
