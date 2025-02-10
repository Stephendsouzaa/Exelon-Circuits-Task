const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
    date: { type: Date, default: Date.now },
    sales: [{
        productId: String,
        productName: String,
        totalSales: Number,
        totalQuantity: Number
    }]
});

module.exports = mongoose.model('Report', ReportSchema);
