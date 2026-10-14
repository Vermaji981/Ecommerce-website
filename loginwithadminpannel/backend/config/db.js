const dns = require('dns');
try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch (e) {}

const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        const uri = process.env.MONGODB_URI || process.env.MONGO_URI || "mongodb+srv://hv0563163_db_user:hYtep4LIxdgnru72@ecommercewebsite.jnm1gl3.mongodb.net/ecommerce?retryWrites=true&w=majority";
        await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 10000,
        });

        console.log("[MongoDB Atlas] Database connected successfully");
    } catch(error) {
        console.log("MongoDB connection error:", error.message);
    }
};
module.exports = connectDB;