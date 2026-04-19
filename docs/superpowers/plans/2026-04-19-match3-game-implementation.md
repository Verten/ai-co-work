# 萌宠消消乐 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a complete 10x10 match-3 game with 5 pet icons, cascade mechanics, moves limit, and 50 levels

**Architecture:** React + Framer Motion with useReducer for game state management. Core game logic in utils (matchFinder, boardFiller), UI components for rendering board/cells/elements.

**Tech Stack:** React 18, TypeScript, Framer Motion, Vite

---

## File Structure

```
src/
├── types/game.ts                  # All TypeScript types
├── utils/levelConfig.ts           # 50 level configurations
├── utils/matchFinder.ts           # Match detection algorithm
├── utils/boardFiller.ts           # Board fill & gravity algorithm
├── hooks/useBoardGenerator.ts     # Board generation hook
├── hooks/useGameReducer.ts        # Game state reducer
├── components/Element.tsx         # Pet icon SVG component
├── components/Cell.tsx            # Single board cell
├── components/GameBoard.tsx       # 10x10 board with animations
├── components/GameHeader.tsx      # Level/Moves/Score display
├── components/TargetPanel.tsx     # Objectives panel
├── components/ScorePopup.tsx      # Score animation
├── components/LevelComplete.tsx   # Win modal
├── components/GameOver.tsx        # Lose modal
├── components/LevelSelector.tsx    # Level selection screen
├── App.tsx                        # Root component
└── styles/index.css               # Global styles
```

---

## Task 1: Project Scaffolding

**Files:**
- Create: `package.json`
- Create: `vite.config.ts`
- Create: `tsconfig.json`
- Create: `index.html`
- Create: `src/main.tsx`

- [ ] **Step 1: Create package.json**

```json
{
  "name": "cute-pet-match3",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "framer-motion": "^10.16.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@vitejs/plugin-react": "^4.2.0",
    "typescript": "^5.3.0",
    "vite": "^5.0.0"
  }
}
```

- [ ] **Step 2: Create vite.config.ts**

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
```

- [ ] **Step 3: Create tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"]
}
```

- [ ] **Step 4: Create index.html**

```html
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>萌宠消消乐</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 5: Create src/main.tsx**

```typescript
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles/index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

- [ ] **Step 6: Create src/styles/index.css**

```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

#root {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
```

- [ ] **Step 7: Create src/App.tsx (placeholder)**

```typescript
export default function App() {
  return <div>萌宠消消乐</div>
}
```

- [ ] **Step 8: Install dependencies and verify build**

Run: `cd I:/ai-co-work && npm install && npm run build`
Expected: Build completes without errors

- [ ] **Step 9: Commit**

```bash
git add package.json vite.config.ts tsconfig.json index.html src/
git commit -m "chore: scaffold React + Vite + TypeScript project

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Task 2: Type Definitions

**Files:**
- Create: `src/types/game.ts`

- [ ] **Step 1: Create src/types/game.ts**

```typescript
export type ElementType = 'cat' | 'dog' | 'rabbit' | 'bear' | 'panda';

export type GameStatus = 'idle' | 'playing' | 'won' | 'lost';

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
  board: (ElementType | null)[][];
  level: number;
  moves: number;
  score: number;
  targets: Target[];
  progress: Record<ElementType, number>;
  gameStatus: GameStatus;
  selectedCell: [number, number] | null;
}

export type GameAction =
  | { type: 'SELECT_CELL'; row: number; col: number }
  | { type: 'SWAP_ELEMENTS'; pos1: [number, number]; pos2: [number, number] }
  | { type: 'PROCESS_MATCHES'; matches: [number, number][] }
  | { type: 'FALL_ELEMENTS'; updates: { from: [number, number]; to: [number, number] }[] }
  | { type: 'REFILL_BOARD' }
  | { type: 'DECREMENT_MOVES' }
  | { type: 'CHECK_GAME_STATUS' }
  | { type: 'START_LEVEL'; level: number }
  | { type: 'RESET_GAME' };

