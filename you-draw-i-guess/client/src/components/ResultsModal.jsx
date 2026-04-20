const ResultsModal = ({ scores, nextRoundTime }) => {
  const sorted = [...scores].sort((a, b) => b.score - a.score);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: '#16213e',
        borderRadius: '16px',
        padding: '30px',
        minWidth: '320px',
        border: '2px solid #0ff',
        boxShadow: '0 0 40px rgba(0, 255, 255, 0.3)'
      }}>
        <h2 style={{
          fontSize: '28px',
          color: '#0ff',
          textAlign: 'center',
          marginBottom: '20px',
          textShadow: '0 0 10px #0ff'
        }}>
          本轮结束
        </h2>

        <div style={{ marginBottom: '20px' }}>
          {sorted.map((player, index) => (
            <div
              key={player.id || index}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px',
                marginBottom: '8px',
                backgroundColor: index === 0 ? '#2d2d4a' : '#1a1a2e',
                borderRadius: '8px',
                border: index === 0 ? '2px solid #ff0' : 'none'
              }}
            >
              <span style={{
                fontSize: index === 0 ? '24px' : '18px',
                fontWeight: 'bold',
                color: index === 0 ? '#ff0' : '#fff'
              }}>
                #{index + 1}
              </span>
              <span style={{
                fontSize: '16px',
                color: '#fff',
                flex: 1,
                marginLeft: '15px'
              }}>
                {player.name}
              </span>
              <span style={{
                fontSize: '18px',
                fontWeight: 'bold',
                color: '#0ff'
              }}>
                {player.score}分
              </span>
            </div>
          ))}
        </div>

        <p style={{
          textAlign: 'center',
          color: '#888',
          fontSize: '14px'
        }}>
          下一轮开始: <span style={{ color: '#f0f', fontWeight: 'bold' }}>{nextRoundTime}秒</span>
        </p>
      </div>
    </div>
  );
};

export default ResultsModal;
