const mongoose = require('mongoose');
const seedAdminUser = require('../utils/seedAdmin');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[My E-commerce DB] MongoDB Connected: ${conn.connection.host}`);
    // Auto seed exclusive Admin user
    await seedAdminUser();
  } catch (error) {
    console.error(`[My E-commerce DB Error]: Could not connect to MongoDB.`);
    console.error(`[Reason]: ${error.message}`);
    console.error(`[Tip]: Please ensure your local MongoDB service is running or set your MongoDB Atlas connection string in backend/.env`);
  }
};

module.exports = connectDB;
