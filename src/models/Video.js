import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
    title: {type: String, trim:true, required:true, maxLength:20},
    description: {type: String, trim:true, required:true, maxLength:140},
    fileUrl: {type:String, trim:true, required:true},
    createdAt: {type:Date, required:true, default:Date.now},
    hashtags: [{type: String, trim:true}],
    meta: {
        views: {type: Number, default:0, required:true},
        ratings: {type: Number, default:0, required:true},
    },
    owner: {type:mongoose.Schema.Types.ObjectId, required:true, ref:"User"}
});

videoSchema.static("formatHashtags", function(hashtags) {
    return hashtags.trim().split(/\s*,\s*/g).map((word) => (word.startsWith('#') ? word : `#${word}`));
})

const Video = mongoose.model("Video", videoSchema);
export default Video;