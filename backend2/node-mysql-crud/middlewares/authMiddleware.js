const jwt = require("jsonwebtoken");

exports.verifyAdmin = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) return res.status(403).json({ message: "Access denied" });

    jwt.verify(token, "secretKey", (err, decoded) => {
        if (err || decoded.role !== "admin") return res.status(403).json({ message: "Access denied" });
        next();
    });
};
