// import React, { useState } from "react";
// import "./Playlists.css";
// import Navbar from "./navbar";

// const emotions = [
//   "happy",
//   "sad",
//   "angry",
//   "fearful",
//   "disgusted",
//   "surprised",
//   "neutral",
// ];

// const Playlists = () => {
//   const [playlists, setPlaylists] = useState({
//     happy: [],
//     sad: [],
//     angry: [],
//     fearful: [],
//     disgusted: [],
//     surprised: [],
//     neutral: [],
//   });

//   const [selectedEmotion, setSelectedEmotion] = useState("happy");
//   const [query, setQuery] = useState("");
//   const [results, setResults] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const API_KEY = "AIzaSyC65mkaclFemriNMOlG3459ajvARi3D_78";

//   const searchYouTube = async () => {
//     console.log(query);
//     if (!query.trim()) return;

//     setLoading(true);
//     setResults([]);

//     try {
//       const res = await fetch(
//         `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&maxResults=10&type=video&key=${API_KEY}`
//       );

//       const data = await res.json();
//       setResults(data.items || []);
//       console.log(data.items);
//     } catch (err) {
//       console.error("YouTube Error:", err);
//     }

//     setLoading(false);
//   };

//   const addSong = (video) => {
//     const exists = playlists[selectedEmotion].some(
//       (item) => item.videoId === video.id.videoId
//     );
//     if (exists) return;

//     const newSong = {
//       id: Date.now(),
//       title: video.snippet.title,
//       channel: video.snippet.channelTitle,
//       thumbnail: video.snippet.thumbnails.medium.url,
//       videoId: video.id.videoId,
//     };

//     setPlaylists((prev) => {
//       const updated = { ...prev };
//       updated[selectedEmotion] = [...prev[selectedEmotion], newSong];
//       return updated;
//     });
//   };

//   const removeSong = (emotion, songId) => {
//     setPlaylists((prev) => {
//       const updated = { ...prev };
//       updated[emotion] = prev[emotion].filter((song) => song.id !== songId);
//       return updated;
//     });
//   };

//   return (
//     <>
//       <Navbar />
//       <div className="playlist-page">
//         <h1>Custom Playlists</h1>

//         {/* Emotion Selector */}
//         <div className="emotion-box">
//           <label>Select Emotion:</label>
//           <select
//             value={selectedEmotion}
//             onChange={(e) => setSelectedEmotion(e.target.value)}
//           >
//             <option key="happy">HAPPY</option>
//             <option key="sad">SAD</option>
//             <option key="angry">ANGRY</option>
//             <option key="fearful">FEARFUL</option>
//             <option key="disgusted">DISGUSTED</option>
//             <option key="surprised">SURPRISED</option>
//             <option key="neutral">NEUTRAL</option>
//           </select>
      
//         </div>

//         {/* Search Box */}
//         {/* <div className="search-box">
//           <input
//             placeholder="Search YouTube videos..."
//             value={query}
//             onChange={(e) => setQuery(e.target.value)}
//           />
//           <button onClick={searchYouTube}>
//             {loading ? "Searching..." : "Search"}
//           </button>
//         </div> */}


//         <div className="search-box">
//           <input
//           placeholder="Search YouTube videos..."
//           value={query}
//           onChange={(e)=>setQuery(e.target.value)}
//           // console.log()
//           />
//           <button onClick={searchYouTube}>{loading?"Searching...":"Search"}</button>

//            </div>

//         {/* Search Results */}
//         <div className="results">
//           {results.map((video) => (
//             <div key={video.id.videoId} className="result-card">
//               <img
//                 src={video.snippet.thumbnails.medium.url}
//                 className="thumb"
//                 alt="thumb"
//               />

//               <div className="info">
//                 <h4>{video.snippet.title}</h4>
//                 <p>{video.snippet.channelTitle}</p>
//               </div>

//               <button
//                 className="add-btn"
//                 onClick={() => addSong(video)}
//                 disabled={playlists[selectedEmotion].some(
//                   (s) => s.videoId === video.id.videoId
//                 )}
//               >
//                 {playlists[selectedEmotion].some(
//                   (s) => s.videoId === video.id.videoId
//                 )
//                   ? "✓"
//                   : "+"}
//               </button>
//             </div>
//           ))}
//         </div>

//         {/* Playlists */}
//         <h2>Emotion Playlists</h2>

//         {emotions.map((emo) => (
//           <div key={emo} className="emotion-section">
//             <div className="emotion-header">
//               <span>{emo.toUpperCase()}</span>
//               <span className="emotion-count">
//                 {playlists[emo].length} songs
//               </span>
//             </div>

