require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const csvParser = require('csv-parser');
const fs = require('fs');
const path = require('path');
const cron = require('node-cron');
const Sales = require('./models/Sales');
const Report = require('./models/Report');

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Middleware
app.use(express.json());

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('✅ MongoDB Connected'))
    .catch(err => console.error('❌ MongoDB Connection Error:', err));

// ✅ Multer Storage Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = './uploads/';
        if (!fs.existsSync(dir)) fs.mkdirSync(dir);
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

// ✅ API to Upload CSV File
app.post('/upload', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded. Ensure key is "file".' });
        }

        const filePath = req.file.path;
        const salesData = [];

        fs.createReadStream(filePath)
            .pipe(csvParser())
            .on('data', (row) => {
                // Ensure required fields exist
                if (row.transactionId && row.productId && row.price && row.quantity && row.timestamp) {
                    salesData.push({
                        transactionId: row.transactionId.toString(),
                        productId: row.productId.toString(),
                        productName: row.productName || 'Unknown Product',
                        price: parseFloat(row.price),
                        quantity: parseInt(row.quantity, 10),
                        timestamp: new Date(row.timestamp)
                    });
                }
            })
            .on('end', async () => {
                try {
                    if (salesData.length === 0) {
                        return res.status(400).json({ error: 'CSV file is empty or invalid.' });
                    }

                    await Sales.insertMany(salesData);
                    res.json({ message: '✅ CSV uploaded and processed successfully' });
                } catch (error) {
                    console.error('❌ Database Error:', error);
                    res.status(500).json({ error: 'Database error while inserting records.' });
                }
                fs.unlinkSync(filePath); // Remove file after processing
            });
    } catch (error) {
        console.error('❌ Multer Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// ✅ API to Generate and Save Report
app.get('/generate-report', async (req, res) => {
    try {
        const aggregatedData = await Sales.aggregate([
            {
                $group: {
                    _id: "$productId", // Group by productId
                    totalSales: { $sum: { $multiply: ["$price", "$quantity"] } },
                    totalQuantity: { $sum: "$quantity" },
                    productName: { $first: "$productName" }
                }
            },
            {
                $project: {
                    _id: 0, // Avoid MongoDB ObjectId issue
                    productId: "$_id", // Rename _id to productId for clarity
                    totalSales: 1,
                    totalQuantity: 1,
                    productName: 1
                }
            }
        ]);

        if (aggregatedData.length === 0) {
            return res.status(404).json({ error: 'No sales data available for report generation.' });
        }

        const report = new Report({
            date: new Date(),
            sales: aggregatedData
        });

        await report.save();

        res.json({ message: '✅ Report generated and saved successfully!', report });
    } catch (error) {
        console.error('❌ Error generating report:', error);
        res.status(500).json({ error: 'Could not generate report', details: error.message });
    }
});

// ✅ API to Retrieve Sales Reports
app.get('/report', async (req, res) => {
    try {
        const reports = await Report.find().sort({ date: -1 });
        res.json(reports);
    } catch (error) {
        console.error('❌ Error retrieving reports:', error);
        res.status(500).json({ error: 'Could not retrieve reports' });
    }
});

// ✅ Scheduled Job to Generate Daily Report at Midnight
cron.schedule('0 0 * * *', async () => {
    try {
        console.log('🕛 Running scheduled job: Generating daily sales report...');
        const aggregatedData = await Sales.aggregate([
            {
                $group: {
                    _id: "$productId",
                    totalSales: { $sum: { $multiply: ["$price", "$quantity"] } },
                    totalQuantity: { $sum: "$quantity" },
                    productName: { $first: "$productName" }
                }
            },
            {
                $project: {
                    _id: 0,
                    productId: "$_id",
                    totalSales: 1,
                    totalQuantity: 1,
                    productName: 1
                }
            }
        ]);

        if (aggregatedData.length > 0) {
            const report = new Report({
                date: new Date(),
                sales: aggregatedData
            });

            await report.save();
            console.log('✅ Daily sales report generated and saved!');
        } else {
            console.log('⚠️ No sales data available for today.');
        }
    } catch (error) {
        console.error('❌ Scheduled job error:', error);
    }
}, {
    timezone: "UTC" // Adjust timezone if needed
});

// ✅ Start the Server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
