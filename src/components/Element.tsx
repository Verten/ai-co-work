import React from 'react';
import { motion } from 'framer-motion';
import { ElementType } from '../types/game';

interface ElementProps {
  type: ElementType;
  isSelected?: boolean;
  isMatching?: boolean;
}

const ELEMENT_COLORS: Record<ElementType, string> = {
  cat: '#FF8C42',
  dog: '#C4A484',
  rabbit: '#FFB6C1',
  bear: '#8B5A2B',
  panda: '#2C2C2C',
};

export const Element: React.FC<ElementProps> = ({ type, isSelected, isMatching }) => {
  const color = ELEMENT_COLORS[type];

  return (
    <motion.div
      animate={isMatching ? { scale: [1, 1.3, 0], opacity: [1, 1, 0] } : { scale: 1, opacity: 1 }}
      transition={isMatching ? { duration: 0.3 } : { duration: 0 }}
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer',
      }}
    >
      <svg
        viewBox="0 0 100 100"
        style={{
          width: '85%',
          height: '85%',
          filter: isSelected ? 'drop-shadow(0 0 8px rgba(255,255,0,0.8))' : 'none',
        }}
      >
        {/* Base circle */}
        <circle cx="50" cy="50" r="45" fill={color} />

        {type === 'cat' && (
          <>
            {/* Cat ears */}
            <polygon points="20,30 30,10 40,30" fill={color} />
            <polygon points="60,30 70,10 80,30" fill={color} />
            <polygon points="25,28 32,15 38,28" fill="#FFD4A8" />
            <polygon points="62,28 68,15 75,28" fill="#FFD4A8" />
            {/* Eyes */}
            <ellipse cx="35" cy="45" rx="5" ry="3" fill="#333" />
            <ellipse cx="65" cy="45" rx="5" ry="3" fill="#333" />
            {/* Nose */}
            <ellipse cx="50" cy="55" rx="4" ry="3" fill="#FF6B6B" />
            {/* Mouth */}
            <path d="M 45 60 Q 50 65 55 60" stroke="#333" strokeWidth="2" fill="none" />
          </>
        )}

        {type === 'dog' && (
          <>
            {/* Dog ears */}
            <ellipse cx="20" cy="35" rx="12" ry="20" fill={color} />
            <ellipse cx="80" cy="35" rx="12" ry="20" fill={color} />
            {/* Eyes */}
            <circle cx="35" cy="45" r="5" fill="#333" />
            <circle cx="65" cy="45" r="5" fill="#333" />
            <circle cx="36" cy="44" r="2" fill="#FFF" />
            <circle cx="66" cy="44" r="2" fill="#FFF" />
            {/* Nose */}
            <ellipse cx="50" cy="58" rx="6" ry="4" fill="#333" />
            {/* Tongue */}
            <ellipse cx="50" cy="68" rx="4" ry="6" fill="#FF6B6B" />
          </>
        )}

        {type === 'rabbit' && (
          <>
            {/* Rabbit ears */}
            <ellipse cx="35" cy="20" rx="8" ry="25" fill={color} />
            <ellipse cx="65" cy="20" rx="8" ry="25" fill={color} />
            <ellipse cx="35" cy="20" rx="4" ry="18" fill="#FFB6C1" />
            <ellipse cx="65" cy="20" rx="4" ry="18" fill="#FFB6C1" />
            {/* Eyes */}
            <circle cx="35" cy="50" r="5" fill="#333" />
            <circle cx="65" cy="50" r="5" fill="#333" />
            <circle cx="36" cy="49" r="2" fill="#FFF" />
            <circle cx="66" cy="49" r="2" fill="#FFF" />
            {/* Nose */}
            <ellipse cx="50" cy="60" rx="4" ry="3" fill="#FF6B6B" />
            {/* Whiskers */}
            <line x1="30" y1="58" x2="15" y2="55" stroke="#333" strokeWidth="1" />
            <line x1="30" y1="62" x2="15" y2="65" stroke="#333" strokeWidth="1" />
            <line x1="70" y1="58" x2="85" y2="55" stroke="#333" strokeWidth="1" />
            <line x1="70" y1="62" x2="85" y2="65" stroke="#333" strokeWidth="1" />
          </>
        )}

        {type === 'bear' && (
          <>
            {/* Bear ears */}
            <circle cx="20" cy="25" r="12" fill={color} />
            <circle cx="80" cy="25" r="12" fill={color} />
            <circle cx="20" cy="25" r="6" fill="#D4A574" />
            <circle cx="80" cy="25" r="6" fill="#D4A574" />
            {/* Eyes */}
            <circle cx="35" cy="45" r="5" fill="#333" />
            <circle cx="65" cy="45" r="5" fill="#333" />
            {/* Honey pot */}
            <rect x="38" y="55" width="24" height="20" rx="3" fill="#FFD700" />
            <ellipse cx="50" cy="55" rx="12" ry="4" fill="#DAA520" />
          </>
        )}

        {type === 'panda' && (
          <>
            {/* Panda ears */}
            <circle cx="20" cy="25" r="15" fill="#333" />
            <circle cx="80" cy="25" r="15" fill="#333" />
            {/* Panda patches */}
            <ellipse cx="35" cy="45" rx="12" ry="10" fill="#FFF" />
            <ellipse cx="65" cy="45" rx="12" ry="10" fill="#FFF" />
            {/* Eyes */}
            <circle cx="35" cy="45" r="6" fill="#333" />
            <circle cx="65" cy="45" r="6" fill="#333" />
            <circle cx="36" cy="44" r="2" fill="#FFF" />
            <circle cx="66" cy="44" r="2" fill="#FFF" />
            {/* Nose */}
            <ellipse cx="50" cy="58" rx="5" ry="3" fill="#333" />
            {/* Bamboo */}
            <rect x="44" y="70" width="4" height="20" fill="#228B22" />
            <rect x="52" y="65" width="4" height="25" fill="#228B22" />
          </>
        )}
      </svg>
    </motion.div>
  );
};
