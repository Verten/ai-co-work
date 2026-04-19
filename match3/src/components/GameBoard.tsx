import React from 'react';
import { CellContent, Position, AnimationPhase } from '../types/game';
import { Cell } from './Cell';

interface GameBoardProps {
  board: (CellContent | null)[][];
  selectedCell: [number, number] | null;
  animationPhase: AnimationPhase;
  matchingCells: Position[];
  onCellClick: (row: number, col: number) => void;
}

const BOARD_SIZE = 10;

export const GameBoard: React.FC<GameBoardProps> = ({
  board,
  selectedCell,
  animationPhase,
  matchingCells,
  onCellClick,
}) => {
  const isCellMatching = (row: number, col: number) => {
    return matchingCells.some((pos) => pos.row === row && pos.col === col);
  };

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${BOARD_SIZE}, 1fr)`,
        gridTemplateRows: `repeat(${BOARD_SIZE}, 1fr)`,
        gap: '6px',
        padding: '10px',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '16px',
        width: 'min(95vw, 800px)',
        height: 'min(95vw, 800px)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
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
            isMatching={isCellMatching(rowIndex, colIndex)}
            animationPhase={animationPhase}
            onClick={() => onCellClick(rowIndex, colIndex)}
          />
        )),
      )}
    </div>
  );
};