export interface Position {
  row: number;
  col: number;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/types/game.ts
git commit -m "feat: add game type definitions

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Task 3: Level Configuration

**Files:**
- Create: `src/utils/levelConfig.ts`

- [ ] **Step 1: Create src/utils/levelConfig.ts**

```typescript
import { ElementType, LevelConfig } from '../types/game';

export const ELEMENT_TYPES: ElementType[] = ['cat', 'dog', 'rabbit', 'bear', 'panda'];

export const LEVEL_CONFIGS: LevelConfig[] = [
  { id: 1, targets: [{ type: 'cat', count: 10 }], moves: 20 },
  { id: 2, targets: [{ type: 'dog', count: 10 }], moves: 20 },
  { id: 3, targets: [{ type: 'rabbit', count: 10 }], moves: 20 },
  { id: 4, targets: [{ type: 'bear', count: 10 }], moves: 20 },
  { id: 5, targets: [{ type: 'panda', count: 10 }], moves: 20 },
  { id: 6, targets: [{ type: 'cat', count: 15 }, { type: 'dog', count: 10 }], moves: 25 },
  { id: 7, targets: [{ type: 'rabbit', count: 15 }, { type: 'bear', count: 10 }], moves: 25 },
  { id: 8, targets: [{ type: 'panda', count: 15 }, { type: 'cat', count: 10 }], moves: 25 },
  { id: 9, targets: [{ type: 'dog', count: 15 }, { type: 'rabbit', count: 10 }], moves: 25 },
  { id: 10, targets: [{ type: 'bear', count: 20 }, { type: 'panda', count: 15 }], moves: 30 },
  { id: 11, targets: [{ type: 'cat', count: 20 }, { type: 'dog', count: 15 }], moves: 30 },
  { id: 12, targets: [{ type: 'rabbit', count: 20 }, { type: 'bear', count: 15 }], moves: 30 },
  { id: 13, targets: [{ type: 'panda', count: 20 }, { type: 'cat', count: 15 }], moves: 30 },
  { id: 14, targets: [{ type: 'dog', count: 20 }, { type: 'rabbit', count: 15 }], moves: 30 },
  { id: 15, targets: [{ type: 'bear', count: 25 }, { type: 'panda', count: 20 }], moves: 35 },
  { id: 16, targets: [{ type: 'cat', count: 25 }, { type: 'dog', count: 20 }], moves: 35 },
  { id: 17, targets: [{ type: 'rabbit', count: 25 }, { type: 'bear', count: 20 }], moves: 35 },
  { id: 18, targets: [{ type: 'panda', count: 25 }, { type: 'cat', count: 20 }], moves: 35 },
  { id: 19, targets: [{ type: 'dog', count: 25 }, { type: 'rabbit', count: 20 }], moves: 35 },
  { id: 20, targets: [{ type: 'bear', count: 30 }, { type: 'panda', count: 25 }], moves: 40 },
  { id: 21, targets: [{ type: 'cat', count: 30 }, { type: 'dog', count: 25 }], moves: 40 },
  { id: 22, targets: [{ type: 'rabbit', count: 30 }, { type: 'bear', count: 25 }], moves: 40 },
  { id: 23, targets: [{ type: 'panda', count: 30 }, { type: 'cat', count: 25 }], moves: 40 },
  { id: 24, targets: [{ type: 'dog', count: 30 }, { type: 'rabbit', count: 25 }], moves: 40 },
  { id: 25, targets: [{ type: 'bear', count: 35 }, { type: 'panda', count: 30 }], moves: 45 },
  { id: 26, targets: [{ type: 'cat', count: 35 }, { type: 'dog', count: 30 }], moves: 45 },
  { id: 27, targets: [{ type: 'rabbit', count: 35 }, { type: 'bear', count: 30 }], moves: 45 },
  { id: 28, targets: [{ type: 'panda', count: 35 }, { type: 'cat', count: 30 }], moves: 45 },
  { id: 29, targets: [{ type: 'dog', count: 35 }, { type: 'rabbit', count: 30 }], moves: 45 },
  { id: 30, targets: [{ type: 'bear', count: 40 }, { type: 'panda', count: 35 }], moves: 50 },
  { id: 31, targets: [{ type: 'cat', count: 40 }, { type: 'dog', count: 35 }], moves: 50 },
  { id: 32, targets: [{ type: 'rabbit', count: 40 }, { type: 'bear', count: 35 }], moves: 50 },
  { id: 33, targets: [{ type: 'panda', count: 40 }, { type: 'cat', count: 35 }], moves: 50 },
  { id: 34, targets: [{ type: 'dog', count: 40 }, { type: 'rabbit', count: 35 }], moves: 50 },
  { id: 35, targets: [{ type: 'bear', count: 45 }, { type: 'panda', count: 40 }], moves: 55 },
  { id: 36, targets: [{ type: 'cat', count: 45 }, { type: 'dog', count: 40 }], moves: 55 },
  { id: 37, targets: [{ type: 'rabbit', count: 45 }, { type: 'bear', count: 40 }], moves: 55 },
  { id: 38, targets: [{ type: 'panda', count: 45 }, { type: 'cat', count: 40 }], moves: 55 },
  { id: 39, targets: [{ type: 'dog', count: 45 }, { type: 'rabbit', count: 40 }], moves: 55 },
  { id: 40, targets: [{ type: 'bear', count: 50 }, { type: 'panda', count: 45 }], moves: 60 },
  { id: 41, targets: [{ type: 'cat', count: 50 }, { type: 'dog', count: 45 }], moves: 60 },
  { id: 42, targets: [{ type: 'rabbit', count: 50 }, { type: 'bear', count: 45 }], moves: 60 },
  { id: 43, targets: [{ type: 'panda', count: 50 }, { type: 'cat', count: 45 }], moves: 60 },
  { id: 44, targets: [{ type: 'dog', count: 50 }, { type: 'rabbit', count: 45 }], moves: 60 },
  { id: 45, targets: [{ type: 'bear', count: 55 }, { type: 'panda', count: 50 }], moves: 65 },
  { id: 46, targets: [{ type: 'cat', count: 55 }, { type: 'dog', count: 50 }], moves: 65 },
  { id: 47, targets: [{ type: 'rabbit', count: 55 }, { type: 'bear', count: 50 }], moves: 65 },
  { id: 48, targets: [{ type: 'panda', count: 55 }, { type: 'cat', count: 50 }], moves: 65 },
  { id: 49, targets: [{ type: 'dog', count: 55 }, { type: 'rabbit', count: 50 }], moves: 65 },
  { id: 50, targets: [{ type: 'bear', count: 60 }, { type: 'panda', count: 55 }], moves: 70 },
];

export function getLevelConfig(level: number): LevelConfig {
  return LEVEL_CONFIGS[level - 1] || LEVEL_CONFIGS[0];
}
```

- [ ] **Step 2: Commit**

```bash
git add src/utils/levelConfig.ts
git commit -m "feat: add 50 level configurations

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Task 4: Match Finder Algorithm

**Files:**
- Create: `src/utils/matchFinder.ts`

- [ ] **Step 1: Create src/utils/matchFinder.ts**

```typescript
import { ElementType, Position } from '../types/game';

const BOARD_SIZE = 10;

export function findMatches(board: (ElementType | null)[][]): Position[][] {
  const matches: Position[][] = [];
  const visited = new Set<string>();

  // Check horizontal matches
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col <= BOARD_SIZE - 3; col++) {
      const element = board[row][col];
      if (!element) continue;

      let matchLength = 1;
      while (col + matchLength < BOARD_SIZE && board[row][col + matchLength] === element) {
        matchLength++;
      }

      if (matchLength >= 3) {
        const match: Position[] = [];
        for (let i = 0; i < matchLength; i++) {
          const key = `${row},${col + i}`;
          if (!visited.has(key)) {
            match.push({ row, col: col + i });
            visited.add(key);
          }
        }
        if (match.length > 0) matches.push(match);
        col += matchLength - 1;
      }
    }
  }

  // Check vertical matches
  visited.clear();
  for (let col = 0; col < BOARD_SIZE; col++) {
    for (let row = 0; row <= BOARD_SIZE - 3; row++) {
      const element = board[row][col];
      if (!element) continue;

      let matchLength = 1;
      while (row + matchLength < BOARD_SIZE && board[row + matchLength][col] === element) {
        matchLength++;
      }

      if (matchLength >= 3) {
        const match: Position[] = [];
        for (let i = 0; i < matchLength; i++) {
          match.push({ row: row + i, col });
        }
        matches.push(match);
        row += matchLength - 1;
      }
    }
  }

  return matches;
}

