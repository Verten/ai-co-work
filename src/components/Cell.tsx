import React from 'react';
import { motion } from 'framer-motion';
import { ElementType } from '../types/game';
import { Element } from './Element';

interface CellProps {
  type: ElementType | null;
  row: number;
  col: number;
  isSelected: boolean;
  onClick: () => void;
}

export const Cell: React.FC<CellProps> = ({ type, isSelected, onClick }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      style={{
        width: '100%',
        paddingBottom: '100%',
        position: 'relative',
        cursor: type ? 'pointer' : 'default',
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
        }}
      >
        {type && <Element type={type} isSelected={isSelected} />}
      </div>
    </motion.div>
  );
};
