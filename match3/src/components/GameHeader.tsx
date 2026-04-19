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
        width: 'min(95vw, 560px)',
        padding: '16px',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '12px',
        marginBottom: '12px',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)' }}>关卡</div>
        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#fff' }}>{level}</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)' }}>步数</div>
        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#FF6B6B' }}>{moves}</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)' }}>分数</div>
        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#4CAF50' }}>{score}</div>
      </div>
    </div>
  );
};
