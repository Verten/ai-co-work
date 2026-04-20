const COLORS = [
  '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7',
  '#dfe6e9', '#fd79a8', '#a29bfe', '#74b9ff', '#a55eea',
  '#fd9644', '#26de81', '#2bcbba', '#eb3b5a', '#fa8231'
];

export const generateAvatar = (userId) => {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');

  const seed = parseInt(userId.substring(0, 8), 16) || 1;

  // 背景色
  ctx.fillStyle = COLORS[seed % COLORS.length];
  ctx.fillRect(0, 0, 64, 64);

  // 圆形
  ctx.fillStyle = COLORS[(seed + 1) % COLORS.length];
  ctx.beginPath();
  ctx.arc(32 + ((seed % 10) - 5), 24 + ((seed % 7) - 3), 10 + (seed % 5), 0, Math.PI * 2);
  ctx.fill();

  // 方块
  ctx.fillStyle = COLORS[(seed + 2) % COLORS.length];
  const x = 12 + ((seed % 8) - 4);
  const y = 36 + ((seed % 6) - 3);
  ctx.fillRect(x, y, 14, 14);

  // 三角形
  ctx.fillStyle = COLORS[(seed + 3) % COLORS.length];
  ctx.beginPath();
  ctx.moveTo(48 + ((seed % 5) - 2), 16 + ((seed % 4) - 2));
  ctx.lineTo(56 + ((seed % 5) - 2), 28 + ((seed % 4) - 2));
  ctx.lineTo(40 + ((seed % 5) - 2), 28 + ((seed % 4) - 2));
  ctx.closePath();
  ctx.fill();

  // 小圆点装饰
  ctx.fillStyle = COLORS[(seed + 4) % COLORS.length];
  ctx.beginPath();
  ctx.arc(20 + ((seed % 3) - 1) * 8, 48 + ((seed % 3) - 1) * 4, 4, 0, Math.PI * 2);
  ctx.fill();

  return canvas.toDataURL('image/png');
};

// 存储已生成的头像，避免重复生成
const avatarCache = new Map();

export const getAvatar = (userId) => {
  if (avatarCache.has(userId)) {
    return avatarCache.get(userId);
  }
  const avatar = generateAvatar(userId);
  avatarCache.set(userId, avatar);
  return avatar;
};