import React from 'react';
import './EmotionResult.css';

export const getDominantEmotion = (emotions) => {
    return Object.entries(emotions).reduce((max, [emotion, value]) => 
      value > max.value ? { emotion, value } : max, 
      { emotion: '', value: 0 }
    );
  };
  
const EmotionResult = ({ emotions }) => {
  if (!emotions) {
    return (
      <div className="emotion-result">
        <h3>Emotion Detection</h3>
        <div className="no-emotion">
          No face detected. Please look at the camera.
        </div>
      </div>
    );
  }

  // Get dominant emotion
  
  
  const dominantEmotion = getDominantEmotion(emotions);
  const emotionPercentage = (dominantEmotion.value * 100).toFixed(1);

  // Get emotion color
  const getEmotionColor = (emotion) => {
    const colors = {
      happy: '#4CAF50',
      sad: '#2196F3',
      angry: '#f44336',
      fearful: '#FF9800',
      disgusted: '#9C27B0',
      surprised: '#FFC107',
      neutral: '#607D8B'
    };
    return colors[emotion] || '#666';
  };

  return (
    <div className="emotion-result">
      <h3>AI Emotion Detection Results</h3>
      
      <div className="dominant-emotion">
        <div 
          className="emotion-badge"
          style={{ backgroundColor: getEmotionColor(dominantEmotion.emotion) }}
        >
          {dominantEmotion.emotion.toUpperCase()}
        </div>
        <div className="confidence">
          Confidence: {emotionPercentage}%
        </div>
      </div>

      <div className="emotion-breakdown">
        <h4>All Emotions:</h4>
        {Object.entries(emotions).map(([emotion, value]) => (
          <div key={emotion} className="emotion-bar-container">
            <div className="emotion-label">
              {emotion.charAt(0).toUpperCase() + emotion.slice(1)}
            </div>
            <div className="emotion-bar-wrapper">
              <div 
                className="emotion-bar"
                style={{ 
                  width: `${value * 100}%`,
                  backgroundColor: getEmotionColor(emotion)
                }}
              ></div>
              <span className="emotion-value">
                {(value * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmotionResult;
