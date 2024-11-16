const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    brandName: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Brands",
        required: true
    },
    isPublished:{
        type:Boolean,
        default:true
    },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'categories',
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
        default:false
    },
    stock: {
        type: Number,
        required: true
    },
    offerPrice: {
        type: Number,
      },
      offerPercentage: {
        type: Number,
      },
      offerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Offer",
        default: null,
      },
      isDiscounted: {
        type: Boolean,
        default: false,
      },
    
},{timestamps:true})


productSchema.pre("save", function (next) {
    if (this.offerId) {
       this.offerPrice = Math.floor(this.price - (this.price * this.offerPercentage / 100))
    }else{
      this.offerPrice=0
    }
    next();
  });

module.exports = mongoose.model("products", productSchema)