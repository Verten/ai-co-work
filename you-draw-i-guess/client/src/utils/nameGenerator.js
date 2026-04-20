const ADJECTIVES = [
  '神秘的', '快乐的', '勇敢的', '温柔的', '聪明的',
  '可爱的', '帅气的', '调皮的', '安静的', '活泼的',
  '慵懒的', '霸气的', '害羞的', '疯狂的', '冷静的'
];

const ANIMALS = [
  '猫', '狗', '兔子', '狐狸', '鹰', '鲸鱼', '熊猫',
  '狮子', '老虎', '海豚', '狼', '熊', '猫头鹰', '鹦鹉',
  '小猫', '小猪', '天鹅', '乌鸦', '燕子', '海马'
];

export const generateName = () => {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const animal = ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
  return `${adj}${animal}`;
};