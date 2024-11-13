const mongoose =require('mongoose')

const resetPassSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    otp:{
        type:String,
        default:null
    },
    otpExpiresAt:{
        type: Date,
        default: Date.now
    },
    createdAt:{
        type: Date,
        default:Date.now,
        expires: 300
    },
    lastOtp:{
        type:Date,
        default:Date.now
    }
})

module.exports=mongoose.model("passreset", resetPassSchema)