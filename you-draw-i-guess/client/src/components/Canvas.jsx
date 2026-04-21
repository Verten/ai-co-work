import { useRef, useEffect, useState, useCallback } from 'react';

const Canvas = ({
  width = 800,
  height = 600,
  isDrawingEnabled = true,
  tool = 'brush',
  color = '#000000',
  size = 8,
  onStrokeComplete,
  strokes = [],
  onClear
}) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPoints, setCurrentPoints] = useState([]);
  const strokesLengthRef = useRef(strokes.length);

  // 记录上一次的strokes长度，用于检测清空
  useEffect(() => {
    strokesLengthRef.current = strokes.length;
  }, [strokes.length]);

  // 绘制已有笔触
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    strokes.forEach(stroke => {
      if (stroke.points.length < 2) return;
      ctx.strokeStyle = stroke.color;
      ctx.lineWidth = stroke.size;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
      for (let i = 1; i < stroke.points.length; i++) {
        ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
      }
      ctx.stroke();
    });
  }, [strokes, width, height]);

  const getCoordinates = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    if (e.touches) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY
      };
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  };

  const startDrawing = (e) => {
    if (!isDrawingEnabled) return;
    e.preventDefault();
    setIsDrawing(true);
    const pos = getCoordinates(e);
    setCurrentPoints([pos]);

    // 画一个点
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = tool === 'eraser' ? '#ffffff' : color;
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, (tool === 'eraser' ? size * 2 : size) / 2, 0, Math.PI * 2);
    ctx.fill();
  };

  const draw = (e) => {
    if (!isDrawing || !isDrawingEnabled) return;
    e.preventDefault();

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const pos = getCoordinates(e);

    ctx.strokeStyle = tool === 'eraser' ? '#ffffff' : color;
    ctx.lineWidth = tool === 'eraser' ? size * 2 : size;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const lastPos = currentPoints[currentPoints.length - 1];
    ctx.beginPath();
    ctx.moveTo(lastPos.x, lastPos.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();

    setCurrentPoints(prev => [...prev, pos]);
  };

  const endDrawing = () => {
    if (isDrawing && currentPoints.length > 0) {
      onStrokeComplete({
        tool,
        color: tool === 'eraser' ? '#ffffff' : color,
        size: tool === 'eraser' ? size * 2 : size,
        points: currentPoints
      });
    }
    setIsDrawing(false);
    setCurrentPoints([]);
  };

  // 清除画布
  const clearCanvas = useCallback(() => {
    // 清空时也要停止绘画
    setIsDrawing(false);
    setCurrentPoints([]);

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);
  }, [width, height]);

  // 暴露清除方法
  useEffect(() => {
    if (onClear) {
      onClear(clearCanvas);
    }
  }, [onClear, clearCanvas]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      onMouseDown={startDrawing}
      onMouseMove={draw}
      onMouseUp={endDrawing}
      onMouseLeave={endDrawing}
      onTouchStart={startDrawing}
      onTouchMove={draw}
      onTouchEnd={endDrawing}
      style={{
        touchAction: 'none',
        cursor: isDrawingEnabled ? 'crosshair' : 'not-allowed',
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
      }}
    />
  );
};

export default Canvas;