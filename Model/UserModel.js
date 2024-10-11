const mongoose = require('mongoose')
const bcrypt = require('bcrypt');
const { type } = require('express/lib/response');
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
    isBlocked:{
        type:Boolean,
        default:false
    }

})

userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports= mongoose.model("User", userSchema)