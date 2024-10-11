const mongoose = require('mongoose')
const { brands } = require('../Controller/adminController')

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    brandname: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Brand",
        required: true
    },
    isPublished:{
        type:Boolean,
        default:true
    },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'category',
        require:true
    },
    images: {
        type: Array,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    isBlocked:{
        type:Boolean,
        required:true,
        default:false
    },
    stock: {
        type: Number,
        required: true
    },
    
},{timestamps:true})

module.exports = mongoose.model("products", productSchema)