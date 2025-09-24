const express = require("express");
const { 
    addEntry, 
    getTopUsers, 
    getUserRank, 
    updatePoints, 
    getDistrictStats 
} = require("../controllers/leaderboardController");
const { auth, adminAuth } = require("../middleware/auth");

const router = express.Router();

// Public routes
router.get("/top", getTopUsers);
router.get("/user/:userId/:districtId", getUserRank);
router.get("/district/:districtId/stats", getDistrictStats);

// Protected routes
router.post("/", auth, addEntry);
router.put("/points", auth, updatePoints);

module.exports = router;
