import React from 'react';
import './QualityFeedback.css';

const QualityFeedback = ({ qualityData, onRetake }) => {
  const getScoreColor = (score) => {
    if (score >= 80) return '#28a745';
    if (score >= 60) return '#ffc107';
    return '#dc3545';
  };

  const getQualityIcon = (level) => {
    switch (level) {
      case 'excellent': return '🌟';
      case 'good': return '✅';
      case 'acceptable': return '⚠️';
      case 'poor': return '❌';
      default: return '❓';
    }
  };

  return (
    <div className="quality-feedback">
      <div className="quality-header">
        <h3>📊 Image Quality Assessment</h3>
        <div className="overall-score">
          <span 
            className="score-circle" 
            style={{ borderColor: getScoreColor(qualityData.score) }}
          >
            {qualityData.score}
          </span>
          <span className="score-label">{qualityData.quality}</span>
        </div>
      </div>

      <div className="quality-message">
        <p className="main-message">
          <strong>Image quality is too poor for accurate analysis.</strong>
        </p>
        <p>Please retake the photo following the recommendations below:</p>
      </div>

      <div className="quality-checks">
        <h4>Quality Checks:</h4>
        {qualityData.checks && Object.entries(qualityData.checks).map(([key, check]) => (
          <div key={key} className="check-item">
            <div className="check-header">
              <span className="check-icon">{getQualityIcon(check.level)}</span>
              <span className="check-name">{key.charAt(0).toUpperCase() + key.slice(1)}</span>
              <span 
                className="check-score"
                style={{ color: getScoreColor(check.score) }}
              >
                {check.score}/100
              </span>
            </div>
            <p className="check-message">{check.message}</p>
          </div>
        ))}
      </div>

      <div className="recommendations">
        <h4>📋 Recommendations:</h4>
        <ul>
          {qualityData.recommendations?.map((rec, index) => (
            <li key={index}>{rec}</li>
          ))}
        </ul>
      </div>

      <div className="quality-actions">
        <button onClick={onRetake} className="retake-btn">
          📸 Retake Photo
        </button>
        <div className="quality-tips">
          <small>
            <strong>Pro tip:</strong> Use natural lighting and ensure the prescription 
            is flat against a dark background for best results.
          </small>
        </div>
      </div>
    </div>
  );
};

export default QualityFeedback;
