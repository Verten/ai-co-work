import React from 'react';
import { motion } from 'framer-motion';
import { Target, ElementType } from '../types/game';

interface TargetPanelProps {
  targets: Target[];
  progress: Record<ElementType, number>;
}

const ELEMENT_EMOJI: Record<ElementType, string> = {
  cat: '🐱',
  dog: '🐶',
  rabbit: '🐰',
  bear: '🐻',
  panda: '🐼',
};

export const TargetPanel: React.FC<TargetPanelProps> = ({ targets, progress }) => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '16px',
        width: 'min(90vw, 500px)',
        padding: '12px',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: '12px',
        marginTop: '12px',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
      }}
    >
      {targets.map((target, index) => {
        const current = progress[target.type];
        const isComplete = current >= target.count;
        const isAlmost = current >= target.count * 0.7;

        return (
          <motion.div
            key={`${target.type}-${index}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              backgroundColor: isComplete ? '#E8F5E9' : isAlmost ? '#FFF3E0' : '#FAFAFA',
              borderRadius: '20px',
              border: `2px solid ${isComplete ? '#4CAF50' : isAlmost ? '#FF9800' : '#E0E0E0'}`,
            }}
          >
            <span style={{ fontSize: '24px' }}>{ELEMENT_EMOJI[target.type]}</span>
            <span
              style={{
                fontSize: '16px',
                fontWeight: 'bold',
                color: isComplete ? '#4CAF50' : '#333',
              }}
            >
              {Math.min(current, target.count)}/{target.count}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
};
