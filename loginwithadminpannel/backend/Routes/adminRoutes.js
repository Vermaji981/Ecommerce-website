const express = require("express");
const Protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");
const User = require("../models/user");
const Product = require("../models/Product");

const router = express.Router();

// Dashboard Stats Handler
const getDashboardStats = async (req, res) => {
    try {
        const usersCount = await User.countDocuments();
        const customersCount = await User.countDocuments({ role: { $in: ['customer', 'user', 'User'] } });
        const adminsCount = await User.countDocuments({ role: { $in: ['admin', 'Admin'] } });
        
        const productsCount = await Product.countDocuments();
        const productsList = await Product.find().sort({ createdAt: -1 }).limit(6);
        const usersList = await User.find().select("-password").sort({ createdAt: -1 }).limit(6);

        // Calculate total inventory value & category breakdown
        const allProducts = await Product.find();
        let totalValue = 0;
        const categoryBreakdown = {};

        allProducts.forEach(item => {
            const price = Number(item.price) || 0;
            const stock = item.stock !== undefined && item.stock !== null ? Number(item.stock) : 10;
            totalValue += price * stock;

            const cat = item.catogries || item.category || "General";
            categoryBreakdown[cat] = (categoryBreakdown[cat] || 0) + 1;
        });

        const lowStockCount = allProducts.filter(p => (p.stock !== undefined ? p.stock : 10) <= 5).length;
        const outOfStockCount = allProducts.filter(p => (p.stock !== undefined ? p.stock : 10) === 0).length;

        res.json({
            users: usersCount,
            totalCustomers: customersCount,
            totalAdmins: adminsCount,
            products: productsCount,
            orders: 12,
            totalValue: Math.round(totalValue),
            lowStockProducts: lowStockCount,
            outOfStockCount,
            categoryBreakdown,
            recentProducts: productsList,
            recentUsers: usersList,
            recentCustomers: usersList
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// Route aliases for dashboard stats
router.get("/dashboard", Protect, adminOnly, getDashboardStats);
router.get("/deshboard", Protect, adminOnly, getDashboardStats);

// User Management Routes
router.get("/users", Protect, adminOnly, async (req, res) => {
    try {
        const users = await User.find().select("-password").sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.delete("/users/:id", Protect, adminOnly, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put("/users/:id/role", Protect, adminOnly, async (req, res) => {
    try {
        const { role } = req.body;
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { role },
            { new: true }
        ).select("-password");
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
