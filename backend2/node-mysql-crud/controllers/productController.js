const Product = require("../models/productModel");

exports.createProduct = async (req, res) => {
    try {
        const { name, image, description, price, discount_price, category, type, date } = req.body;

        if (!name || !image || !description || !price || !category || !type) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // If date is not provided, use the current date in YYYY-MM-DD format
        const formattedDate = date ? date : new Date().toISOString().split('T')[0];

        await Product.create(name, image, description, price, discount_price, category, type, formattedDate);
        res.status(201).json({ message: "Product added successfully" });
    } catch (err) {
        console.error("Database Error:", err);
        res.status(500).json({ message: "Database error" });
    }
};

exports.getAllProducts = async (req, res) => {
    try {
        const results = await Product.getAll();
        res.json(results);
    } catch (err) {
        console.error("Database Error:", err);
        res.status(500).json({ message: "Database error" });
    }
};

exports.getProductsByType = async (req, res) => {
    try {
        const { type } = req.params;
        const results = await Product.getByType(type);
        res.json(results);
    } catch (err) {
        console.error("Database Error:", err);
        res.status(500).json({ message: "Database error" });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, image, description, price, discount_price, category, type } = req.body;

        await Product.update(id, name, image, description, price, discount_price, category, type);
        res.json({ message: "Product updated successfully" });
    } catch (err) {
        console.error("Database Error:", err);
        res.status(500).json({ message: "Database error" });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        await Product.delete(id);
        res.json({ message: "Product deleted successfully" });
    } catch (err) {
        console.error("Database Error:", err);
        res.status(500).json({ message: "Database error" });
    }
};
