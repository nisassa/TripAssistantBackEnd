const express = require("express")
const router = express.Router()
const userController = require("../controller/userController")

const checkAuth = require("../middleware/auth")

router.post("/register", userController.register);

router.post("/login", userController.logIn);

router.post("/check-auth", checkAuth, userController.verifyToken);

// router.post("/delete/:userId", checkAuth, userController.deleteUser);

module.exports = router;