import React from 'react';
import { motion } from 'framer-motion';
import { CellContent, AnimationPhase } from '../types/game';
import { Element } from './Element';

interface CellProps {
  cell: CellContent | null;
  row: number;
  col: number;
  isSelected: boolean;
  isMatching: boolean;
  animationPhase: AnimationPhase;
  onClick: () => void;
}

export const Cell: React.FC<CellProps> = ({
  cell,
  row,
  col,
  isSelected,
  isMatching,
  animationPhase,
  onClick,
}) => {
  const isBeingRemoved = animationPhase === 'removing' && isMatching;

  return (
    <motion.div
      layoutId={cell ? cell.id : `empty-${row}-${col}`}
      onClick={onClick}
      transition={{
        layout: { duration: 0.2, ease: 'easeInOut' },
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
          backgroundColor: isSelected
            ? 'rgba(255, 215, 0, 0.25)'
            : 'rgba(255, 255, 255, 0.15)',
          borderRadius: '12px',
          border: isSelected
            ? '3px solid #FFD700'
            : '2px solid rgba(255, 255, 255, 0.25)',
          boxShadow: isSelected ? '0 0 12px rgba(255, 215, 0, 0.5)' : 'none',
          overflow: 'visible',
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
              padding: '16px',
              boxSizing: 'border-box',
            }}
          >
            <motion.div
              animate={
                isBeingRemoved
                  ? { scale: [1, 1.2, 0], opacity: [1, 1, 0] }
                  : isMatching
                    ? { scale: [1, 1.1, 1], opacity: [1, 0.7, 1] }
                    : { scale: 1, opacity: 1 }
              }
              transition={
                isBeingRemoved
                  ? { duration: 0.3, ease: 'easeOut' }
                  : isMatching
                    ? { duration: 0.3, repeat: Infinity, repeatType: 'reverse' }
                    : { duration: 0.2 }
              }
              style={{ overflow: 'visible' }}
            >
              <Element
                type={cell.type}
                isSelected={isSelected}
                isMatching={isMatching}
              />
            </motion.div>
          </div>
        )}
      </div>
    </motion.div>
  );
};