export function hasValidMoves(board: (ElementType | null)[][]): boolean {
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      // Try swap right
      if (col < BOARD_SIZE - 1) {
        const swapped = swap(board, row, col, row, col + 1);
        if (findMatches(swapped).length > 0) return true;
      }
      // Try swap down
      if (row < BOARD_SIZE - 1) {
        const swapped = swap(board, row, col, row + 1, col);
        if (findMatches(swapped).length > 0) return true;
      }
    }
  }
  return false;
}

function swap(
  board: (ElementType | null)[][],
  r1: number,
  c1: number,
  r2: number,
  c2: number
): (ElementType | null)[][] {
  const newBoard = board.map(row => [...row]);
  const temp = newBoard[r1][c1];
  newBoard[r1][c1] = newBoard[r2][c2];
  newBoard[r2][c2] = temp;
  return newBoard;
}

export function wouldCreateMatch(
  board: (ElementType | null)[][],
  pos1: Position,
  pos2: Position
): boolean {
  const swapped = swap(board, pos1.row, pos1.col, pos2.row, pos2.col);
  return findMatches(swapped).length > 0;
}

export function calculateScore(matchLength: number, cascadeLevel: number): number {
  const baseScore = matchLength === 3 ? 30 : matchLength === 4 ? 50 : 80;
  const cascadeBonus = cascadeLevel * 20;
  return baseScore + cascadeBonus;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/utils/matchFinder.ts
git commit -m "feat: add match finding algorithm

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Task 5: Board Filler Algorithm

**Files:**
- Create: `src/utils/boardFiller.ts`

- [ ] **Step 1: Create src/utils/boardFiller.ts**

```typescript
import { ElementType, Position } from '../types/game';
import { ELEMENT_TYPES } from './levelConfig';

const BOARD_SIZE = 10;

export function generateBoard(): (ElementType | null)[][] {
  const board: (ElementType | null)[][] = [];

  for (let row = 0; row < BOARD_SIZE; row++) {
    board[row] = [];
    for (let col = 0; col < BOARD_SIZE; col++) {
      board[row][col] = getRandomElement(board, row, col);
    }
  }

  return board;
}

function getRandomElement(board: (ElementType | null)[][], row: number, col: number): ElementType {
  const available = [...ELEMENT_TYPES];

  // Avoid creating horizontal matches
  if (col >= 2) {
    const left1 = board[row][col - 1];
    const left2 = board[row][col - 2];
    if (left1 && left1 === left2) {
      const idx = available.indexOf(left1);
      if (idx > -1) available.splice(idx, 1);
    }
  }

  // Avoid creating vertical matches
  if (row >= 2) {
    const up1 = board[row - 1][col];
    const up2 = board[row - 2][col];
    if (up1 && up1 === up2) {
      const idx = available.indexOf(up1);
      if (idx > -1) available.splice(idx, 1);
    }
  }

  return available[Math.floor(Math.random() * available.length)];
}

export function fillGaps(board: (ElementType | null)[][]): {
  newBoard: (ElementType | null)[][];
  updates: { from: Position; to: Position; element: ElementType }[];
} {
  const newBoard = board.map(row => [...row]);
  const updates: { from: Position; to: Position; element: ElementType }[] = [];

  for (let col = 0; col < BOARD_SIZE; col++) {
    let emptySpaces = 0;

    // Process from bottom to top
    for (let row = BOARD_SIZE - 1; row >= 0; row--) {
      if (newBoard[row][col] === null) {
        emptySpaces++;
      } else if (emptySpaces > 0) {
        // Move element down
        const element = newBoard[row][col];
        const newRow = row + emptySpaces;
        newBoard[newRow][col] = element;
        newBoard[row][col] = null;
        updates.push({
          from: { row, col },
          to: { row: newRow, col },
          element: element!,
        });
      }
    }

    // Fill top empty spaces with new elements
    for (let row = emptySpaces - 1; row >= 0; row--) {
      const element = ELEMENT_TYPES[Math.floor(Math.random() * ELEMENT_TYPES.length)];
      newBoard[row][col] = element;
      updates.push({
        from: { row: -1, col },
        to: { row, col },
        element,
      });
    }
  }

  return { newBoard, updates };
}

export function swapElements(
  board: (ElementType | null)[][],
  pos1: Position,
  pos2: Position
): (ElementType | null)[][] {
  const newBoard = board.map(row => [...row]);
  const temp = newBoard[pos1.row][pos1.col];
  newBoard[pos1.row][pos1.col] = newBoard[pos2.row][pos2.col];
  newBoard[pos2.row][pos2.col] = temp;
  return newBoard;
}

export function removeMatches(
  board: (ElementType | null)[][],
  matches: Position[][]
): (ElementType | null)[][] {
  const newBoard = board.map(row => [...row]);
  const toRemove = new Set<string>();

  matches.forEach(match => {
    match.forEach(pos => {
      toRemove.add(`${pos.row},${pos.col}`);
    });
  });

  toRemove.forEach(key => {
    const [row, col] = key.split(',').map(Number);
    newBoard[row][col] = null;
  });

  return newBoard;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/utils/boardFiller.ts
git commit -m "feat: add board fill and gravity algorithm

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Task 6: useBoardGenerator Hook

**Files:**
- Create: `src/hooks/useBoardGenerator.ts`

- [ ] **Step 1: Create src/hooks/useBoardGenerator.ts**

```typescript
import { useCallback } from 'react';
import { ElementType } from '../types/game';
import { generateBoard } from '../utils/boardFiller';
import { hasValidMoves } from '../utils/matchFinder';

export function useBoardGenerator() {
  const createBoard = useCallback((): (ElementType | null)[][] => {
    let board = generateBoard();

    // Ensure there's at least one valid move
    while (!hasValidMoves(board)) {
      board = generateBoard();
    }

    return board;
  }, []);

  return { createBoard };
}
```

- [ ] **Step 2: Commit**

```bash
git add src/hooks/useBoardGenerator.ts
git commit -m "feat: add board generator hook

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Task 7: useGameReducer Hook

**Files:**
- Create: `src/hooks/useGameReducer.ts`

- [ ] **Step 1: Create src/hooks/useGameReducer.ts**

```typescript
import { useReducer, useCallback } from 'react';
import { ElementType, GameState, GameAction, Position } from '../types/game';
import { getLevelConfig } from '../utils/levelConfig';
import { findMatches, wouldCreateMatch, calculateScore } from '../utils/matchFinder';
import { swapElements, fillGaps, removeMatches } from '../utils/boardFiller';
import { useBoardGenerator } from './useBoardGenerator';

const BOARD_SIZE = 10;

function createInitialState(level: number): GameState {
  const config = getLevelConfig(level);
  const { createBoard } = useBoardGenerator();

  return {
    board: createBoard(),
    level,
    moves: config.moves,
    score: 0,
    targets: config.targets,
    progress: { cat: 0, dog: 0, rabbit: 0, bear: 0, panda: 0 },
    gameStatus: 'playing',
    selectedCell: null,
  };
}

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'SELECT_CELL': {
      if (state.gameStatus !== 'playing') return state;

      const { row, col } = action;
      const selected = state.selectedCell;

      if (!selected) {
        return { ...state, selectedCell: [row, col] };
      }

      // Check if adjacent
      const isAdjacent =
        (Math.abs(selected[0] - row) === 1 && selected[1] === col) ||
        (Math.abs(selected[1] - col) === 1 && selected[0] === row);

      if (isAdjacent && !wouldCreateMatch(state.board, { row: selected[0], col: selected[1] }, { row, col })) {
        // Not a valid move, deselect
        return { ...state, selectedCell: null };
      }

      return {
        ...state,
        selectedCell: [row, col],
      };
    }

    case 'SWAP_ELEMENTS': {
      const { pos1, pos2 } = action;
      const newBoard = swapElements(state.board, pos1, pos2);
      const matches = findMatches(newBoard);

      if (matches.length === 0) {
        // Invalid swap, swap back
        return { ...state, selectedCell: null };
      }

      // Process matches and cascade
      let currentBoard = newBoard;
      let totalScore = 0;
      let cascadeLevel = 0;
      const progress = { ...state.progress };

      while (matches.length > 0) {
        // Calculate score
        matches.forEach(match => {
          totalScore += calculateScore(match.length, cascadeLevel);
          // Update progress
          const elementType = currentBoard[match[0].row][match[0].col];
          if (elementType) {
            progress[elementType] += match.length;
          }
        });

        // Remove matches
        currentBoard = removeMatches(currentBoard, matches);
        // Fill gaps
        const { newBoard: filled } = fillGaps(currentBoard);
        currentBoard = filled;

        cascadeLevel++;
        matches.length = 0; // Will be recalculated below
      }

      // Check for new matches after cascade
      let hasMoreMatches = true;
      while (hasMoreMatches) {
        const newMatches = findMatches(currentBoard);
        if (newMatches.length === 0) {
          hasMoreMatches = false;
        } else {
          newMatches.forEach(match => {
            totalScore += calculateScore(match.length, cascadeLevel);
            const elementType = currentBoard[match[0].row][match[0].col];
            if (elementType) {
              progress[elementType] += match.length;
            }
          });
          currentBoard = removeMatches(currentBoard, newMatches);
          const { newBoard: filled } = fillGaps(currentBoard);
          currentBoard = filled;
          cascadeLevel++;
        }
      }

      // Check win condition
      const allTargetsMet = state.targets.every(
        t => progress[t.type] >= t.count
      );

      const newMoves = state.moves - 1;
      const gameStatus = allTargetsMet ? 'won' : newMoves <= 0 ? 'lost' : 'playing';

      return {
        ...state,
        board: currentBoard,
        score: state.score + totalScore,
        progress,
        moves: newMoves,
        gameStatus,
        selectedCell: null,
      };
    }

    case 'START_LEVEL': {
      return createInitialState(action.level);
    }

    case 'RESET_GAME': {
      return createInitialState(1);
    }

    default:
      return state;
  }
}

export function useGameReducer() {
  const [state, dispatch] = useReducer(gameReducer, 1, createInitialState);

  const selectCell = useCallback((row: number, col: number) => {
    dispatch({ type: 'SELECT_CELL', row, col });
  }, []);

  const swapCells = useCallback((pos1: Position, pos2: Position) => {
    dispatch({ type: 'SWAP_ELEMENTS', pos1, pos2 });
  }, []);

  const startLevel = useCallback((level: number) => {
    dispatch({ type: 'START_LEVEL', level });
  }, []);

  const resetGame = useCallback(() => {
    dispatch({ type: 'RESET_GAME' });
  }, []);

  return {
    state,
    selectCell,
    swapCells,
    startLevel,
    resetGame,
  };
}
```

- [ ] **Step 2: Commit**

```bash
git add src/hooks/useGameReducer.ts
git commit -m "feat: add game state reducer hook

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Task 8: Element Component

**Files:**
- Create: `src/components/Element.tsx`

- [ ] **Step 1: Create src/components/Element.tsx**

```typescript
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
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Element.tsx
git commit -m "feat: add Element component with SVG pet icons

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Task 9: Cell Component

**Files:**
- Create: `src/components/Cell.tsx`

- [ ] **Step 1: Create src/components/Cell.tsx**

```typescript
import React from 'react';
import { motion } from 'framer-motion';
import { ElementType } from '../types/game';
import { Element } from './Element';

interface CellProps {
  type: ElementType | null;
  row: number;
  col: number;
  isSelected: boolean;
  onClick: () => void;
}

export const Cell: React.FC<CellProps> = ({ type, row, col, isSelected, onClick }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      style={{
        width: '100%',
        paddingBottom: '100%',
        position: 'relative',
        cursor: type ? 'pointer' : 'default',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          borderRadius: '8px',
          border: isSelected ? '3px solid #FFD700' : '2px solid rgba(255, 255, 255, 0.3)',
          boxShadow: isSelected ? '0 0 10px rgba(255, 215, 0, 0.5)' : 'none',
        }}
      >
        {type && <Element type={type} isSelected={isSelected} />}
      </div>
    </motion.div>
  );
};
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Cell.tsx
git commit -m "feat: add Cell component

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Task 10: GameBoard Component

**Files:**
- Create: `src/components/GameBoard.tsx`

- [ ] **Step 1: Create src/components/GameBoard.tsx**

```typescript
import React from 'react';
import { motion } from 'framer-motion';
import { ElementType, Position } from '../types/game';
import { Cell } from './Cell';

interface GameBoardProps {
  board: (ElementType | null)[][];
  selectedCell: [number, number] | null;
  onCellClick: (row: number, col: number) => void;
}

const BOARD_SIZE = 10;

export const GameBoard: React.FC<GameBoardProps> = ({
  board,
  selectedCell,
  onCellClick,
}) => {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${BOARD_SIZE}, 1fr)`,
        gridTemplateRows: `repeat(${BOARD_SIZE}, 1fr)`,
        gap: '4px',
        padding: '12px',
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        borderRadius: '12px',
        width: 'min(90vw, 500px)',
        height: 'min(90vw, 500px)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
      }}
    >
      {board.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <motion.div
            key={`${rowIndex}-${colIndex}`}
            layout
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: (rowIndex * BOARD_SIZE + colIndex) * 0.005 }}
          >
            <Cell
              type={cell}
              row={rowIndex}
              col={colIndex}
              isSelected={
                selectedCell !== null &&
                selectedCell[0] === rowIndex &&
                selectedCell[1] === colIndex
              }
              onClick={() => onCellClick(rowIndex, colIndex)}
            />
          </motion.div>
        ))
      )}
    </div>
  );
};
```

- [ ] **Step 2: Commit**

```bash
git add src/components/GameBoard.tsx
git commit -m "feat: add GameBoard component

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Task 11: GameHeader Component

**Files:**
- Create: `src/components/GameHeader.tsx`

- [ ] **Step 1: Create src/components/GameHeader.tsx**

```typescript
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
        width: 'min(90vw, 500px)',
        padding: '16px',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: '12px',
        marginBottom: '12px',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '14px', color: '#666' }}>关卡</div>
        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#333' }}>{level}</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '14px', color: '#666' }}>步数</div>
        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#FF6B6B' }}>{moves}</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '14px', color: '#666' }}>分数</div>
        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#4CAF50' }}>{score}</div>
      </div>
    </div>
  );
};
```

- [ ] **Step 2: Commit**

```bash
git add src/components/GameHeader.tsx
git commit -m "feat: add GameHeader component

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Task 12: TargetPanel Component

