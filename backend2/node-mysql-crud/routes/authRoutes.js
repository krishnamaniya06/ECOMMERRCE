// const express = require("express");
// const router = express.Router();
// const authController = require("../controllers/authController");

// router.post("/register", authController.register);
// router.post("/login", authController.loginUser);

// module.exports = router;



const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.post("/register", authController.register);
router.post("/login", authController.loginUser);
router.post("/logout", authController.logout);

module.exports = router;