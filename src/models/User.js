import bcrypt from "bcrypt";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: {type:String, required:true, unique:true},
    avatarUrl: {type:String, default:"uploads\\avatars\\default_avatar.png"},
    username: {type:String, required:true, unique:true},
    socialLogin: {type:Boolean, default:false},
    name: {type:String, required:true},
    password: String,
    location: String,
    videos: [{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Video",
    }],
    comments: [{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Comment",
    }]
})

userSchema.pre("save", async function() {
    if(this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 5);
    }
})
const User = mongoose.model("User", userSchema);

export default User;