const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const SuperAdmin = require("../models/SuperAdmin");
const District = require("../models/District");
const DistrictApplication = require("../models/DistrictApplication");

// Check if super admin account exists
exports.checkSuperAdminExists = async (req, res) => {
    try {
        const superAdmin = await SuperAdmin.findOne({});
        
        res.json({
            success: true,
            exists: !!superAdmin,
            accountCreated: superAdmin?.accountCreated || false
        });
    } catch (err) {
        console.error('Check super admin error:', err);
        res.status(500).json({
            success: false,
            msg: "Error checking super admin status",
            error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
        });
    }
};

// Create super admin account (one-time only)
exports.createSuperAdmin = async (req, res) => {
    try {
        const { name, email, password, phoneNumber, aadharNumber, latitude, longitude } = req.body;

        // Check if super admin already exists
        const existingSuperAdmin = await SuperAdmin.findOne({});
        if (existingSuperAdmin) {
            return res.status(400).json({
                success: false,
                msg: 'Super admin account already exists. Only one super admin is allowed.'
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);
        
        // Create super admin
        const superAdmin = new SuperAdmin({
            name,
            email,
            password: hashedPassword,
            phoneNumber,
            aadharNumber,
            latitude,
            longitude,
            accountCreated: true
        });
        
        await superAdmin.save();

        res.status(201).json({
            success: true,
            msg: "Super admin account created successfully",
            superAdmin: superAdmin.profile
        });
    } catch (err) {
        console.error('Create super admin error:', err);
        res.status(500).json({
            success: false,
            msg: "Error creating super admin account",
            error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
        });
    }
};

// Super admin login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find super admin
        const superAdmin = await SuperAdmin.findOne({ email });
        if (!superAdmin) {
            return res.status(400).json({
                success: false,
                msg: "Invalid credentials"
            });
        }

        // Must be active
        if (!superAdmin.isActive) {
            return res.status(400).json({
                success: false,
                msg: "Account is deactivated"
            });
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, superAdmin.password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                msg: "Invalid credentials"
            });
        }

        // Update last login
        superAdmin.lastLogin = new Date();
        await superAdmin.save();

        // Generate token
        const token = jwt.sign(
            { id: superAdmin._id, role: 'superAdmin' },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRE || "1d" }
        );

        res.json({
            success: true,
            msg: "Login successful",
            token,
            superAdmin: superAdmin.profile
        });
    } catch (err) {
        console.error('Super admin login error:', err);
        res.status(500).json({
            success: false,
            msg: "Error in login",
            error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
        });
    }
};

// Get super admin profile
exports.getProfile = async (req, res) => {
    try {
        const superAdmin = await SuperAdmin.findById(req.user._id).select('-password');
        
        if (!superAdmin) {
            return res.status(404).json({
                success: false,
                msg: "Super admin not found"
            });
        }

        res.json({
            success: true,
            superAdmin: superAdmin.profile
        });
    } catch (err) {
        console.error('Get super admin profile error:', err);
        res.status(500).json({
            success: false,
            msg: "Error fetching profile",
            error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
        });
    }
};

// Update super admin profile
exports.updateProfile = async (req, res) => {
    try {
        const { name, phoneNumber, aadharNumber, profilePicture, latitude, longitude } = req.body;
        const updateData = {};

        if (name) updateData.name = name;
        if (phoneNumber) updateData.phoneNumber = phoneNumber;
        if (aadharNumber) updateData.aadharNumber = aadharNumber;
        if (profilePicture) updateData.profilePicture = profilePicture;
        if (latitude !== undefined) updateData.latitude = latitude;
        if (longitude !== undefined) updateData.longitude = longitude;

        const superAdmin = await SuperAdmin.findByIdAndUpdate(
            req.user._id,
            updateData,
            { new: true, runValidators: true }
        );

        res.json({
            success: true,
            msg: "Profile updated successfully",
            superAdmin: superAdmin.profile
        });
    } catch (err) {
        console.error('Update super admin profile error:', err);
        res.status(500).json({
            success: false,
            msg: "Error updating profile",
            error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
        });
    }
};

// Change password
exports.changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        
        const superAdmin = await SuperAdmin.findById(req.user._id);
        
        // Verify current password
        const isMatch = await bcrypt.compare(currentPassword, superAdmin.password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                msg: "Current password is incorrect"
            });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 12);
        
        // Update password
        superAdmin.password = hashedPassword;
        await superAdmin.save();

        res.json({
            success: true,
            msg: "Password changed successfully"
        });
    } catch (err) {
        console.error('Change super admin password error:', err);
        res.status(500).json({
            success: false,
            msg: "Error changing password",
            error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
        });
    }
};

