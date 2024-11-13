const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema({
  couponCode: {
    type: String,
    unique: true,
  },
  discount: {
    type: Number,
    min: 0,
    max: 100,
  },
  expiryDate: {
    type: Date,
  },
  isListed: {
    type: Boolean,
    default: true,
  },
  usedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
  }],
  maxDiscountAmount: {
    type: Number,
    min: 0,
  },
  minPurchaseAmount: {
    type: Number,
    min: 0,
  },
  description: {
    type: String,
  },
}, {timestamps:true});

module.exports = mongoose.model("Coupon", couponSchema);