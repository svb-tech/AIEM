const mongoose=require('mongoose')

const emotionDataSchema=new mongoose.Schema({
    timestamp:{
        type:Date,
        default:Date.now
    },
    // emotion:{
    //     type:String,
    //     required:true
    // },
    confidence:{
        type:Number,
        required:true
    },
    dominantEmotion:{
        type:String,
        required:true
    }
});

const musicPlaySchema=new mongoose.Schema({
    songId:String,
    title:String,
    artist:String,
    emotion:String,
    playedAt:{
        type:Date,
        default:Date.now
    }
});

const emotionSessionSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    emotions:[emotionDataSchema],
    musicPlayed:[musicPlaySchema],
    sessionStart:{
        type:Date,
        default:Date.now
    },
    sessionEnd:Date,
    duration:Number
},{
    timestamps:true
});

const EmotionSession=mongoose.model("EmotionSession",emotionSessionSchema);

module.exports = EmotionSession;
