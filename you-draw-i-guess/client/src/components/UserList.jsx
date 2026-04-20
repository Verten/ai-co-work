import { getAvatar } from '../utils/avatarGenerator';

const UserList = ({ users, currentUserId, isDrawer }) => {
  return (
    <div style={{
      backgroundColor: '#16213e',
      borderRadius: '12px',
      padding: '20px',
      minWidth: '200px'
    }}>
      <h3 style={{
        marginBottom: '15px',
        color: '#0ff',
        fontSize: '16px'
      }}>
        玩家 ({users.length})
      </h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {users.map(user => (
          <li
            key={user.userId || user.socketId}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px',
              marginBottom: '8px',
              backgroundColor: user.socketId === currentUserId ? '#0ff' : '#1a1a2e',
              borderRadius: '8px',
              color: user.socketId === currentUserId ? '#000' : '#fff',
              transition: 'all 0.3s'
            }}
          >
            <img
              src={getAvatar(user.userId)}
              alt={user.name}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                border: '2px solid #f0f'
              }}
            />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 'bold' }}>{user.name}</div>
              {user.isDrawer && (
                <span style={{
                  fontSize: '12px',
                  color: '#ff0',
                  backgroundColor: '#000',
                  padding: '2px 6px',
                  borderRadius: '4px'
                }}>
                  画画中
                </span>
              )}
            </div>
            <span style={{
              color: '#0ff',
              fontWeight: 'bold'
            }}>
              {user.score || 0}分
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
