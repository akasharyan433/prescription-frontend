import React, { useState } from 'react';

const ResponseDisplay = ({ response }) => {
  const [showRaw, setShowRaw] = useState(false);

  const formatJson = (obj) => {
    return JSON.stringify(obj, null, 2);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(formatJson(response));
    alert('Response copied to clipboard!');
  };

  return (
    <div className="response-display">
      <div className="response-header">
        <h2>Analysis Result</h2>
        <div className="response-actions">
          <button 
            onClick={() => setShowRaw(!showRaw)}
            className="toggle-btn"
          >
            {showRaw ? 'Show Formatted' : 'Show Raw JSON'}
          </button>
          <button 
            onClick={copyToClipboard}
            className="copy-btn"
          >
            Copy Response
          </button>
        </div>
      </div>
      
      <div className="response-content">
        {showRaw ? (
          <pre className="json-raw">
            {formatJson(response)}
          </pre>
        ) : (
          <div className="json-formatted">
            <div className="response-section">
              <h3>Success</h3>
              <p className={response.success ? 'success' : 'error'}>
                {response.success ? '✅ Analysis Completed' : '❌ Analysis Failed'}
              </p>
            </div>
            
            {response.data && (
              <div className="response-section">
                <h3>Analysis Data</h3>
                <pre className="json-block">
                  {formatJson(response.data)}
                </pre>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResponseDisplay;
