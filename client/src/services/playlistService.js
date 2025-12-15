// services/playlistService.js
import { api } from "./api";

export const playlistService = {
  // Get all user playlists organized by emotion
  getPlaylists: async () => {
    try {
      const response = await api.get("/user/playlists");
      console.log("🎵 PLAYLISTS RESPONSE:", response);
      
      // DIRECT RESPONSE USE KARO - fetch already parsed JSON return karta hai
      return {
        success: response.success,
        playlists: response.playlists || {},
        message: response.message
      };
    } catch (error) {
      console.error("Error fetching playlists:", error);
      return { 
        success: false, 
        playlists: {},
        message: error.message || "Failed to fetch playlists"
      };
    }
  },

  // Get playlist by specific emotion
  getPlaylistByEmotion: async (emotion) => {
    try {
      const response = await api.get(`/user/playlists/emotion/${emotion}`);
      console.log(`🎵 ${emotion} PLAYLIST RESPONSE:`, response);
      
      return {
        success: response.success,
        playlist: response.playlist || null,
        message: response.message || ""
      };
    } catch (error) {
      console.error(`Error fetching ${emotion} playlist:`, error);
      return {
        success: false,
        playlist: null,
        message: error.message || `Failed to fetch ${emotion} playlist`
      };
    }
  },

  // Create or update playlist for an emotion
  createOrUpdatePlaylist: async (emotion, songs, playlistName = null) => {
    try {
      const response = await api.post("/user/playlists/emotion", {
        emotion,
        songs,
        playlistName
      });
      console.log("🎵 CREATE PLAYLIST RESPONSE:", response);

      return {
        success: response.success,
        playlist: response.playlist || null,
        message: response.message || "Playlist updated successfully"
      };
    } catch (error) {
      console.error("Error creating/updating playlist:", error);
      return {
        success: false,
        playlist: null,
        message: error.message || "Failed to update playlist"
      };
    }
  },

  // Add songs to existing playlist
  addSongsToPlaylist: async (playlistId, songs) => {
    try {
      const response = await api.post(`/user/playlists/${playlistId}/songs`, {
        songs
      });

      return {
        success: response.success,
        playlist: response.playlist || null,
        addedCount: response.addedCount || 0,
        message: response.message || "Songs added successfully"
      };
    } catch (error) {
      console.error("Error adding songs to playlist:", error);
      return {
        success: false,
        playlist: null,
        addedCount: 0,
        message: error.message || "Failed to add songs to playlist"
      };
    }
  },

  // Remove songs from playlist by emotion
  removeSongsFromPlaylist: async (emotion, songIds) => {
    try {
      const response = await api.delete(`/user/playlists/emotion/${emotion}/songs`, {
        songIds 
      });

      return {
        success: response.success,
        playlist: response.playlist || null,
        message: response.message || "Songs removed successfully"
      };
    } catch (error) {
      console.error("Error removing songs from playlist:", error);
      return {
        success: false,
        playlist: null,
        message: error.message || "Failed to remove songs from playlist"
      };
    }
  }
};