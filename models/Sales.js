const mongoose = require('mongoose');

const SalesSchema = new mongoose.Schema({
    transactionId: String,
    productId: String,
    productName: String,
    price: Number,
    quantity: Number,
    timestamp: Date
});

module.exports = mongoose.model('Sales', SalesSchema);
