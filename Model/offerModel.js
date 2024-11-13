const mongoose = require("mongoose");

const offerSchema = new mongoose.Schema(
  {
    offerName: {
      type: String,
      required: true,
    },
    offerType: {
      type: String,
      required: true,
      enum: ["product", "category"],
    },
    discountPercentage: {
      type: Number,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    applicableProducts: [
      { type: mongoose.Schema.Types.ObjectId, ref: "products" },
    ],
    applicableCategories: [
      { type: mongoose.Schema.Types.ObjectId, ref: "categories" },
    ],
    isListed: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);


module.exports = mongoose.model("Offer", offerSchema);