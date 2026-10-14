const dns = require('dns');
try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch (e) {}

const mongoose = require('mongoose');
const seedAdminUser = require('../utils/seedAdmin');
const seedInitialData = require('../utils/seedData');

let isConnected = false;

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }
  try {
    const uri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb+srv://hv0563163_db_user:hYtep4LIxdgnru72@ecommercewebsite.jnm1gl3.mongodb.net/ecommerce?retryWrites=true&w=majority';
    
    console.log('[My E-commerce DB] Connecting to MongoDB Atlas...');
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 15000,
    });
    console.log(`[My E-commerce DB] MongoDB Connected: ${conn.connection.host} / Database: ${conn.connection.name}`);
    
    if (!isConnected) {
      isConnected = true;
      // Auto seed exclusive Admin user to Atlas
      await seedAdminUser();

      // Auto seed categories, products, banners, and coupons to Atlas
      await seedInitialData();
    }
  } catch (error) {
    console.error(`[My E-commerce DB Error]: Could not connect to MongoDB Atlas.`);
    console.error(`[Reason]: ${error.message}`);
    console.error(`[Tip]: Please check your network connection and verify Atlas IP whitelist.`);
  }
};

module.exports = connectDB;
