import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ScorePopupProps {
  score: number;
  position: { x: number; y: number };
  onComplete: () => void;
}

export const ScorePopup: React.FC<ScorePopupProps> = ({ score, position, onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5, y: 0 }}
      animate={{ opacity: 1, scale: 1.2, y: -30 }}
      exit={{ opacity: 0, scale: 0.5, y: -60 }}
      transition={{ duration: 0.5 }}
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y,
        pointerEvents: 'none',
        fontSize: '24px',
        fontWeight: 'bold',
        color: '#FFD700',
        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
        zIndex: 100,
      }}
    >
      +{score}
    </motion.div>
  );
};
