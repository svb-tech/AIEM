const {Router}=require("express");
const emotionRouter=Router();
const auth=require('../middleware/auth');
const EmotionSession=require('../models/EmotionSession');

emotionRouter.post('/save',auth,async(req,res)=>{
    try{
        const {dominantEmotion,confidence}=req.body
        // console.log(`🎭 Saving emotion: ${dominantEmotion} with confidence: ${confidence}`);

        let session =await EmotionSession.findOne({
            userId:req.userId,
            sessionEnd:{$exists:false}
        });
        if(!session)
        {
            session=new EmotionSession({
                userId:req.userId,
                emotions:[{
                    // emotion:dominantEmotion,
                    confidence:confidence,
                    dominantEmotion:dominantEmotion
                }]
            })
        }
        else{
            session.emotions.push({
                 emotion:dominantEmotion,
                    confidence:confidence,
                    dominantEmotion:dominantEmotion
            });
        }

        await session.save();
        res.json({
            success: true,
            message: 'Emotion data saved successfully',
            sessionId: session._id
        });
    }
    catch(error)
    {
   console.error('Error saving emotion:', error);
        res.status(500).json({
            success: false,
            message: 'Error saving emotion data',
            error: error.message
        });
    }
});

emotionRouter.get('/history',auth,async(req,res)=>{
    try{
const sessions=await EmotionSession.find({userId:req.userId})
.sort({sessionStart:-1})
.limit(10);

res.json({
    success:true,
    sessions,
    totalSessions:sessions.length
})
    }
   catch (error) {
        console.error('Error fetching emotion history:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching emotion history',
            error: error.message
        });
    }
})

module.exports=emotionRouter