// App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Signup from "./pages/Signup"; 
import Login from './pages/Login';
import Emotion from './pages/emotion';
import Playlists from './pages/Playlists'; // Import from pages folder

const App = () => {
  return (
    <Router>
      <Routes>
        {/* home pages */}
        <Route path="/" element={<Home/>} />
        <Route path="/signup" element={<Signup/>} />
        <Route path="/login" element={<Login/>} />
        <Route path='/emotion' element={<Emotion/>} />
        <Route path='/playlists' element={<Playlists />} /> {/* Use Playlists from pages */}
      </Routes>
    </Router>
  );
};

export default App;