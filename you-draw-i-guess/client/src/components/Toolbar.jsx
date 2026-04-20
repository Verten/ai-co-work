import { useState } from 'react';

const COLORS = [
  '#000000', '#ffffff', '#ff0000', '#ff8800', '#ffff00',
  '#00ff00', '#00ffff', '#8800ff', '#ff00ff', '#8b4513',
  '#808080', '#333333'
];

const SIZES = [4, 8, 12, 20];

const Toolbar = ({
  tool,
  setTool,
  color,
  setColor,
  size,
  setSize,
  onUndo,
  onRedo,
  onClear,
  canUndo,
  canRedo,
  isDrawer
}) => {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '20px',
      padding: '15px 20px',
      backgroundColor: '#16213e',
      borderRadius: '12px',
      flexWrap: 'wrap'
    }}>
      {/* 工具选择 */}
      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          onClick={() => setTool('brush')}
          style={{
            padding: '8px 16px',
            backgroundColor: tool === 'brush' ? '#0ff' : '#1a1a2e',
            color: tool === 'brush' ? '#000' : '#fff',
            border: '2px solid #0ff',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          画笔
        </button>
        <button
          onClick={() => setTool('eraser')}
          style={{
            padding: '8px 16px',
            backgroundColor: tool === 'eraser' ? '#0ff' : '#1a1a2e',
            color: tool === 'eraser' ? '#000' : '#fff',
            border: '2px solid #0ff',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          橡皮擦
        </button>
      </div>

      {/* 颜色选择 */}
      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
        {COLORS.map(c => (
          <button
            key={c}
            onClick={() => setColor(c)}
            style={{
              width: '28px',
              height: '28px',
              backgroundColor: c,
              border: color === c ? '3px solid #0ff' : '2px solid #333',
              borderRadius: '6px',
              cursor: 'pointer',
              boxShadow: color === c ? '0 0 10px #0ff' : 'none'
            }}
          />
        ))}
      </div>

      {/* 大小选择 */}
      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
        {SIZES.map(s => (
          <button
            key={s}
            onClick={() => setSize(s)}
            style={{
              width: '36px',
              height: '36px',
              backgroundColor: size === s ? '#0ff' : '#1a1a2e',
              border: '2px solid #0ff',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <span style={{
              width: s,
              height: s,
              backgroundColor: '#fff',
              borderRadius: '50%',
              display: 'block'
            }} />
          </button>
        ))}
      </div>

      {/* 操作按钮 */}
      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          onClick={onUndo}
          disabled={!canUndo || !isDrawer}
          style={{
            padding: '8px 16px',
            backgroundColor: canUndo && isDrawer ? '#f0f' : '#333',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: canUndo && isDrawer ? 'pointer' : 'not-allowed',
            opacity: canUndo && isDrawer ? 1 : 0.5
          }}
        >
          撤销
        </button>
        <button
          onClick={onRedo}
          disabled={!canRedo || !isDrawer}
          style={{
            padding: '8px 16px',
            backgroundColor: canRedo && isDrawer ? '#f0f' : '#333',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: canRedo && isDrawer ? 'pointer' : 'not-allowed',
            opacity: canRedo && isDrawer ? 1 : 0.5
          }}
        >
          重做
        </button>
        <button
          onClick={onClear}
          disabled={!isDrawer}
          style={{
            padding: '8px 16px',
            backgroundColor: isDrawer ? '#ff4444' : '#333',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: isDrawer ? 'pointer' : 'not-allowed',
            opacity: isDrawer ? 1 : 0.5
          }}
        >
          清空
        </button>
      </div>
    </div>
  );
};

export default Toolbar;