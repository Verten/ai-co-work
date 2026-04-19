import React from 'react';
import { motion } from 'framer-motion';

interface GameOverProps {
  level: number;
  score: number;
  onRetry: () => void;
  onLevelSelect: () => void;
}

export const GameOver: React.FC<GameOverProps> = ({
  level,
  score,
  onRetry,
  onLevelSelect,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        zIndex: 1000,
      }}
    >
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 15 }}
        style={{
          backgroundColor: '#FFF',
          borderRadius: '24px',
          padding: '40px',
          textAlign: 'center',
          maxWidth: '320px',
          width: '90%',
        }}
      >
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>😢</div>
        <h2 style={{ fontSize: '28px', color: '#333', marginBottom: '8px' }}>步数用完</h2>
        <p style={{ fontSize: '18px', color: '#666', marginBottom: '24px' }}>
          第 {level} 关失败
        </p>
        <div
          style={{
            backgroundColor: '#F5F5F5',
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '24px',
          }}
        >
          <div style={{ fontSize: '14px', color: '#666' }}>当前得分</div>
          <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#FF6B6B' }}>{score}</div>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={onLevelSelect}
            style={{
              flex: 1,
              padding: '14px 24px',
              borderRadius: '12px',
              border: 'none',
              backgroundColor: '#E0E0E0',
              color: '#333',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
          >
            选关
          </button>
          <button
            onClick={onRetry}
            style={{
              flex: 1,
              padding: '14px 24px',
              borderRadius: '12px',
              border: 'none',
              backgroundColor: '#FF6B6B',
              color: '#FFF',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
          >
            重试
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};