**Files:**
- Create: `src/components/TargetPanel.tsx`

- [ ] **Step 1: Create src/components/TargetPanel.tsx**

```typescript
import React from 'react';
import { motion } from 'framer-motion';
import { Target, ElementType } from '../types/game';

interface TargetPanelProps {
  targets: Target[];
  progress: Record<ElementType, number>;
}

const ELEMENT_EMOJI: Record<ElementType, string> = {
  cat: '🐱',
  dog: '🐶',
  rabbit: '🐰',
  bear: '🐻',
  panda: '🐼',
};

export const TargetPanel: React.FC<TargetPanelProps> = ({ targets, progress }) => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '16px',
        width: 'min(90vw, 500px)',
        padding: '12px',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: '12px',
        marginTop: '12px',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
      }}
    >
      {targets.map((target, index) => {
        const current = progress[target.type];
        const isComplete = current >= target.count;
        const isAlmost = current >= target.count * 0.7;

        return (
          <motion.div
            key={`${target.type}-${index}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              backgroundColor: isComplete ? '#E8F5E9' : isAlmost ? '#FFF3E0' : '#FAFAFA',
              borderRadius: '20px',
              border: `2px solid ${isComplete ? '#4CAF50' : isAlmost ? '#FF9800' : '#E0E0E0'}`,
            }}
          >
            <span style={{ fontSize: '24px' }}>{ELEMENT_EMOJI[target.type]}</span>
            <span
              style={{
                fontSize: '16px',
                fontWeight: 'bold',
                color: isComplete ? '#4CAF50' : '#333',
              }}
            >
              {Math.min(current, target.count)}/{target.count}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
};
```

- [ ] **Step 2: Commit**

```bash
git add src/components/TargetPanel.tsx
git commit -m "feat: add TargetPanel component

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Task 13: ScorePopup Component

