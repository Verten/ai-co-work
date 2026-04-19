import React from 'react';
import { motion } from 'framer-motion';
import { ElementType } from '../types/game';

interface ElementProps {
  type: ElementType;
  isSelected?: boolean;
  isMatching?: boolean;
}

const ELEMENT_EMOJI: Record<ElementType, string> = {
  cat: '🐱',
  dog: '🐶',
  rabbit: '🐰',
  bear: '🐻',
  panda: '🐼',
};

export const Element: React.FC<ElementProps> = ({
  type,
  isSelected,
  isMatching,
}) => {
  const emoji = ELEMENT_EMOJI[type];

  return (
    <motion.div
      animate={
        isMatching
          ? { scale: [1, 1.3, 0], opacity: [1, 1, 0] }
          : { scale: 1, opacity: 1 }
      }
      transition={isMatching ? { duration: 0.3 } : { duration: 0 }}
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer',
        filter: isSelected
          ? 'drop-shadow(0 0 8px rgba(255,255,0,0.8))'
          : 'none',
        overflow: 'visible',
      }}
    >
      <span style={{ fontSize: '3.6rem', lineHeight: 1 }}>{emoji}</span>
    </motion.div>
  );
};
