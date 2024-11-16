const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  balance: { type: Number, default: 0 },
  transactions: [
    {
      type: { type: String, enum: ['purchase', 'refund', 'add_money'], required: true },
      amount: { type: Number, required: true },
      date: { type: Date, default: Date.now },
      description: { type: String },
      orderId: { type: String }
    }
  ]
});

module.exports = mongoose.model('Wallet', walletSchema);
