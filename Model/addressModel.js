
const { type } = require('express/lib/response')
const mongoose = require('mongoose')

const addressSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        require:true
    },
    addressDetails:[
        {
            name:{
                type:String
            },
            address: {
                type:String
            },
            pincode:{
                type:String
            },
            state: {
                type:String
            },
            city:{
                type:String
            },
            country: {
                type:String
            },
            phone:{
                type:String
            },
            isDefault:{
                type:Boolean,
                default:false

            }
        }
    ]
},{timestamps:true})

module.exports = mongoose.model('Address', addressSchema)