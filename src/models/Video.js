import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
    title: {type: String, trim:true, required:true, maxLength:20},
    description: {type: String, trim:true, required:true, maxLength:140},
    createdAt: {type:Date, required:true, default:Date.now},
    hashtags: [{type: String, trim:true}],
    meta: {
        views: {type: Number, default:0, required:true},
        ratings: {type: Number, default:0, required:true},
    },
});

const Video = mongoose.model("Video", videoSchema);
export default Video;