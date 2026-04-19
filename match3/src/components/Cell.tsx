import React from 'react';
import { motion } from 'framer-motion';
import { CellContent } from '../types/game';
import { Element } from './Element';

interface CellProps {
  cell: CellContent | null;
  row: number;
  col: number;
  isSelected: boolean;
  onClick: () => void;
}

export const Cell: React.FC<CellProps> = ({ cell, row, col, isSelected, onClick }) => {
  return (
    <motion.div
      layoutId={cell ? cell.id : `empty-${row}-${col}`}
      onClick={onClick}
      transition={{
        layout: { duration: 0.3, ease: 'easeInOut' },
      }}
      style={{
        width: '100%',
        paddingBottom: '100%',
        position: 'relative',
        cursor: cell ? 'pointer' : 'default',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          borderRadius: '8px',
          border: isSelected ? '3px solid #FFD700' : '2px solid rgba(255, 255, 255, 0.3)',
          boxShadow: isSelected ? '0 0 10px rgba(255, 215, 0, 0.5)' : 'none',
          overflow: 'hidden',
        }}
      >
        {cell && (
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Element type={cell.type} isSelected={isSelected} />
          </div>
        )}
      </div>
    </motion.div>
  );
};
