import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import axios from 'axios';
import './BlueprintPanel.css';

interface BlueprintPanelProps {
  code: string;
  onChange?: (value: string | undefined) => void;
  readOnly?: boolean;
  explanation?: string;
}

type ChatMessage = { role: 'user' | 'assistant'; content: string };

export const BlueprintPanel: React.FC<BlueprintPanelProps> = ({ 
  code, 
  onChange, 
  readOnly = false,
  explanation 
}) => {
  const [chatOpen, setChatOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [question, setQuestion] = useState<string>('');
  const [chatLoading, setChatLoading] = useState<boolean>(false);
  const apiBase = (import.meta as any).env.VITE_API_URL || 'http://localhost:8787';

  const askAssistant = async () => {
    const q = question.trim();
    if (!q || chatLoading) return;
    setChatLoading(true);
    setMessages(prev => [...prev, { role: 'user', content: q }]);
    setQuestion('');
    try {
      const res = await axios.post<{ answer: string }>(`${apiBase}/api/explain`, {
        code,
        question: q,
      });
      const answer = res.data?.answer || 'No answer received.';
      setMessages(prev => [...prev, { role: 'assistant', content: answer }]);
    } catch (e: any) {
      const msg = e?.response?.data?.error || 'Failed to get explanation. Please try again.';
      setMessages(prev => [...prev, { role: 'assistant', content: `Error: ${msg}` }]);
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div className="blueprint-panel">
      <div className="blueprint-header">
        <h2 className="panel-title">📝 Blueprint Panel</h2>
        <button className="ai-help-btn" onClick={() => setChatOpen(v => !v)}>
          {chatOpen ? 'Close AI Help' : 'Ask AI'}
        </button>
      </div>
      {explanation && (
        <div className="explanation">
          <strong>Last Change:</strong> {explanation}
        </div>
      )}
      <div className="blueprint-layout">
        <div className="editor-container">
          <Editor
            height="100%"
            language="javascript"
            theme="vs-dark"
            value={code}
            onChange={onChange}
            options={{
              readOnly,
              minimap: { enabled: false },
              fontSize: 14,
              wordWrap: 'on',
              automaticLayout: true,
              scrollBeyondLastLine: false,
              lineNumbers: 'on',
              folding: true,
              bracketPairColorization: { enabled: true }
            }}
          />
        </div>
        {chatOpen && (
          <div className="chat-panel">
            <div className="chat-messages">
              {messages.length === 0 && (
                <div className="chat-empty">Ask me about any part of the code. I can explain functions, logic flow, or suggest improvements.</div>
              )}
              {messages.map((m, idx) => (
                <div key={idx} className={`chat-msg ${m.role}`}>
                  <div className="chat-role">{m.role === 'user' ? 'You' : 'AI'}</div>
                  <div className="chat-content">{m.content}</div>
                </div>
              ))}
            </div>
            <div className="chat-input-row">
              <input
                className="chat-input"
                type="text"
                placeholder="Ask about the code..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') askAssistant(); }}
                disabled={chatLoading}
              />
              <button className="chat-send-btn" onClick={askAssistant} disabled={chatLoading || !question.trim()}>
                {chatLoading ? '...' : 'Send'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
