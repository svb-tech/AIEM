const mongoose=require('mongoose');


const playlistItemSchema=new mongoose.Schema({
    id:{type:String,required:true},
    title:{type:String,required:true},
    artist:{type:String},
    thumbnail:{type:String,default:''},
    source:{type:String,enum: ['youtube', 'spotify', 'custom']}
});

const userPlaylistSchema=new mongoose.Schema({
    userId:{ type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    emotion:{type:String,
        required:true,
     enum: ['happy', 'sad', 'angry', 'fearful', 'disgusted', 'surprised', 'neutral'],
     default:'youtube'    
    },
     playlistName: {
        type: String,
        default: function() {
            return `${this.emotion.charAt(0).toUpperCase() + this.emotion.slice(1)} Playlist`;
        }
    },
    songs:[playlistItemSchema]
},{
timestamps:true
});
userPlaylistSchema.index({ userId: 1, emotion: 1 }, { unique: true });

const UserPlaylist=mongoose.model("UserPlaylist",userPlaylistSchema)
// module.exports={
//     UserPlaylist
// };
module.exports = UserPlaylist;