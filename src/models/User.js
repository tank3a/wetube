import bcrypt from "bcrypt";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: {type:String, required:true, unique:true},
    avatarUrl: {type:String, default:"uploads\\avatars\\39d883d7ac8373f3814b9d64575d87d2"},
    username: {type:String, required:true, unique:true},
    socialLogin: {type:Boolean, default:false},
    name: {type:String, required:true},
    password: String,
    location: String,
    videos: [{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Video",
    }]
})

userSchema.pre("save", async function() {
    if(this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 5);
    }
})
const User = mongoose.model("User", userSchema);

export default User;