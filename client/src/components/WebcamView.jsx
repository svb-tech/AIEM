import React, { useRef, useEffect, useState } from 'react';
import * as faceapi from 'face-api.js';
import './WebcamView.css';

const WebcamView = ({ onEmotionDetected }) => {
  const videoRef = useRef(null);  // Ref for video element
  const canvasRef = useRef(null);  // Ref for canvas element
  const [modelsLoaded, setModelsLoaded] = useState(false);  // Track if models are loaded
  const [isWebcamActive, setIsWebcamActive] = useState(false);  // Track if webcam is on

  // Load face-api.js models with retry logic
  const loadModels = async () => {
    const MODEL_URL = '/models';
    const nets = [
      faceapi.nets.tinyFaceDetector,
      faceapi.nets.faceLandmark68Net,
      faceapi.nets.faceRecognitionNet,
      faceapi.nets.faceExpressionNet
    ];

    try {
      for (const net of nets) {
        let loaded = false;
        let attempts = 0;
        const maxAttempts = 5;  // Max retry attempts
        while (!loaded && attempts < maxAttempts) {
          try {
            await net.loadFromUri(MODEL_URL);
            loaded = true;
            console.log(`${net} loaded successfully`);
          } catch (err) {
            attempts++;
            console.warn(`${net} failed to load (attempt ${attempts}), retrying in 1s...`, err);
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        }
        if (!loaded) {
          throw new Error(`${net} could not be loaded after ${maxAttempts} attempts`);
        }
      }
      setModelsLoaded(true);
      
    } catch (err) {
      
      alert('Failed to load AI models. Please refresh the page.');
    }
  };

  // Load models on component mount
  useEffect(() => {
    loadModels();
  }, []);

  // Start webcam with permissions check
  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: 'user' }  // Front camera by default
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsWebcamActive(true);
        console.log('Webcam started');
      }
    } catch (err) {
      console.error('Error accessing webcam:', err);
      alert('Could not access webcam. Please allow camera permissions and try again.');
    }
  };

  // Stop webcam and clean up stream
  const stopWebcam = () => {
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;  // Clear srcObject
      setIsWebcamActive(false);
      console.log('Webcam stopped');
       const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    }
  };

  // Auto-stop camera on scroll (when scrolling down)
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100 && isWebcamActive) {
        stopWebcam();
        console.log('Camera auto-stopped due to scroll');
      }
    };

    // Use passive listener for better performance
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isWebcamActive]);

  // Detect emotions in a loop
  const detectEmotions = async () => {
    
    if (!modelsLoaded || !isWebcamActive || !videoRef.current) return;

    const video = videoRef.current;
    // Wait for video to be fully loaded (dimensions available)
    if (video.videoWidth === 0 || video.videoHeight === 0) {
      requestAnimationFrame(detectEmotions);
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const displaySize = { width: video.videoWidth, height: video.videoHeight };
    faceapi.matchDimensions(canvas, displaySize);

    try {
     const detection = await faceapi
  .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions({ scoreThreshold: 0.5 }))
  .withFaceLandmarks()
  .withFaceExpressions({ minConfidence: 0.5 });  // Add min confidence for expressions

      //  console.log(detection);
      if (detection && detection.expressions) {
        const resized = faceapi.resizeResults(detection, displaySize);
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        faceapi.draw.drawDetections(canvas, resized);
        faceapi.draw.drawFaceLandmarks(canvas, resized);
        faceapi.draw.drawFaceExpressions(canvas, resized);

        // Pass emotions to parent
        if (onEmotionDetected) {
          onEmotionDetected(detection.expressions);
        }
      }
    } catch (err) {
      console.warn('Error in emotion detection:', err);
    }

    // Continue loop if still active
    if (isWebcamActive) {
      requestAnimationFrame(detectEmotions);
    }
  };

  // Start emotion detection when webcam is active and models are loaded
  useEffect(() => {
    if (isWebcamActive && modelsLoaded) {
      detectEmotions();
    }
  }, [isWebcamActive, modelsLoaded]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopWebcam();  // Ensure webcam stops when component unmounts
    };
  }, []);

  return (
    <div className="webcam-container">
      <div className="webcam-controls">
        <div class="button-group">
        <button 
          onClick={startWebcam} 
          disabled={isWebcamActive || !modelsLoaded}
          className="control-btn start-btn"
        >
          {modelsLoaded ? 'Start Camera' : 'Loading Models...'}
        </button>
        <button 
          onClick={stopWebcam}  // Enabled, taaki available ho
          disabled={!isWebcamActive}  // Only enabled when camera is on
          className="control-btn stop-btn"
        >
          Stop Camera
        </button>
        </div>
      </div>

      <div className="video-wrapper">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline  // For mobile compatibility
          className="webcam-video"
        />
        {isWebcamActive &&(
        <canvas
          ref={canvasRef}
          className="emotion-canvas"
        />)}
      </div>

      {!modelsLoaded && (
        <div className="loading-message">
          Loading AI models...
        </div>
      )}
    </div>
  );
};

export default WebcamView;
