const mongoose = require('mongoose')
const bcrypt = require('bcrypt');
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:function (){
            return !this.googleId;
        }
    },
    password:{
        type:String,
        required:function (){
            return !this.googleId;
        }
    },
    isAdmin:{
        type:Number,
        default:0
    },
    isBlocked:{
        type:Boolean,
        default:false
    },
    googleId:{
        type:String
    }

},{timestamps:true})

userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports= mongoose.model("User", userSchema)