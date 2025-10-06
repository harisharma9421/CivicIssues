const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const {
    checkSuperAdminExists,
    createSuperAdmin,
    login,
    getProfile,
    updateProfile,
    changePassword,
    listDistrictApplications,
    decideDistrictApplication,
    requestPasswordOtp,
    verifyOtpAndResetPassword
} = require('../controllers/superAdminController');

// Public routes (no authentication required)
router.get('/check', checkSuperAdminExists);
router.post('/create', createSuperAdmin);
router.post('/login', login);
router.post('/forgot-password/request-otp', requestPasswordOtp);
router.post('/forgot-password/verify', verifyOtpAndResetPassword);

// Protected routes (authentication required)
router.get('/profile', auth, getProfile);
router.put('/profile', auth, updateProfile);
router.put('/change-password', auth, changePassword);

// District approval workflow
router.get('/district-applications', auth, listDistrictApplications);
router.put('/district-applications/:id/decision', auth, decideDistrictApplication);

module.exports = router;
