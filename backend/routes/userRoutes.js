const express = require("express");
const { 
    getAllUsers, 
    getUserById, 
    getUserStats, 
    updateUserStatus 
} = require("../controllers/userController");
const { auth, adminAuth } = require("../middleware/auth");

const router = express.Router();

// Public routes
router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.get("/:id/stats", getUserStats);

// Admin routes
router.put("/:id/status", auth, adminAuth, updateUserStatus);

module.exports = router;
