const express = require("express");
const router = express.Router();
const db = require("../models/db"); // Ensure your database connection is correct

// Get all wishlist items
router.get("/", async (req, res) => {
    try {
        const [wishlist] = await db.execute("SELECT * FROM wishlist");
        res.json(wishlist);
    } catch (error) {
        console.error("Error fetching wishlist:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// Add an item to wishlist
router.post("/", async (req, res) => {
    try {
        const { product_id, name, price, image } = req.body;
        if (!product_id || !name || !price || !image) {
            return res.status(400).json({ message: "Missing fields" });
        }

        const [result] = await db.execute(
            "INSERT INTO wishlist (product_id, name, price, image) VALUES (?, ?, ?, ?)",
            [product_id, name, price, image]
        );

        // Return the newly added wishlist item with its ID
        const newItem = {
            id: result.insertId,
            product_id,
            name,
            price,
            image
        };
        
        res.status(201).json(newItem);
    } catch (error) {
        console.error("Error adding to wishlist:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// Remove an item from wishlist by id
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        // Try to delete by id first
        let [result] = await db.execute("DELETE FROM wishlist WHERE id = ?", [id]);
        
        // If no rows were affected, try to delete by product_id
        if (result.affectedRows === 0) {
            [result] = await db.execute("DELETE FROM wishlist WHERE product_id = ?", [id]);
        }
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Item not found in wishlist" });
        }
        
        res.json({ message: "Removed from wishlist" });
    } catch (error) {
        console.error("Error deleting wishlist item:", error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;


