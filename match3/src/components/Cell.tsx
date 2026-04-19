import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ElementType } from '../types/game';
import { Element } from './Element';

interface CellProps {
  type: ElementType | null;
  row: number;
  col: number;
  isSelected: boolean;
  isMatching?: boolean;
  onClick: () => void;
}

export const Cell: React.FC<CellProps> = ({ type, row, col, isSelected, isMatching, onClick }) => {
  return (
    <motion.div
      layout
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      transition={{
        layout: { duration: 0.3, ease: 'easeInOut' },
      }}
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
          overflow: 'hidden',
        }}
      >
        <AnimatePresence mode="popLayout">
          {type && (
            <motion.div
              key={`${type}-${row}-${col}`}
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: isMatching ? [1, 1.3, 0] : 1,
                opacity: isMatching ? [1, 1, 0] : 1,
              }}
              transition={{
                duration: isMatching ? 0.3 : 0.2,
                ease: 'easeOut',
              }}
              exit={{ scale: 0, opacity: 0 }}
              layout
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Element type={type} isSelected={isSelected} isMatching={isMatching} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
