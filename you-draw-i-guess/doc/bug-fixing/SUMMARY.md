# Bug Fixing Summary - You-Draw-I-Guess

## Project Overview
A multiplayer drawing and guessing game built with React (client) and Node.js/Socket.io (server).

---

## Bug Fixes

### 1. Canvas Mouse Coordinate Offset
**File**: `client/src/components/Canvas.jsx:54`

**Problem**: The y-coordinate was incorrectly using `rect.left` instead of `rect.top` when calculating mouse position on canvas.

**Fix**:
```javascript
// Before (incorrect)
y: (e.clientY - rect.left) * scaleY

// After (correct)
y: (e.clientY - rect.top) * scaleY
```

---

### 2. New Players Unable to Join Mid-Game
**File**: `server/index.js:24-40`

**Problem**: When a new player joined during an active game, they didn't receive the current game state (phase, drawer, word), causing the UI to show "waiting for players" even though the game was in progress.

**Fix**: Added logic to send current game state to newly joining players:
```javascript
socket.on('join', (userData) => {
  addPlayer(socket.id, userData);
  io.emit('usersUpdate', { users: getPlayers() });

  if (getPlayers().length >= 2 && getPhase() === 'waiting') {
    startNewRound();
  } else if (getPhase() !== 'waiting') {
    // Player joining mid-game - send current game state
    socket.emit('phaseChange', { phase: getPhase() });
    socket.emit('drawerStatus', { drawer: getDrawer() });
    if (getDrawer() === socket.id) {
      socket.emit('gameStart', { word: getWord(), isDrawer: true });
    }
  }
});
```

---

### 3. Round Restart Timer Too Long
**Files**: `server/index.js:136` and `client/src/App.jsx:27,103`

**Problem**: After a round ends, the 30-second timer before next round felt too long.

**Fix**:
- Server: Changed `30000` to `10000` (milliseconds)
- Client: Changed `nextRoundTime` initial value from `30` to `10`

---

### 4. Game Not Starting After 10-Second Countdown
**File**: `server/index.js:65-76`

**Problem**: When a player disconnected during the 'ended' phase countdown, the phase was incorrectly reset to 'waiting', causing the next round to not start properly.

**Fix**: Added condition to only set phase to 'waiting' when game is actively in progress (drawing or guessing phases):
```javascript
socket.on('disconnect', () => {
  const currentPhase = getPhase();
  if (getPlayers().length < 2 && (currentPhase === 'drawing' || currentPhase === 'guessing')) {
    setPhase('waiting');
  }
});
```

---

### 5. Client Phase Override Issue
**File**: `client/src/App.jsx:93-101,136-146`

**Problem**: The client's countdown timer could set phase to 'waiting' before the server sent the new phase, causing a race condition where UI showed "waiting" even though the game was starting.

