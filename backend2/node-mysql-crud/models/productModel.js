const db = require("./db");

const Product = {
    create: async (name, image, description, price, discount_price, category, type, date) => {
        try {
            const [result] = await db.execute(
                "INSERT INTO products (name, image, description, price, discount_price, category, type, date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                [name, image, description, price, discount_price, category, type, date]
            );
            return result;
        } catch (error) {
            throw error;
        }
    },

    getAll: async () => {
        try {
            const [rows] = await db.execute("SELECT * FROM products");
            return rows;
        } catch (error) {
            throw error;
        }
    },

    getByType: async (type) => {
        try {
            const [rows] = await db.execute("SELECT * FROM products WHERE type = ?", [type]);
            return rows;
        } catch (error) {
            throw error;
        }
    },

    update: async (id, name, image, description, price, discount_price, category, type) => {
        try {
            const [result] = await db.execute(
                "UPDATE products SET name=?, image=?, description=?, price=?, discount_price=?, category=?, type=? WHERE id=?",
                [name, image, description, price, discount_price, category, type, id]
            );
            return result;
        } catch (error) {
            throw error;
        }
    },

    delete: async (id) => {
        try {
            const [result] = await db.execute("DELETE FROM products WHERE id=?", [id]);
            return result;
        } catch (error) {
            throw error;
        }
    }
};

module.exports = Product;
