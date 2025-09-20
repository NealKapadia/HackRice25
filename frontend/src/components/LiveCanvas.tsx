import React, { useEffect, useRef } from 'react';
import './LiveCanvas.css';

interface LiveCanvasProps {
  code: string;
  onError: (error: string) => void;
}

export const LiveCanvas: React.FC<LiveCanvasProps> = ({ code, onError }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Clean up any previous animation frame
    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }

    // Clear the canvas
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    if (!code) return;

    try {
      // Create a new function from the code string
      // We wrap it in a function to avoid global scope pollution
      const gameFunction = new Function('canvas', `
        try {
          ${code}
        } catch (error) {
          throw error;
        }
      `);

      // Execute the game code with the canvas
      gameFunction(canvas);
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Unknown error occurred');
      console.error('Canvas execution error:', error);
    }

    // Cleanup function
    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [code, onError]);

  return (
    <div className="live-canvas">
      <h2 className="panel-title">🎮 Live Canvas</h2>
      <div className="canvas-container">
        <canvas 
          ref={canvasRef} 
          id="gameCanvas"
          width={600}
          height={400}
          className="game-canvas"
        />
      </div>
    </div>
  );
};