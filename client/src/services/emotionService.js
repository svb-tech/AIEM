import {api} from './api';

export const emotionService={
    //save emotion data to backend 
    saveEmotion:async(emotionData)=>{
        try{
            // console.log('saving emotion data',{
            //     dominantEmotion:emotionData.dominantEmotion,
            //     confidence:emotionData.confidence
            // });

            const response=await api.post('/emotions/save',emotionData);

            return response;
        }
        catch(error){
            console.error('Error saving data',error);
        }
    },

    //get emtoion history
    getEmotionHistory:async ()=>{
        try{
            const response=await api.get('/emotions/history');
            return response;
        }catch(error)
        {
            console.error(error);
        }
    },

    getRecommendation:async (emotion)=>{
     try{
        const response=await api.get(`/music/recommendations/${emotion}`);
        return response;
    }catch(error){
        console.error('Error fetching recommendataion:',error);
        throw error;
    }
},
//saved  played song

savePlayedSong:async(playData)=>{
    try{
        const response=await api.post('/music/save-played',playData);
        return response;
    }catch(error)
    {
        console.error('Error saving song play',error);
        throw error;
    }
}

};