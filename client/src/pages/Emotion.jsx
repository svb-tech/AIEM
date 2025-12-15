import React, { useState, useCallback } from 'react';
import WebcamView from '../components/WebcamView';
import EmotionResult, { getDominantEmotion } from '../components/EmotionResult';
import MusicPlayer from '../components/MusicPlayer';
import { useAuth } from '../context/AuthContext';
import './Emotion.css';
import Navbar from './Navbar';

const Emotion = () => {
  const [currentEmotion, setCurrentEmotion] = useState(null);
  const { isAuthenticated } = useAuth();

  const handleEmotionDetected = useCallback(
    (emotions) => {
      if (!emotions) return;

      const dominant = getDominantEmotion(emotions);
      if (!dominant || !dominant.emotion || dominant.value === 0) return;

      // Directly update state
      setCurrentEmotion(emotions);
    },
    []
  );

  if (!isAuthenticated) {
    
    return (
      <>
      <Navbar/>
    <div className='login'>
    <p>Please login to use the AI Music Recommendation feature!</p>
  <a href="/login" className="Login">Go to Login</a>
  <a href="/signup" className="signup">Register here</a>
  <p>After that</p>
   <ul>
    
                  <li>Go to <strong>Playlists</strong> page</li>
                  <li>Select an emotion (happy, sad, angry, etc.)</li>
                  <li>Search and add YouTube songs</li>
                  <li>Come back here and show facial expressions!</li>
                  <li>AI will play songs matching your emotion</li>
                </ul>
    </div>
    </>
    )
  }

  

  return (
    <div className="emotion-page">
      <Navbar />

      <main className="emotion-main">
        <div className="emotion-container">
          <div className="left-panel">
            <WebcamView onEmotionDetected={handleEmotionDetected} />
          </div>

          <div className="right-panel">
            <EmotionResult emotions={currentEmotion} />
          </div>
        </div>

        <div className="media-player-wrapper">
          <MusicPlayer currentEmotion={currentEmotion} />
        </div>
      </main>

      <footer className="emotion-footer">
        <p>
          &copy; 2025 EmoMusic AI — An <strong>SVB Tech Solutions</strong> Innovation. All rights
          reserved.
        </p>
      </footer>
    </div>
  );
};

export default Emotion;
