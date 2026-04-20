const GameStatus = ({ phase, timeLeft, word, isDrawer, guessTimeLeft }) => {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div style={{
      padding: '20px',
      backgroundColor: '#16213e',
      borderRadius: '12px',
      textAlign: 'center'
    }}>
      {phase === 'waiting' && (
        <div>
          <p style={{ fontSize: '18px', color: '#ff0' }}>等待其他玩家加入...</p>
          <p style={{ fontSize: '14px', color: '#888', marginTop: '10px' }}>
            需要至少2名玩家才能开始游戏
          </p>
        </div>
      )}

      {phase === 'drawing' && (
        <div>
          {isDrawer ? (
            <div>
              <p style={{ fontSize: '16px', color: '#888' }}>请画出下面的词语</p>
              <p style={{
                fontSize: '32px',
                fontWeight: 'bold',
                color: '#0ff',
                marginTop: '10px',
                textShadow: '0 0 20px #0ff'
              }}>
                {word}
              </p>
            </div>
          ) : (
            <p style={{ fontSize: '18px', color: '#f0f' }}>绘画中...</p>
          )}
          <p style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: timeLeft <= 30 ? '#ff4444' : '#0ff',
            marginTop: '15px'
          }}>
            剩余时间: {formatTime(timeLeft)}
          </p>
        </div>
      )}

      {phase === 'guessing' && (
        <div>
          <p style={{ fontSize: '20px', color: '#ff0' }}>猜词时间!</p>
          <p style={{
            fontSize: '28px',
            fontWeight: 'bold',
            color: guessTimeLeft <= 15 ? '#ff4444' : '#f0f',
            marginTop: '10px'
          }}>
            剩余时间: {formatTime(guessTimeLeft)}
          </p>
        </div>
      )}

      {phase === 'ended' && (
        <p style={{ fontSize: '18px', color: '#888' }}>本轮结束</p>
      )}
    </div>
  );
};

export default GameStatus;
