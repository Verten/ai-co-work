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
        width: 'min(95vw, 560px)',
        padding: '12px',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '12px',
        marginTop: '12px',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)',
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
              backgroundColor: isComplete ? 'rgba(76, 175, 80, 0.3)' : isAlmost ? 'rgba(255, 152, 0, 0.3)' : 'rgba(255, 255, 255, 0.15)',
              borderRadius: '20px',
              border: `2px solid ${isComplete ? '#4CAF50' : isAlmost ? '#FF9800' : 'rgba(255, 255, 255, 0.3)'}`,
            }}
          >
            <span style={{ fontSize: '24px' }}>{ELEMENT_EMOJI[target.type]}</span>
            <span
              style={{
                fontSize: '16px',
                fontWeight: 'bold',
                color: isComplete ? '#4CAF50' : '#fff',
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
