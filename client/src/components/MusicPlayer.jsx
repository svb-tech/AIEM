import React, { useState, useEffect, useRef, useCallback } from 'react';
import './MusicPlayer.css';
import { playlistService } from '../services/playlistService';
import { useAuth } from '../context/AuthContext';

const MusicPlayer = ({ currentEmotion }) => {
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playlist, setPlaylist] = useState([]);
  const [userPlaylists, setUserPlaylists] = useState({});
  const [loadingUserPlaylists, setLoadingUserPlaylists] = useState(false);
  const [noSongsMessage, setNoSongsMessage] = useState("");

  const { isAuthenticated } = useAuth();
  const previousEmotionRef = useRef("");

  // Fetch user playlists
  const fetchUserPlaylists = useCallback(async () => {
    if (!isAuthenticated) {
      setUserPlaylists({});
      setLoadingUserPlaylists(false);
      return;
    }

    setLoadingUserPlaylists(true);
    try {
      const response = await playlistService.getPlaylists();
      if (response.success && response.playlists) {
        const formattedPlaylists = {};
        let hasAnySongs = false;

        Object.keys(response.playlists).forEach(emotion => {
          if (response.playlists[emotion]?.songs?.length > 0) {
            formattedPlaylists[emotion] = response.playlists[emotion].songs.map(song => ({
              id: song.videoId || song.id,
              title: song.title,
              artist: song.channel,
              emotion: emotion,
              isUserAdded: true
            }));
            hasAnySongs = true;
          }
        });

        setUserPlaylists(formattedPlaylists);

        if (!hasAnySongs) {
          setNoSongsMessage("No songs added yet. Please add songs from the Playlists page first!");
        } else {
          setNoSongsMessage("");
        }
      } else {
        setNoSongsMessage("No songs added yet. Please add songs from the Playlists page first!");
      }
    } catch (error) {
      console.error("Error fetching user playlists:", error);
      setNoSongsMessage("Error loading playlists. Please try again.");
    } finally {
      setLoadingUserPlaylists(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchUserPlaylists();
  }, [fetchUserPlaylists]);

  // Main emotion detection effect
  useEffect(() => {
    if (currentEmotion && isAuthenticated) {
      const dominantEmotion = Object.entries(currentEmotion).reduce((a, b) =>
        a[1] > b[1] ? a : b
      )[0];

      if (dominantEmotion !== previousEmotionRef.current) {
        let songsToPlay = [];

        if (userPlaylists[dominantEmotion] && userPlaylists[dominantEmotion].length > 0) {
          songsToPlay = userPlaylists[dominantEmotion];
          setNoSongsMessage("");
        } else {
          setNoSongsMessage(`You haven't added any songs for ${dominantEmotion} mood. Please add songs from Playlists page.`);
          setPlaylist([]);
          setCurrentSong(null);
          setIsPlaying(false);
          previousEmotionRef.current = dominantEmotion;
          return;
        }

        if (songsToPlay.length > 0) {
          setPlaylist(songsToPlay);
          setCurrentSong(songsToPlay[0]);
          setIsPlaying(true);
          previousEmotionRef.current = dominantEmotion;
        }
      }
    }
  }, [currentEmotion, userPlaylists, isAuthenticated]);

  const playNext = () => {
    if (!currentSong || playlist.length === 0) return;
    const i = playlist.findIndex(s => s.id === currentSong.id);
    const next = (i + 1) % playlist.length;
    setCurrentSong(playlist[next]);
    setIsPlaying(true);
  };

  const playPrevious = () => {
    if (!currentSong || playlist.length === 0) return;
    const i = playlist.findIndex(s => s.id === currentSong.id);
    const prev = (i - 1 + playlist.length) % playlist.length;
    setCurrentSong(playlist[prev]);
    setIsPlaying(true);
  };

  const togglePlay = () => setIsPlaying(!isPlaying);

  const selectSong = (song) => {
    setCurrentSong(song);
    setIsPlaying(true);
  };

  const getYouTubeUrl = (videoId) => {
    return `https://www.youtube.com/embed/${videoId}?autoplay=${isPlaying ? 1 : 0}&modestbranding=1&controls=1&rel=0`;
  };

  return (
    <div className="music-player">
      <h3>AI MUSIC RECOMMENDATION</h3>

      {loadingUserPlaylists ? (
        <div className="loading-songs">
          <div className="loader">🎵</div>
          <p>Loading your playlists...</p>
        </div>
      ) : currentSong ? (
        <>
          <div className="current-emotion">
            Current Mood: <span className="emotion-text">{previousEmotionRef.current}</span>
            <span className="playlist-badge">🎵 Your Custom Playlist</span>
          </div>

          <div className='music-layout'>
            <div className='ms-left-panel'>
              <div className="now-playing">
                <div className="song-info">
                  <div className="song-title">
                    {currentSong.title}
                    <span className="user-added-badge">(Your Song)</span>
                  </div>
                  <div className="song-artist">{currentSong.artist}</div>
                  <div className="song-emotion">
                    Recommended for: <span className="emotion-match">{currentSong.emotion}</span>
                  </div>
                </div>
              </div>
              
              <div className='player-layout'>
                <div className="video-container">
                  <iframe
                    width="100%"
                    height="400"
                    src={getYouTubeUrl(currentSong.id)}
                    title={currentSong.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>

                <div className="player-controls">
                  <button onClick={playPrevious} className="control-btn">⏮</button>
                  <button onClick={togglePlay} className="play-pause-btn">
                    {isPlaying ? "⏸" : "▶"}
                  </button>
                  <button onClick={playNext} className="control-btn">⏭</button>
                </div>
              </div>
            </div>

            <div className="playlist">
              <div className="playlist-header">
                <h4>Your Custom Playlist ({playlist.length} songs)</h4>
                <a href="/playlists" className="add-more-btn">+ Add More Songs</a>
              </div>
              
              <div className="playlist-items">
                {playlist.map(song => (
                  <div
                    key={song.id}
                    className={`playlist-item ${currentSong.id === song.id ? "active" : ""}`}
                    onClick={() => selectSong(song)}
                  >
                    <div className="playlist-song-info">
                      <span className="playlist-title">
                        {song.title}
                        <span className="user-indicator">(Your)</span>
                      </span>
                      <span className="playlist-artist">{song.artist}</span>
                    </div>
                    {currentSong.id === song.id && isPlaying && (
                      <div className="playing-indicator">🎵</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="no-song">
          {noSongsMessage ? (
            <>
              <div className="empty-playlist-message">
                <div className="empty-icon">🎵</div>
                <h4>No Songs Added Yet!</h4>
                <p>{noSongsMessage}</p>
                <a href="/playlists" className="go-to-playlists-btn">
                  Go to Playlists Page → Add Songs
                </a>
              </div>
              
              <div className="how-to-guide">
                <h5>How to use:</h5>
                <ol>
                  <li>Go to <strong>Playlists</strong> page (link above)</li>
                  <li>Select an emotion (happy, sad, angry, etc.)</li>
                  <li>Search and add YouTube songs</li>
                  <li>Come back here and show facial expressions!</li>
                  <li>AI will play songs matching your emotion</li>
                </ol>
              </div>
            </>
          ) : (
            <div className="no-emotion-detected">
              <p>Enable webcam to get AI music recommendations based on your emotion! 🎭</p>
              <div className="demo-emotions">
                <p>Show different facial expressions:</p>
                <ul>
                  <li>😊 Happy</li>
                  <li>😢 Sad</li>
                  <li>😠 Angry</li>
                  <li>😨 Fearful</li>
                  <li>😐 Neutral</li>
                </ul>
                <p className="note">Make sure you've added songs for these emotions first!</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MusicPlayer;
