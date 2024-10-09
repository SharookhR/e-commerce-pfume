const mongoose = require('mongoose')

const productSchema = mongoose.Schema({
name:{
    type:String,
    required:true
},
images:{
    type:Array,
    required:true
},
price:{
    type:String,
    required:true
},
stock:{
    type:Number,
    required:true
}
})

module.exports= mongoose.model("products", productSchema)