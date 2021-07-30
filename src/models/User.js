import bcrypt from "bcrypt";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: {type:String, required:true, unique:true},
    username: {type:String, required:true, unique:true},
    name: {type:String, required:true},
    password: {type:String, required:true},
    location: {type:String},
})

userSchema.pre("save", async function() {
    this.password = await bcrypt.hash(this.password, 5);
})
const User = mongoose.model("user", userSchema);

export default User;