export type ElementType = 'cat' | 'dog' | 'rabbit' | 'bear' | 'panda';

export type GameStatus = 'idle' | 'playing' | 'won' | 'lost';

export type AnimationPhase = 'idle' | 'swapping' | 'matching' | 'removing' | 'falling';

export interface CellContent {
  id: string;
  type: ElementType;
}

export interface Target {
  type: ElementType;
  count: number;
}

export interface LevelConfig {
  id: number;
  targets: Target[];
  moves: number;
}

export interface GameState {
  board: (CellContent | null)[][];  // 10x10 棋盘，null 表示空位
  level: number;                       // 当前关卡编号
  moves: number;                      // 剩余步数
  score: number;                       // 累计分数
  targets: Target[];                   // 当前关卡目标
  progress: Record<ElementType, number>; // 各元素已消除数量
  gameStatus: GameStatus;             // 游戏状态
  selectedCell: [number, number] | null;
  animationPhase: AnimationPhase;
  matchingCells: Position[];
}

export type GameAction =
  | { type: 'SELECT_CELL'; row: number; col: number }
  | { type: 'SWAP_ELEMENTS'; pos1: Position; pos2: Position }
  | { type: 'START_LEVEL'; level: number }
  | { type: 'RESET_GAME' }
  | { type: 'SET_MATCHING'; cells: Position[] }
  | { type: 'REMOVE_MATCHES' }
  | { type: 'FILL_AND_CASCADE' };

export interface Position {
  row: number;
  col: number;
}
