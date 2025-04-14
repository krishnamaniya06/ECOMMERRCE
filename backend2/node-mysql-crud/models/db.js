const mysql = require("mysql2/promise");

const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "e-commerce",
});

console.log("Database pool created");

module.exports = db;
