🚀 Exelon Circuits Sales API
📌 Project Overview
This Node.js-based REST API enables efficient sales data management by supporting:
✅ CSV file uploads containing sales data
✅ Parsing & validating data before storing it in MongoDB
✅ Automated daily sales aggregation (Scheduled Job)
✅ Report generation & retrieval

This project is part of an assessment task for Exelon Circuits.

🛠️ Features
📂 Upload Sales Data via CSV
📊 Aggregate & Store Sales Reports
📅 Scheduled Daily Report Generation (via node-cron)
🛠️ Retrieve Reports using API
🛡️ Error Handling & Validations
📁 Sample CSV Data
Make sure your CSV file follows this structure before uploading:

csv
Copy
Edit
transactionId,productId,productName,price,quantity,timestamp
T1001,P123,Gaming Laptop,2000.00,2,2025-02-09T10:15:30Z
T1002,P456,Wireless Headphones,150.00,5,2025-02-09T11:00:00Z
T1003,P789,Mechanical Keyboard,100.00,3,2025-02-09T12:30:15Z
T1004,P123,Gaming Laptop,2000.00,1,2025-02-09T14:45:00Z
🏗️ Tech Stack
Backend: Node.js, Express.js
Database: MongoDB (Mongoose)
File Upload: Multer
CSV Parsing: csv-parser
Scheduling Jobs: node-cron
🔧 Installation & Setup
📌 Prerequisites
Ensure you have Node.js and MongoDB installed.

🚀 Steps to Run the Project
1️⃣ Clone the repository

sh
Copy
Edit
git clone https://github.com/Stephendsouzaa/Exelon-Circuits-Task.git
cd Exelon-Circuits-Task
2️⃣ Install dependencies

sh
Copy
Edit
npm install
3️⃣ Set up environment variables
Create a .env file in the root directory and add:

ini
Copy
Edit
PORT=3000
MONGO_URI=your_mongodb_connection_string
4️⃣ Start the server

sh
Copy
Edit
node server.js
Your API will run on http://localhost:3000/ 🚀

📌 API Endpoints
Method	Endpoint	Description
POST	/upload	Uploads a CSV file and stores sales data in MongoDB
GET	/generate-report	Aggregates sales and generates a new report
GET	/report	Retrieves all saved reports
📅 Scheduled Job for Automatic Report Generation
A daily sales report is automatically generated every midnight (12:00 AM) using node-cron.

You can manually trigger report generation using /generate-report.
📬 Postman Collection
✅ Exported Postman Collection is included in the repository (postman_collection.json).

Open Postman
Go to File → Import
Select postman_collection.json
