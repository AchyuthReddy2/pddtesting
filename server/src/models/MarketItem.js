const mongoose = require('mongoose');

const schema = new mongoose.Schema(
  {
    title: String,
    price: String,
    seller: String,
    place: String,
    phone: String,
    icon: { type: String, default: 'pricetag' },
    tag: String,
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('MarketItem', schema);