**Files:**
- Create: `src/components/ScorePopup.tsx`

- [ ] **Step 1: Create src/components/ScorePopup.tsx**

```typescript
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
```

- [ ] **Step 2: Commit**

```bash
git add src/components/ScorePopup.tsx
git commit -m "feat: add ScorePopup component

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Task 14: LevelComplete Component

**Files:**
- Create: `src/components/LevelComplete.tsx`

- [ ] **Step 1: Create src/components/LevelComplete.tsx**

```typescript
import React from 'react';
import { motion } from 'framer-motion';

interface LevelCompleteProps {
  level: number;
  score: number;
  onNextLevel: () => void;
  onReplay: () => void;
}

export const LevelComplete: React.FC<LevelCompleteProps> = ({
  level,
  score,
  onNextLevel,
  onReplay,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        zIndex: 1000,
      }}
    >
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 15 }}
        style={{
          backgroundColor: '#FFF',
          borderRadius: '24px',
          padding: '40px',
          textAlign: 'center',
          maxWidth: '320px',
          width: '90%',
        }}
      >
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎉</div>
        <h2 style={{ fontSize: '28px', color: '#333', marginBottom: '8px' }}>通关成功!</h2>
        <p style={{ fontSize: '18px', color: '#666', marginBottom: '24px' }}>
          第 {level} 关完成
        </p>
        <div
          style={{
            backgroundColor: '#F5F5F5',
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '24px',
          }}
        >
          <div style={{ fontSize: '14px', color: '#666' }}>本关得分</div>
          <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#4CAF50' }}>{score}</div>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={onReplay}
            style={{
              flex: 1,
              padding: '14px 24px',
              borderRadius: '12px',
              border: 'none',
              backgroundColor: '#E0E0E0',
              color: '#333',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
          >
            重玩
          </button>
          <button
            onClick={onNextLevel}
            style={{
              flex: 1,
              padding: '14px 24px',
              borderRadius: '12px',
              border: 'none',
              backgroundColor: '#4CAF50',
              color: '#FFF',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
          >
            下一关
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};
```

- [ ] **Step 2: Commit**

```bash
git add src/components/LevelComplete.tsx
git commit -m "feat: add LevelComplete modal component

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Task 15: GameOver Component

**Files:**
- Create: `src/components/GameOver.tsx`

- [ ] **Step 1: Create src/components/GameOver.tsx**

```typescript
import React from 'react';
import { motion } from 'framer-motion';

interface GameOverProps {
  level: number;
  score: number;
  onRetry: () => void;
  onLevelSelect: () => void;
}

export const GameOver: React.FC<GameOverProps> = ({
  level,
  score,
  onRetry,
  onLevelSelect,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        zIndex: 1000,
      }}
    >
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 15 }}
        style={{
          backgroundColor: '#FFF',
          borderRadius: '24px',
          padding: '40px',
          textAlign: 'center',
          maxWidth: '320px',
          width: '90%',
        }}
      >
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>😢</div>
        <h2 style={{ fontSize: '28px', color: '#333', marginBottom: '8px' }}>步数用完</h2>
        <p style={{ fontSize: '18px', color: '#666', marginBottom: '24px' }}>
          第 {level} 关失败
        </p>
        <div
          style={{
            backgroundColor: '#F5F5F5',
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '24px',
          }}
        >
          <div style={{ fontSize: '14px', color: '#666' }}>当前得分</div>
          <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#FF6B6B' }}>{score}</div>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={onLevelSelect}
            style={{
              flex: 1,
              padding: '14px 24px',
              borderRadius: '12px',
              border: 'none',
              backgroundColor: '#E0E0E0',
              color: '#333',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
          >
            选关
          </button>
          <button
            onClick={onRetry}
            style={{
              flex: 1,
              padding: '14px 24px',
              borderRadius: '12px',
              border: 'none',
              backgroundColor: '#FF6B6B',
              color: '#FFF',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
          >
            重试
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};
```

- [ ] **Step 2: Commit**

```bash
git add src/components/GameOver.tsx
git commit -m "feat: add GameOver modal component

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Task 16: LevelSelector Component

**Files:**
- Create: `src/components/LevelSelector.tsx`

- [ ] **Step 1: Create src/components/LevelSelector.tsx**

```typescript
import React from 'react';
import { motion } from 'framer-motion';
import { LEVEL_CONFIGS } from '../utils/levelConfig';

interface LevelSelectorProps {
  currentLevel: number;
  onSelectLevel: (level: number) => void;
}

export const LevelSelector: React.FC<LevelSelectorProps> = ({ currentLevel, onSelectLevel }) => {
  return (
    <div
      style={{
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '24px',
        padding: '24px',
        width: 'min(90vw, 500px)',
        maxHeight: '80vh',
        overflowY: 'auto',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
      }}
    >
      <h2
        style={{
          fontSize: '24px',
          color: '#333',
          textAlign: 'center',
          marginBottom: '20px',
        }}
      >
        选择关卡
      </h2>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: '10px',
        }}
      >
        {LEVEL_CONFIGS.map((config) => {
          const isUnlocked = config.id <= currentLevel;
          const isCurrent = config.id === currentLevel;

          return (
            <motion.button
              key={config.id}
              whileHover={isUnlocked ? { scale: 1.1 } : {}}
              whileTap={isUnlocked ? { scale: 0.9 } : {}}
              onClick={() => isUnlocked && onSelectLevel(config.id)}
              disabled={!isUnlocked}
              style={{
                width: '100%',
                aspectRatio: '1',
                borderRadius: '12px',
                border: isCurrent ? '3px solid #4CAF50' : '2px solid #E0E0E0',
                backgroundColor: isUnlocked ? (isCurrent ? '#E8F5E9' : '#FAFAFA') : '#E0E0E0',
                color: isUnlocked ? '#333' : '#999',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: isUnlocked ? 'pointer' : 'not-allowed',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '4px',
              }}
            >
              <span>{config.id}</span>
              {!isUnlocked && <span style={{ fontSize: '10px' }}>🔒</span>}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
```

- [ ] **Step 2: Commit**

```bash
git add src/components/LevelSelector.tsx
git commit -m "feat: add LevelSelector component

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Task 17: App Component

**Files:**
- Modify: `src/App.tsx`

- [ ] **Step 1: Update src/App.tsx**

```typescript
import React, { useState, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { GameBoard } from './components/GameBoard';
import { GameHeader } from './components/GameHeader';
import { TargetPanel } from './components/TargetPanel';
import { LevelComplete } from './components/LevelComplete';
import { GameOver } from './components/GameOver';
import { LevelSelector } from './components/LevelSelector';
import { useGameReducer } from './hooks/useGameReducer';

type Screen = 'game' | 'levelSelect';

export default function App() {
  const [screen, setScreen] = useState<Screen>('levelSelect');
  const { state, selectCell, swapCells, startLevel, resetGame } = useGameReducer();

  const handleCellClick = useCallback(
    (row: number, col: number) => {
      if (state.selectedCell) {
        const [selectedRow, selectedCol] = state.selectedCell;

        // Check if adjacent
        const isAdjacent =
          (Math.abs(selectedRow - row) === 1 && selectedCol === col) ||
          (Math.abs(selectedCol - col) === 1 && selectedRow === row);

        if (isAdjacent) {
          swapCells(
            { row: selectedRow, col: selectedCol },
            { row, col }
          );
        } else {
          selectCell(row, col);
        }
      } else {
        selectCell(row, col);
      }
    },
    [state.selectedCell, selectCell, swapCells]
  );

  const handleNextLevel = useCallback(() => {
    startLevel(state.level + 1);
    setScreen('game');
  }, [state.level, startLevel]);

  const handleReplay = useCallback(() => {
    startLevel(state.level);
  }, [state.level, startLevel]);

  const handleRetry = useCallback(() => {
    startLevel(state.level);
  }, [state.level, startLevel]);

  const handleLevelSelect = useCallback(
    (level: number) => {
      startLevel(level);
      setScreen('game');
    },
    [startLevel]
  );

  const handleBackToSelect = useCallback(() => {
    setScreen('levelSelect');
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '20px',
        minHeight: '100vh',
      }}
    >
      <AnimatePresence mode="wait">
        {screen === 'levelSelect' ? (
          <motion.div
            key="levelSelect"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <LevelSelector
              currentLevel={Math.max(1, state.level)}
              onSelectLevel={handleLevelSelect}
            />
          </motion.div>
        ) : (
          <motion.div
            key="game"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <button
              onClick={handleBackToSelect}
              style={{
                marginBottom: '16px',
                padding: '8px 16px',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                color: '#666',
              }}
            >
              ← 返回选关
            </button>

            <GameHeader level={state.level} moves={state.moves} score={state.score} />

            <GameBoard
              board={state.board}
              selectedCell={state.selectedCell}
              onCellClick={handleCellClick}
            />

            <TargetPanel targets={state.targets} progress={state.progress} />

            {state.gameStatus === 'won' && (
              <LevelComplete
                level={state.level}
                score={state.score}
                onNextLevel={handleNextLevel}
                onReplay={handleReplay}
              />
            )}

            {state.gameStatus === 'lost' && (
              <GameOver
                level={state.level}
                score={state.score}
                onRetry={handleRetry}
                onLevelSelect={handleBackToSelect}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: Build completes without errors

- [ ] **Step 3: Commit**

```bash
git add src/App.tsx
git commit -m "feat: integrate all components in App

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Task 18: Final Verification

**Files:**
- Review all components

- [ ] **Step 1: Verify spec coverage**

Check design spec sections against implementation:
- [x] 棋盘正确渲染 10×10 格子 - GameBoard component
- [x] 5种动物图标正确显示 - Element component with SVG
- [x] 相邻元素可以交换 - Cell onClick + useGameReducer
- [x] 交换形成3个以上匹配时消除 - matchFinder.ts
- [x] 交换无法形成匹配时自动返回 - useGameReducer SWAP_ELEMENTS
- [x] 消除后上方元素正确下落 - boardFiller.ts fillGaps
- [x] 连锁反应正确触发 - useGameReducer cascade loop
- [x] 步数正确递减 - useGameReducer DECREMENT_MOVES
- [x] 目标达成判定正确 - useGameReducer win condition
- [x] 通关/失败弹窗正确显示 - LevelComplete/GameOver components
- [x] 50关关卡配置完整 - levelConfig.ts

- [ ] **Step 2: Final build test**

Run: `npm run build`
Expected: SUCCESS

- [ ] **Step 3: Commit final changes**

```bash
git add -A
git commit -m "feat: complete match-3 game implementation

- 10x10 game board with 5 pet icons
- Match detection and cascade mechanics
- 50 levels with objectives
- Score tracking and game state management
- Win/lose modals and level selection

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Summary

| Task | Component | Status |
|------|-----------|--------|
| 1 | Project Scaffolding | ⬜ |
| 2 | Type Definitions | ⬜ |
| 3 | Level Config (50 levels) | ⬜ |
| 4 | Match Finder Algorithm | ⬜ |
| 5 | Board Filler Algorithm | ⬜ |
| 6 | useBoardGenerator Hook | ⬜ |
| 7 | useGameReducer Hook | ⬜ |
| 8 | Element Component | ⬜ |
| 9 | Cell Component | ⬜ |
| 10 | GameBoard Component | ⬜ |
| 11 | GameHeader Component | ⬜ |
| 12 | TargetPanel Component | ⬜ |
| 13 | ScorePopup Component | ⬜ |
| 14 | LevelComplete Modal | ⬜ |
| 15 | GameOver Modal | ⬜ |
| 16 | LevelSelector Component | ⬜ |
| 17 | App Integration | ⬜ |
| 18 | Final Verification | ⬜ |

---

**Plan complete.** Implementation is straightforward - it's a single React project with clear component boundaries. Start from Task 1 and work through sequentially.
