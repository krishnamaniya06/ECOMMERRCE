const db = require("./db");

const User = {
    create: (email, password, role, callback) => {
        db.query("INSERT INTO users (email, password, role) VALUES (?, ?, ?)", 
        [email, password, role], callback);
    },

    findByEmail: (email, callback) => {
        db.query("SELECT * FROM users WHERE email = ?", [email], callback);
    },
};

module.exports = User;