//             {playlists[emo].length === 0 ? (
//               <div className="empty-playlist">
//                 <div className="empty-icon">🎵</div>
//                 <p>No songs added to this playlist yet</p>
//               </div>
//             ) : (
//               <table className="playlist-table">
//                 <thead>
//                   <tr>
//                     <th>#</th>
//                     <th>Thumbnail</th>
//                     <th>Song Info</th>
//                     <th>Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {playlists[emo].map((song, index) => (
//                     <tr key={song.id}>
//                       <td className="song-number">{index + 1}</td>
//                       <td>
//                         <img
//                           src={song.thumbnail}
//                           alt="thumb"
//                           className="table-thumbnail"
//                         />
//                       </td>
//                       <td className="table-info">
//                         <h4>{song.title}</h4>
//                         <p>{song.channel}</p>
//                       </td>
//                       <td>
//                         <div className="table-actions">
//                           <a
//                             href={`https://www.youtube.com/watch?v=${song.videoId}`}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             className="watch-btn"
//                           >
//                             ▶ Watch
//                           </a>
//                           <button
//                             onClick={() => removeSong(emo, song.id)}
//                             className="remove-btn"
//                           >
//                             🗑 Remove
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             )}
//           </div>
//         ))}
//       </div>
//     </>
//   );
// };

// export default Playlists;

import React, { useState, useEffect } from "react";
import "./Playlists.css";
import Navbar from "./Navbar";
import { playlistService } from "../services/playlistService";
import { useAuth } from "../context/AuthContext"; // Path adjust karo

const emotions = [
  "happy",
  "sad",
  "angry",
  "fearful",
  "disgusted",
  "surprised",
  "neutral",
];

