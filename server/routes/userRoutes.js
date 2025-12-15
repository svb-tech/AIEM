const { Router } = require("express");
const userRouter = Router();
const UserPlaylist = require("../models/UserPlaylist");
const auth = require("../middleware/auth");

//get all user playlists
userRouter.get("/playlists", auth, async (req, res) => {
  try {
    console.log("apihitget");
    const playlists = await UserPlaylist.find({ userId: req.userId });

    const playlistByEmotion = {};
    const emotions = [
      "happy",
      "sad",
      "angry",
      "fearful",
      "disgusted",
      "surprised",
      "neutral",
    ];

    emotions.forEach((emotion) => {
      playlistByEmotion[emotion] =
        playlists.find((p) => p.emotion == emotion) || null;
    });
    res.json({
      success: true,
      playlists: playlistByEmotion,
    });
  } catch (error) {
    console.error("Error  fetching playlists", error);
    res.status(500).json({
      success: false,
      message: "Error fetching playlists",
      error: error.message,
    });
  }
});

//GEt playlist by emotion

userRouter.get("/playlists/emotion/:emotion",auth,async(req,res)=>{
  try{
    const playlist=await UserPlaylist.findOne(
      {
        userId:req.userId,
        emotion:req.params.emotion
      }
    );

    
      res.json({
        success:true,
        playlist,
        message:playlist?"Playlist found" : "No playlist for this emotion"
      })
  }
  catch(error){
    console.error('error in feteching playlist',error);
  }
})
//create playlist
userRouter.post("/playlists/emotion", auth, async (req, res) => {
  try {
    const { emotion, songs, playlistName } = req.body;
    if (!emotion) {
      return res.status(400).json({
        success: false,
        message: "Emotion is required",
      });
    }
    let playlist = await UserPlaylist.findOne({
      userId: req.userId,
      emotion: emotion,
    });

    if (playlist) {
      const existingSongIds = new Set(
        playlist.songs.map((song) => song.id || song._id)
      );
      const newSongs = songs.filter(
        (song) => !existingSongIds.has(song.id || song._id)
      );
      playlist.songs = [...playlist.songs, ...newSongs];
      if (playlistName) playlist.playlistName = playlistName;
    } else {
      playlist = new UserPlaylist({
        userId: req.userId,
        emotion: emotion,
        songs: songs,
        playlistName: playlistName,
      });
    }
    await playlist.save();
    res.json({
      success: true,
      message: "Playlist updated",
      playlist: playlist,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error updating playlists",
      error: error.message,
    });
  }
});
//add songs to playlist
userRouter.post("/playlists/:playlistId/songs", auth, async (req, res) => {
  try {
    const { songs } = req.body;

    if (!songs || !Array.isArray(songs)) {
      return res.status(400).json({
        success: false,
        message: "Songs array is required",
      });
    }
    const playlist = await UserPlaylist.findOne({
      _id: req.params.playlistId,
      userId: req.userId,
    });
    if (!playlist) {
      return res.status(404).json({
        success: false,
        message: "Playlist not found",
      });
    }
    const existingSongIds = new Set(
      playlist.songs.map((song) => song.id || song._id)
    );
    const newSongs = songs.filter(
      (song) => !existingSongIds.has(song.id || song._id)
    );
    playlist.songs = [...playlist.songs, ...newSongs];
    await playlist.save();
    res.json({
      success: true,
      message: "Songs added successfully",
      addedCount: newSongs.length,
      playlist: playlist,
    });
  } catch (error) {
    console.error("Error adding songs", error);
    res.status(500).json({
      success: false,
      message: "Error adding songs to playlist",
      error: error.message,
    });
  }
});

//remove songs
userRouter.delete(
  "/playlists/emotion/:emotion/songs",
  auth,
  async (req, res) => {
    try {
      console.log("apihit");
      console.log("REQ BODY 👉", req.body);

      const { emotion } = req.params;

      // ✅ SAFE destructuring
      const { songIds = [] } = req.body || {};

      if (!Array.isArray(songIds) || songIds.length === 0) {
        return res.status(400).json({
          success: false,
          message: "songIds array is required",
        });
      }

      const playlist = await UserPlaylist.findOne({
        userId: req.userId,
        emotion,
      });

      if (!playlist) {
        return res.status(404).json({
          success: false,
          message: "Playlist not found",
        });
      }

      playlist.songs = playlist.songs.filter(
        (s) =>
          !songIds.includes(
            (s.id || s._id).toString()
          )
      );

      await playlist.save();

      res.json({
        success: true,
        message: "Songs removed",
        playlist,
      });
    } catch (error) {
      console.error("Problem in deletion", error);
      res.status(500).json({
        success: false,
        message: "Deletion failed",
        error: error.message,
      });
    }
  }
);

module.exports = userRouter;
