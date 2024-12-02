const { type } = require('express/lib/response')
const mongoose = require('mongoose')

const cartSchema = new mongoose.Schema({
userId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User',
    required:true
},
items : [
    {
        product:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'products',
            required:true
        },
        price: {
            type:Number,
            default:0
        },
        quantity: {
            type:Number,
            required:true,
            min:1,
            max:5
        }
    }
],
discount: {
    type:Number,
    default:0
},
totalPrice: {
    type:Number,
    default:0
}
},{timestamps:true})

module.exports = mongoose.model('Cart', cartSchema)