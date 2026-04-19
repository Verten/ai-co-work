import React from 'react';

interface GameHeaderProps {
  level: number;
  moves: number;
  score: number;
}

export const GameHeader: React.FC<GameHeaderProps> = ({ level, moves, score }) => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        width: 'min(90vw, 500px)',
        padding: '16px',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: '12px',
        marginBottom: '12px',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '14px', color: '#666' }}>关卡</div>
        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#333' }}>{level}</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '14px', color: '#666' }}>步数</div>
        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#FF6B6B' }}>{moves}</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '14px', color: '#666' }}>分数</div>
        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#4CAF50' }}>{score}</div>
      </div>
    </div>
  );
};
