import React from 'react';
import Editor from '@monaco-editor/react';
import './BlueprintPanel.css';

interface BlueprintPanelProps {
  code: string;
  onChange?: (value: string | undefined) => void;
  readOnly?: boolean;
  explanation?: string;
}

export const BlueprintPanel: React.FC<BlueprintPanelProps> = ({ 
  code, 
  onChange, 
  readOnly = false,
  explanation 
}) => {
  return (
    <div className="blueprint-panel">
      <h2 className="panel-title">📝 Blueprint Panel</h2>
      {explanation && (
        <div className="explanation">
          <strong>Last Change:</strong> {explanation}
        </div>
      )}
      <div className="editor-container">
        <Editor
          height="calc(100% - 40px)"
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
    </div>
  );
};