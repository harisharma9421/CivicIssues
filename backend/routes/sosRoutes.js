const express = require("express");
const { 
    addSOS, 
    getAllSOS, 
    getSOSByDistrict, 
    getSOSById, 
    updateSOS, 
    deleteSOS 
} = require("../controllers/sosController");
const { auth, adminAuth } = require("../middleware/auth");
const { validateSOS } = require("../middleware/validation");

const router = express.Router();

// Public routes
router.get("/", getAllSOS);
router.get("/district/:districtId", getSOSByDistrict);
router.get("/:id", getSOSById);

// Protected routes
router.post("/", auth, adminAuth, validateSOS, addSOS);
router.put("/:id", auth, adminAuth, updateSOS);
router.delete("/:id", auth, adminAuth, deleteSOS);

module.exports = router;
