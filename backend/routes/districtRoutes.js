const express = require("express");
const { 
    createDistrict, 
    getAllDistricts, 
    getDistrictById, 
    updateDistrict, 
    deleteDistrict, 
    getDistrictStats, 
    verifyDistrict,
    resolveByCoordinates,
    adminLogin 
} = require("../controllers/districtController");
const { auth, adminAuth, superAdminAuth } = require("../middleware/auth");
const { validateDistrict } = require("../middleware/validation");

const router = express.Router();

// Public routes
router.get("/", getAllDistricts);
router.get("/:id", getDistrictById);
router.get("/:id/stats", getDistrictStats);
// Resolve district metadata from coordinates
router.get("/resolve/by-coordinates", resolveByCoordinates);
// District admin login
router.post("/admin/login", adminLogin);

// Protected routes (Admin and Super Admin)
router.post("/", auth, adminAuth, validateDistrict, createDistrict);
router.put("/:id", auth, adminAuth, updateDistrict);
router.delete("/:id", auth, superAdminAuth, deleteDistrict);

// Super Admin only routes
router.put("/:id/verify", auth, superAdminAuth, verifyDistrict);

module.exports = router;
