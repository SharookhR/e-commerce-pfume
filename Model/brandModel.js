const mongoose = require('mongoose')

const brandSchema = new mongoose.Schema({
    brandName:{
        type:String,
        require:true
    },
    description:{
        type:String,
        require:true
    },
    isBlocked:{
        type:Boolean,
        default:false
    }
},{timestamps:true})

module.exports = mongoose.model("Brands", brandSchema)