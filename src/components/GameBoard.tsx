import React from 'react';
import { motion } from 'framer-motion';
import { ElementType } from '../types/game';
import { Cell } from './Cell';

interface GameBoardProps {
  board: (ElementType | null)[][];
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
          <motion.div
            key={`${rowIndex}-${colIndex}`}
            layout
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: (rowIndex * BOARD_SIZE + colIndex) * 0.005 }}
          >
            <Cell
              type={cell}
              row={rowIndex}
              col={colIndex}
              isSelected={
                selectedCell !== null &&
                selectedCell[0] === rowIndex &&
                selectedCell[1] === colIndex
              }
              onClick={() => onCellClick(rowIndex, colIndex)}
            />
          </motion.div>
        ))
      )}
    </div>
  );
};
