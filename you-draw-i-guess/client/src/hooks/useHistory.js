import { useState, useCallback } from 'react';

export const useHistory = (initialState = []) => {
  const [history, setHistory] = useState(initialState);
  const [index, setIndex] = useState(-1);

  const push = useCallback((state) => {
    setHistory(prev => [...prev.slice(0, index + 1), state]);
    setIndex(prev => prev + 1);
  }, [index]);

  const undo = useCallback(() => {
    if (index > 0) {
      setIndex(prev => prev - 1);
      return history[index - 1];
    }
    return null;
  }, [index, history]);

  const redo = useCallback(() => {
    if (index < history.length - 1) {
      setIndex(prev => prev + 1);
      return history[index + 1];
    }
    return null;
  }, [index, history]);

  const canUndo = index > 0;
  const canRedo = index < history.length - 1;

  return { push, undo, redo, canUndo, canRedo, currentState: history[index] };
};