const Playlists = () => {
  const { isAuthenticated } = useAuth();
  const [playlists, setPlaylists] = useState({
    happy: [],
    sad: [],
    angry: [],
    fearful: [],
    disgusted: [],
    surprised: [],
    neutral: [],
  });

  const [selectedEmotion, setSelectedEmotion] = useState("happy");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  

  // Fetch playlists from backend
  useEffect(() => {
    if (isAuthenticated) {
      fetchPlaylists();
    }
  }, [isAuthenticated]);

  const fetchPlaylists = async () => {
    setIsFetching(true);
    try {
      const response = await playlistService.getPlaylists();
      console.log("🎵 Backend Response:", response);
      
      if (response.success && response.playlists) {
        // Transform backend data to frontend format
        const newPlaylists = { ...playlists };
        
        emotions.forEach(emotion => {
          if (response.playlists[emotion] && response.playlists[emotion].songs) {
            newPlaylists[emotion] = response.playlists[emotion].songs.map(song => ({
              id: song.id || song._id || song.videoId,
              title: song.title,
              channel: song.channel,
              thumbnail: song.thumbnail,
              videoId: song.videoId || song.id
            }));
          } else {
            newPlaylists[emotion] = [];
          }
        });
        
        setPlaylists(newPlaylists);
      } else {
        console.log("No playlists found or error:", response.message);
      }
    } catch (error) {
      console.error("Error fetching playlists:", error);
    } finally {
      setIsFetching(false);
    }
  };

  // YouTube search function - SAME AS BEFORE
  const searchYouTube = async () => {
  if (!query.trim()) return;

  setLoading(true);
  setResults([]);

  try {
    const res = await fetch(`/api/music/search?q=${query}`);
    const data = await res.json();

    if (data.success) {
      setResults(data.items || []);
    }
  } catch (err) {
    console.error("YouTube Error:", err);
  }

  setLoading(false);
};


 // Add song to playlist WITH backend sync & auth handling
const addSong = async (video) => {
    if (!isAuthenticated) {
    alert("⚠️ Please login first to add songs!");
    return;
  }

  const exists = playlists[selectedEmotion].some(
    (item) => item.videoId === video.id.videoId
  );
  if (exists) return;

  const newSong = {
    id: video.id.videoId,
    title: video.snippet.title,
    channel: video.snippet.channelTitle,
    thumbnail: video.snippet.thumbnails.medium.url,
    videoId: video.id.videoId,
  };

  setPlaylists((prev) => {
    const updated = { ...prev };
    updated[selectedEmotion] = [...prev[selectedEmotion], newSong];
    return updated;
  });

  setIsSaving(true);
  try {
    const response = await playlistService.createOrUpdatePlaylist(
      selectedEmotion,
      [newSong],
      `${selectedEmotion.charAt(0).toUpperCase() + selectedEmotion.slice(1)} Playlist`
    );

    console.log("✅ Backend save response:", response);

    if (response.authError) {
      alert(response.message); // "Please login first"
      return;
    }

    if (!response.success) {
      console.warn("Backend save failed:", response.message);
    }
  } catch (error) {
    console.error("Error saving to backend:", error);
  } finally {
    setIsSaving(false);
  }
};

// Remove song from playlist WITH backend sync & auth handling
const removeSong = async (emotion, songId) => {
  const songToRemove = playlists[emotion].find((s) => s.id === songId);

  setPlaylists((prev) => {
    const updated = { ...prev };
    updated[emotion] = prev[emotion].filter((song) => song.id !== songId);
    return updated;
  });

  if (songToRemove) {
    try {
      const response = await playlistService.removeSongsFromPlaylist(
        emotion,
        [songToRemove.id || songToRemove.videoId]
      );

      console.log("🗑 Backend remove response:", response);

      if (response.authError) {
        alert(response.message); // "Please login first"
        fetchPlaylists(); // refresh to avoid local-state mismatch
        return;
      }

      if (!response.success) {
        console.warn("Backend removal failed:", response.message);
        fetchPlaylists(); // refresh from server
      }
    } catch (error) {
      console.error("Error removing from backend:", error);
    }
  }
};


  // Save entire playlist to backend (Optional button)
  const savePlaylist = async (emotion) => {
      if (!isAuthenticated) {
    alert("⚠️ Please login first to add songs!");
    return;
  }

    if (playlists[emotion].length === 0) return;
    
    setIsSaving(true);
    try {
      const response = await playlistService.createOrUpdatePlaylist(
        emotion,
        playlists[emotion],
        `${emotion.charAt(0).toUpperCase() + emotion.slice(1)} Playlist`
      );
      
      console.log(`✅ ${emotion} playlist saved:`, response);
      
      if (response.success) {
        alert(`${emotion.toUpperCase()} playlist saved successfully!`);
      } else {
        alert(`Failed to save: ${response.message}`);
      }
    } catch (error) {
      console.error("Save error:", error);
      alert("Failed to save playlist");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="playlist-page">
        <h1>Custom Playlists</h1>
        
        {isFetching && (
          <div className="loading-message">
            Loading playlists from server...
          </div>
        )}

        {/* Emotion Selector */}
        <div className="emotion-box">
          <label>Select Emotion:</label>
          <select
            value={selectedEmotion}
            onChange={(e) => setSelectedEmotion(e.target.value)}
          >
            <option value="happy">HAPPY</option>
            <option value="sad">SAD</option>
            <option value="angry">ANGRY</option>
            <option value="fearful">FEARFUL</option>
            <option value="disgusted">DISGUSTED</option>
            <option value="surprised">SURPRISED</option>
            <option value="neutral">NEUTRAL</option>
          </select>
          
          <button 
            onClick={() => savePlaylist(selectedEmotion)}
            disabled={isSaving || playlists[selectedEmotion].length === 0}
            style={{marginLeft: '10px', padding: '5px 10px'}}
          >
            {isSaving ? "Saving..." : "💾 Save"}
          </button>
        </div>

        {/* Search Box */}
        <div className="search-box">
          <input
            placeholder="Search YouTube videos..."
            value={query}
            onChange={(e)=>setQuery(e.target.value)}
          />
          <button onClick={searchYouTube}>{loading?"Searching...":"Search"}</button>
        </div>

        {/* Search Results */}
        <div className="results">
          {results.map((video) => (
            <div key={video.id.videoId} className="result-card">
              <img
                src={video.snippet.thumbnails.medium.url}
                className="thumb"
                alt="thumb"
              />

              <div className="info">
                <h4>{video.snippet.title}</h4>
                <p>{video.snippet.channelTitle}</p>
              </div>

              <button
                className="add-btn"
                onClick={() => addSong(video)}
                disabled={playlists[selectedEmotion].some(
                  (s) => s.videoId === video.id.videoId
                )}
              >
                {playlists[selectedEmotion].some(
                  (s) => s.videoId === video.id.videoId
                )
                  ? "✓"
                  : "+"}
              </button>
            </div>
          ))}
        </div>

        {/* Playlists */}
        <div className="playlists-container">
        <h2>Emotion Playlists</h2>

        {emotions.map((emo) => (
          <div key={emo} className="emotion-section">
            <div className="emotion-header">
              <span>{emo.toUpperCase()}</span>
              <span className="emotion-count">
                {playlists[emo].length} songs
              </span>
              
            </div>

            {playlists[emo].length === 0 ? (
              <div className="empty-playlist">
                <div className="empty-icon">🎵</div>
                <p>No songs added to this playlist yet</p>
              </div>
            ) : (
              <table className="playlist-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Thumbnail</th>
                    <th>Song Info</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {playlists[emo].map((song, index) => (
                    <tr key={song.id}>
                      <td className="song-number">{index + 1}</td>
                      <td>
                        <img
                          src={song.thumbnail}
                          alt="thumb"
                          className="table-thumbnail"
                        />
                      </td>
                      <td className="table-info">
                        <h4>{song.title}</h4>
                        <p>{song.channel}</p>
                      </td>
                      <td>
                        <div className="table-actions">
                          <a
                            href={`https://www.youtube.com/watch?v=${song.videoId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="watch-btn"
                          >
                            ▶ Watch
                          </a>
                          <button
                            onClick={() => removeSong(emo, song.id)}
                            className="remove-btn"
                          >
                            🗑 Remove
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
         
        ))}
         </div>
      </div>
    </>
  );
};

export default Playlists;