**Fix**:
- Modified `phaseChange` handler to only clear results modal for non-ended/non-waiting phases
- Modified the countdown effect to only set 'waiting' if phase is still 'ended' (server hasn't sent new phase yet)

```javascript
socket.on('phaseChange', ({ phase: newPhase }) => {
  setPhase(newPhase);
  if (newPhase !== 'ended' && newPhase !== 'waiting') {
    setShowResults(false);
  }
  // ...
});
```

---

### 6. Guess Timer Firing Prematurely
**File**: `server/index.js`

**Problem**: Multiple timers could accumulate and fire incorrectly, causing the guess phase to end early.

**Fix**: Added timer management with cleanup:
```javascript
let drawingTimer = null;
let guessingTimer = null;

function startNewRound() {
  // Clear any existing timers
  if (drawingTimer) { clearTimeout(drawingTimer); drawingTimer = null; }
  if (guessingTimer) { clearTimeout(guessingTimer); guessingTimer = null; }
  // ...
  drawingTimer = setTimeout(() => { /* ... */ }, 120000);
}
```

Also added guard checks in `endRound` and improved `guess` event validation with detailed logging.

---

### 7. Canvas Not Clearing on New Round
**File**: `server/index.js:94` and `client/src/App.jsx:55-68`

**Problem**: When a new round started, the canvas wasn't properly cleared for all players.

**Fix**:
- Server now emits `clearCanvas` event when new round starts
- Client's `gameStart` handler clears canvas and resets strokes

```javascript
io.emit('clearCanvas'); // in startNewRound()
```

---

### 8. Drawing State Conflict with Clear
**File**: `client/src/components/Canvas.jsx:116-125`

**Problem**: When strokes were cleared externally, the local drawing state (`isDrawing`, `currentPoints`) wasn't reset, causing drawing conflicts.

**Fix**: Modified `clearCanvas` function to also reset drawing state:
```javascript
const clearCanvas = useCallback(() => {
  setIsDrawing(false);
  setCurrentPoints([]);
  // ... canvas clearing
}, [width, height]);
```

---

### 9. Guessing Only Allowed After Finishing Drawing
**Files**: `server/index.js:54-88` and `client/src/App.jsx:203-206,309-316`

**Problem**: Players could only guess after the drawer clicked "Finish Drawing" button. We removed the button so guessing should be allowed during drawing phase.

**Fix**:
- Server: Changed `guess` event to accept guesses during both 'drawing' and 'guessing' phases
- Client: Changed `handleGuess` to send guesses when `phase === 'drawing' || phase === 'guessing'`
- Client: Changed GuessInput to be enabled during drawing phase with placeholder "开始猜测..."

---

### 10. Removed "Finish Drawing" Button
**Files**: `server/index.js:81` and `client/src/App.jsx:199-207,302-320`

**Problem**: "Finish Drawing" button prevented drawer from continuing to draw after clicking it.

**Fix**: Completely removed the finishDrawing functionality:
- Removed `finishDrawing` event handler from server
- Removed the button from client UI

---

### 11. User List Score Not Displaying for Current User
**Files**: `client/src/components/UserList.jsx:62` and `client/src/App.jsx:51-52`

**Problem**: Score wasn't showing for the current user in the player list.

**Fix**:
- Fixed score display to use explicit type check: `{typeof user.score === 'number' ? user.score : 0}分`
- Made score color adapt to background (black on cyan for current user)
- Simplified `usersUpdate` handler since server now sends complete user data with scores

---

### 12. Countdown Sync Between Drawer and Guessers
**File**: `client/src/App.jsx:93-109`

**Problem**: When new round started, only the drawer received the 120-second countdown, guessers didn't reset their countdown timers.

**Fix**: Added timer resets in both `gameStart` and `phaseChange` handlers:
```javascript
socket.on('gameStart', ({ word, isDrawer: drawer }) => {
  // ...
  setDrawTimeLeft(120);
  setGuessTimeLeft(60);
});

socket.on('phaseChange', ({ phase: newPhase }) => {
  // ...
  if (newPhase === 'drawing') {
    setDrawTimeLeft(120);
  }
  if (newPhase === 'guessing') {
    setGuessTimeLeft(60);
  }
});
```

---

## Known Issues Fixed
- ✅ Canvas coordinate offset
- ✅ New player joining mid-game
- ✅ Timer duration (30s → 10s)
- ✅ Round not starting after countdown
- ✅ Canvas clearing on new round
- ✅ Drawing state conflict
- ✅ Guessing during drawing phase
- ✅ Removed finish drawing button
- ✅ Score display for current user
- ✅ Countdown sync between players

---

## Files Modified

### Server
- `server/index.js` - Main game logic, socket events, timer management
- `server/gameState.js` - Game state management
- `server/words.js` - Word list for game

### Client
- `client/src/App.jsx` - Main game component, socket event handlers
- `client/src/components/Canvas.jsx` - Drawing canvas with coordinate handling
- `client/src/components/UserList.jsx` - Player list with scores
- `client/src/components/GuessInput.jsx` - Guess input component
- `client/src/components/ResultsModal.jsx` - Round end results modal

---

## Scripts Added
- `start.sh` - Linux/Mac startup script
- `start.bat` - Windows startup script