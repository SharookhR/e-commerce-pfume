const { type } = require('express/lib/response')
const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    isBlocked:{
        type:Boolean,
        default:false
    }
},{timestamps:true})

module.exports = mongoose.model("categories",categorySchema)