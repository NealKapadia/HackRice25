import { useState, useCallback } from 'react';
import axios from 'axios';
import { DirectorPanel } from './components/DirectorPanel';
import { LiveCanvas } from './components/LiveCanvas';
import { BlueprintPanel } from './components/BlueprintPanel';
import './App.css';

interface GenerationResponse {
  newCode: string;
  explanation: string;
}

interface ErrorResponse {
  error: string;
}

function App() {
  const [currentCode, setCurrentCode] = useState<string>('');
  const [promptHistory, setPromptHistory] = useState<string[]>([]);
  const [codeHistory, setCodeHistory] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [explanation, setExplanation] = useState<string>('');

  const handleGenerate = useCallback(async (prompt: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post<GenerationResponse>(
        `${import.meta.env.VITE_API_URL || 'http://localhost:8787'}/api/generate`,
        {
          currentCode,
          promptHistory,
          newPrompt: prompt
        }
      );

      const { newCode, explanation } = response.data;
      
      // Save to history before updating
      if (currentCode) {
        setCodeHistory(prev => [...prev, currentCode]);
      }
      
      setCurrentCode(newCode);
      setPromptHistory(prev => [...prev, prompt]);
      setExplanation(explanation);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.data) {
        const errorData = err.response.data as ErrorResponse;
        setError(errorData.error || 'Failed to generate code');
      } else {
        setError('Failed to generate code. Please try again.');
      }
      console.error('Generation error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [currentCode, promptHistory]);

  const handleReset = useCallback(() => {
    if (codeHistory.length > 0) {
      const previousCode = codeHistory[codeHistory.length - 1];
      setCurrentCode(previousCode);
      setCodeHistory(prev => prev.slice(0, -1));
      setPromptHistory(prev => prev.slice(0, -1));
      setExplanation('Reverted to previous state');
    }
  }, [codeHistory]);

  const handleCodeEdit = useCallback((value: string | undefined) => {
    if (value !== undefined) {
      setCurrentCode(value);
      setExplanation('Code manually edited');
    }
  }, []);

  const handleCanvasError = useCallback((error: string) => {
    setError(`Canvas Error: ${error}`);
  }, []);

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">🎮 GenEngine</h1>
        <p className="app-tagline">A live, AI-powered game development environment</p>
      </header>
      
      {error && (
        <div className="error-banner">
          <span>⚠️ {error}</span>
          <button onClick={() => setError(null)}>×</button>
        </div>
      )}

      <div className="panels-container">
        <div className="panel director">
          <DirectorPanel
            onGenerate={handleGenerate}
            onReset={handleReset}
            isLoading={isLoading}
            promptHistory={promptHistory}
          />
        </div>
        
        <div className="panel canvas">
          <LiveCanvas
            code={currentCode}
            onError={handleCanvasError}
          />
        </div>
        
        <div className="panel blueprint">
          <BlueprintPanel
            code={currentCode}
            onChange={handleCodeEdit}
            readOnly={false}
            explanation={explanation}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
