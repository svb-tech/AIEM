const {Router}=require("express");
const musicRouter=Router();
const auth=require('../middleware/auth');
const EmotionSession=require('../models/EmotionSession');
const UserPlaylist=require('../models/UserPlaylist');
const { success } = require("zod");


//for apki
musicRouter.get("/search",  async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) {
      return res.status(400).json({ success: false, message: "Query missing" });
    }

    const API_KEY = process.env.YOUTUBE_API_KEY;

    const ytRes = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
        query
      )}&maxResults=10&type=video&key=${API_KEY}`
    );

    const data = await ytRes.json();

    res.json({
      success: true,
      items: data.items || [],
    });
  } catch (error) {
    console.error("YouTube search error:", error);
    res.status(500).json({
      success: false,
      message: "YouTube API failed",
    });
  }
});

musicRouter.get('/recommendations/:emotion',auth,async(req,res)=>{
    try{
        const {emotion}=req.params;
        console.log(`🎵 Fetching music for emotion: ${emotion}`);

         const defaultRecommendations = {happy: [
                { 
                    id: 'tQ0yjYUFKAE', 
                    title: 'Nashe Si Chadh Gayi', 
                    artist: 'Befikre',
                    source: 'youtube'
                },
                { 
                    id: 'yIIGQB6EMAM', 
                    title: 'Kala Chashma', 
                    artist: 'Baar Baar Dekho',
                    source: 'youtube'
                }
            ],
            sad: [
                { 
                    id: 'BddP6PYo2gs', 
                    title: 'Channa Mereya', 
                    artist: 'Ae Dil Hai Mushkil',
                    source: 'youtube'
                }
            ],
            angry: [
                { 
                    id: 'u3V5KDHRQvk', 
                    title: 'Sultan Title Track', 
                    artist: 'Sultan',
                    source: 'youtube'
                }
            ],
            neutral: [
                { 
                    id: 'jfKfPfyJRdk', 
                    title: 'Lofi Hip Hop', 
                    artist: 'Chill Beats',
                    source: 'youtube'
                }
            ]
        };
        //Checking for user playlists
        const userPlaylist=await UserPlaylist.findOne({
            userId:req.userId,
            emotion:emotion
        });
        let songs;
        let source='default';
        
        if(userPlaylist && userPlaylist.songs.length>0)
        {
            songs=userPlaylist.songs;
            source='custom';
            console.log(`🎵 Using custom playlist for ${emotion}`);
        }
        else{
             songs = defaultRecommendations[emotion] || defaultRecommendations.neutral;
            console.log(`🎵 Using default recommendations for ${emotion}`);
        }
        
        res.json({
            success:true,
            songs,
            emotion,
            source,
            totalSongs:songs.length
        })
    }
    catch(error)
    {
        console.error('Error fetching music:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching music recommendations',
            error: error.message
        });  
    }
})

musicRouter.post('/save-played',auth,async(req,res)=>{
    try{
        const {songId,title,artist,emotion}=req.body;
        
         console.log(`💾 Saving played song: ${title}`);

         const session=await EmotionSession.findOne({
            userId:req.userId,
            sessionEnd:{$exists:false}
         });
         
         if(session){
            session.musicPlayed.push({
                songId,
                title,
                artist,
                emotion
            });
            await session.save();
         
          res.json({
            success: true,
            message: 'Music play saved successfully'
        });}
        else{
             res.json({
            success: false,
            message: 'Session ended'
        });
        }
    }
    catch(error)
    {
          console.error('Error saving music play:', error);
           res.status(500).json({
            success: false,
            message: 'Error saving music play',
            error: error.message
        });
    }
});
module.exports=musicRouter;