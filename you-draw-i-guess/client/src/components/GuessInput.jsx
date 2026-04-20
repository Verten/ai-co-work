import { useState } from 'react';

const GuessInput = ({ onGuess, disabled, placeholder }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim() && !disabled) {
      onGuess(text.trim());
      setText('');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: 'flex',
        gap: '10px',
        padding: '15px',
        backgroundColor: '#16213e',
        borderRadius: '12px'
      }}
    >
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={placeholder || '输入你的猜测...'}
        disabled={disabled}
        style={{
          flex: 1,
          padding: '12px 16px',
          fontSize: '16px',
          border: '2px solid #0ff',
          borderRadius: '8px',
          backgroundColor: '#1a1a2e',
          color: '#fff',
          outline: 'none'
        }}
      />
      <button
        type="submit"
        disabled={disabled}
        style={{
          padding: '12px 24px',
          fontSize: '16px',
          fontWeight: 'bold',
          backgroundColor: disabled ? '#333' : '#0ff',
          color: disabled ? '#666' : '#000',
          border: 'none',
          borderRadius: '8px',
          cursor: disabled ? 'not-allowed' : 'pointer',
          transition: 'all 0.3s'
        }}
      >
        发送
      </button>
    </form>
  );
};

export default GuessInput;
