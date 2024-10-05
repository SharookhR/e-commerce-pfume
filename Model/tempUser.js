const mongoose = require('mongoose')
const bcrypt = require ('bcrypt') 


const tempUserSchema = new mongoose.Schema({
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

module.exports=mongoose.model("temp", tempUserSchema)