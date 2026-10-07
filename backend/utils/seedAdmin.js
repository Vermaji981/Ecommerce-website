const User = require('../models/User');

const seedAdminUser = async () => {
  try {
    const adminEmail = (process.env.ADMIN_EMAIL || 'hv0563163@gmail.com').toLowerCase();
    const adminPassword = process.env.ADMIN_PASSWORD || '123456789';
    const adminName = process.env.ADMIN_NAME || 'Happy Verma (Super Admin)';

    // Demote any other accounts that were incorrectly set to admin role
    await User.updateMany(
      { email: { $ne: adminEmail }, role: 'admin' },
      { role: 'customer' }
    );

    const adminUser = await User.findOne({ email: adminEmail });

    if (!adminUser) {
      console.log(`[Admin Seeder] Seeding exclusive Super Admin account (${adminEmail})...`);
      await User.create({
        name: adminName,
        email: adminEmail,
        password: adminPassword, // Password pre-save hook automatically hashes with bcrypt
        role: 'admin',
        isVerified: true,
        isActive: true,
        phone: '+91 98765 43210'
      });
      console.log(`[Admin Seeder] Exclusive Admin (${adminEmail}) created successfully!`);
    } else {
      // Ensure password and role match the admin credentials
      adminUser.name = adminName;
      adminUser.password = adminPassword;
      adminUser.role = 'admin';
      adminUser.isVerified = true;
      adminUser.isActive = true;
      await adminUser.save();
      console.log(`[Admin Seeder] Exclusive Admin (${adminEmail}) credentials verified & updated!`);
    }
  } catch (error) {
    console.error(`[Admin Seeder Error]: ${error.message}`);
  }
};

module.exports = seedAdminUser;