// Super admin: request OTP for password reset (email or sms)
exports.requestPasswordOtp = async (req, res) => {
    try {
        const { channel, identifier } = req.body // email or phone
        if (!channel || !identifier) return res.status(400).json({ success: false, msg: 'channel and identifier are required' })
        const OtpService = require('../services/otpService')
        const SuperAdmin = require('../models/SuperAdmin')

        if (channel === 'email') {
            const acct = await SuperAdmin.findOne({ email: identifier.toLowerCase() })
            if (!acct) return res.status(404).json({ success: false, msg: 'No account with this email' })
            await OtpService.sendOtpEmail(identifier, 'superAdmin')
        } else if (channel === 'sms') {
            const acct = await SuperAdmin.findOne({ phoneNumber: identifier })
            if (!acct) return res.status(404).json({ success: false, msg: 'No account with this phone' })
            await OtpService.sendOtpSms(identifier, 'superAdmin')
        } else {
            return res.status(400).json({ success: false, msg: 'Invalid channel' })
        }
        return res.json({ success: true, msg: 'OTP sent' })
    } catch (err) {
        console.error('SuperAdmin request OTP error:', err)
        res.status(500).json({ success: false, msg: 'Error sending OTP' })
    }
}

// Super admin: verify OTP and reset password
exports.verifyOtpAndResetPassword = async (req, res) => {
    try {
        const { channel, identifier, code, newPassword } = req.body
        if (!channel || !identifier || !code || !newPassword) {
            return res.status(400).json({ success: false, msg: 'Missing required fields' })
        }
        const OtpService = require('../services/otpService')
        const verify = await OtpService.verifyOtp(channel, identifier, 'superAdmin', code)
        if (!verify.success) return res.status(400).json({ success: false, msg: verify.msg || 'Invalid code' })

        const bcrypt = require('bcryptjs')
        const hashedPassword = await bcrypt.hash(newPassword, 12)
        const SuperAdmin = require('../models/SuperAdmin')

        let acct
        if (channel === 'email') {
            acct = await SuperAdmin.findOneAndUpdate({ email: identifier.toLowerCase() }, { password: hashedPassword }, { new: true })
        } else {
            acct = await SuperAdmin.findOneAndUpdate({ phoneNumber: identifier }, { password: hashedPassword }, { new: true })
        }
        if (!acct) return res.status(404).json({ success: false, msg: 'Account not found' })
        return res.json({ success: true, msg: 'Password reset successfully' })
    } catch (err) {
        console.error('SuperAdmin verify OTP and reset password error:', err)
        res.status(500).json({ success: false, msg: 'Error resetting password' })
    }
}

exports.listDistrictApplications = async (req, res) => {
    try {
        const { status = 'pending', page = 1, limit = 10 } = req.query;
        const query = { status };
        const apps = await DistrictApplication.find(query)
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);
        const total = await DistrictApplication.countDocuments(query);
        res.json({ success: true, data: apps, pagination: { currentPage: parseInt(page), totalPages: Math.ceil(total / limit), totalItems: total } });
    } catch (err) {
        console.error('List district applications error:', err);
        res.status(500).json({ success: false, msg: 'Error fetching applications', error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error' });
    }
};

exports.decideDistrictApplication = async (req, res) => {
    try {
        const { id } = req.params;
        const { action, reason } = req.body; // action: 'approve' | 'reject'
        const app = await DistrictApplication.findById(id);
        if (!app) return res.status(404).json({ success: false, msg: 'Application not found' });
        if (!['approve', 'reject'].includes(action)) {
            return res.status(400).json({ success: false, msg: 'Invalid action' });
        }

        if (action === 'reject') {
            app.status = 'rejected';
            app.decisionReason = reason || 'Rejected by super admin';
            await app.save();
            return res.json({ success: true, msg: 'Application rejected' });
        }

        // Approve => create a NEW District document for this admin (do not touch existing districts)
        const districtPayload = {
            name: app.name,
            state: app.state,
            country: app.country,
            pincode: app.pincode,
            address: app.address,
            coordinates: app.coordinates,
            location: app.location,
            adminProfile: app.adminProfile,
            verified: true
        };

        // Always create a new District; multiple admins => multiple district documents (as per requirement)
        const district = new District(districtPayload);
        await district.save();

        // Mark approved then delete the application
        app.status = 'approved';
        app.decisionReason = 'Approved and created district';
        await app.save();
        await DistrictApplication.deleteOne({ _id: app._id });

        res.json({ success: true, msg: 'Application approved', district });
    } catch (err) {
        console.error('Decide district application error:', err);
        res.status(500).json({ success: false, msg: 'Error processing application', error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error' });
    }
};
