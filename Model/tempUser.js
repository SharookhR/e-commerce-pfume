const mongoose = require('mongoose')
const bcrypt = require ('bcrypt') 


const userSchema = new mongoose.Schema({
    name: {
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    phone:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    isAdmin:{
        type:Number,
        default:0
    },
    otp:{
        type:String,
        default:null
    },
    otpExpiredAt:{
        type: Date,
        default: Date.now
    },
    createdAt:{
        type: Date,
        default:Date.now,
        expires: 300
    }

})
const User = mongoose.model("User", userSchema)

module.exports=User