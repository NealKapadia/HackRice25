import React, { useState } from 'react';
import './DirectorPanel.css';

interface DirectorPanelProps {
  onGenerate: (prompt: string) => void;
  onReset: () => void;
  isLoading: boolean;
  promptHistory: string[];
}

export const DirectorPanel: React.FC<DirectorPanelProps> = ({
  onGenerate,
  onReset,
  isLoading,
  promptHistory
}) => {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !isLoading) {
      onGenerate(prompt.trim());
      setPrompt('');
    }
  };

  return (
    <div className="director-panel">
      <h2 className="panel-title">🎬 Director Panel</h2>
      <form onSubmit={handleSubmit} className="prompt-form">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your game instruction... (e.g., 'Create a blue ball that bounces')"
          disabled={isLoading}
          className="prompt-input"
          rows={4}
        />
        <div className="button-group">
          <button 
            type="submit" 
            disabled={isLoading || !prompt.trim()}
            className="generate-btn"
          >
            {isLoading ? 'Generating...' : '✨ Generate'}
          </button>
          <button
            type="button"
            onClick={onReset}
            disabled={isLoading || promptHistory.length === 0}
            className="reset-btn"
          >
            ↩️ Reset to Last
          </button>
        </div>
      </form>
      {promptHistory.length > 0 && (
        <div className="history">
          <h3>Recent Commands:</h3>
          <ul>
            {promptHistory.slice(-3).reverse().map((cmd, index) => (
              <li key={index}>{cmd}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};