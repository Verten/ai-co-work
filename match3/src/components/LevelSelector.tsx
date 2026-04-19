import React from 'react';
import { motion } from 'framer-motion';
import { LEVEL_CONFIGS } from '../utils/levelConfig';

interface LevelSelectorProps {
  currentLevel: number;
  onSelectLevel: (level: number) => void;
}

export const LevelSelector: React.FC<LevelSelectorProps> = ({ currentLevel, onSelectLevel }) => {
  return (
    <div
      style={{
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '24px',
        padding: '24px',
        width: 'min(90vw, 500px)',
        maxHeight: '80vh',
        overflowY: 'auto',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
      }}
    >
      <h2
        style={{
          fontSize: '24px',
          color: '#333',
          textAlign: 'center',
          marginBottom: '20px',
        }}
      >
        选择关卡
      </h2>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: '10px',
        }}
      >
        {LEVEL_CONFIGS.map((config) => {
          const isUnlocked = config.id <= currentLevel;
          const isCurrent = config.id === currentLevel;

          return (
            <motion.button
              key={config.id}
              whileHover={isUnlocked ? { scale: 1.1 } : {}}
              whileTap={isUnlocked ? { scale: 0.9 } : {}}
              onClick={() => isUnlocked && onSelectLevel(config.id)}
              disabled={!isUnlocked}
              style={{
                width: '100%',
                aspectRatio: '1',
                borderRadius: '12px',
                border: isCurrent ? '3px solid #4CAF50' : '2px solid #E0E0E0',
                backgroundColor: isUnlocked ? (isCurrent ? '#E8F5E9' : '#FAFAFA') : '#E0E0E0',
                color: isUnlocked ? '#333' : '#999',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: isUnlocked ? 'pointer' : 'not-allowed',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '4px',
              }}
            >
              <span>{config.id}</span>
              {!isUnlocked && <span style={{ fontSize: '10px' }}>🔒</span>}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
