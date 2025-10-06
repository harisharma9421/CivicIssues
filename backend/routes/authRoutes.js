const express = require("express");
const { signup, login, getProfile, updateProfile, changePassword, requestPasswordOtp, verifyOtpAndResetPassword } = require("../controllers/authController");
const { auth } = require("../middleware/auth");
const { validateUser, validateLogin } = require("../middleware/validation");

const router = express.Router();

// Public routes
router.post("/signup", validateUser, signup);
router.post("/login", validateLogin, login);
router.post("/forgot-password/request-otp", requestPasswordOtp);
router.post("/forgot-password/verify", verifyOtpAndResetPassword);

// Protected routes
router.get("/profile", auth, getProfile);
router.put("/profile", auth, updateProfile);
router.put("/change-password", auth, changePassword);

module.exports = router;
