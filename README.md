# 🚀 Task By Exelon Circuits

## 📌 Project Overview  
This Node.js-based REST API enables efficient **sales data management** by supporting:  
✅ CSV file uploads containing sales data  
✅ **Parsing & validating** data before storing it in MongoDB  
✅ **Automated daily sales aggregation** (Scheduled Job)  
✅ **Report generation & retrieval**  

This project is part of an **assessment task** for **Exelon Circuits**.  

---

## 🛠️ Features  
- **📂 Upload Sales Data** via CSV  
- **📊 Aggregate & Store Sales Reports**  
- **📅 Scheduled Daily Report Generation** (via `node-cron`)  
- **🛠️ Retrieve Reports** using API  
- **🛡️ Error Handling & Validations**  

---

## 📁 Sample CSV Data  
Make sure your CSV file follows this structure before uploading:  

```csv
transactionId,productId,productName,price,quantity,timestamp
T1001,P123,Gaming Laptop,2000.00,2,2025-02-09T10:15:30Z
T1002,P456,Wireless Headphones,150.00,5,2025-02-09T11:00:00Z
T1003,P789,Mechanical Keyboard,100.00,3,2025-02-09T12:30:15Z
T1004,P123,Gaming Laptop,2000.00,1,2025-02-09T14:45:00Z
