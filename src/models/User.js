import bcrypt from "bcrypt";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: {type:String, required:true, unique:true},
    avatarUrl: String,
    username: {type:String, required:true, unique:true},
    socialLogin: {type:Boolean, default:false},
    name: {type:String, required:true},
    password: String,
    location: String,
})

userSchema.pre("save", async function() {
    this.password = await bcrypt.hash(this.password, 5);
})
const User = mongoose.model("user", userSchema);

export default User;