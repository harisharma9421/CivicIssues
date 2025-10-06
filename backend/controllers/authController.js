const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const District = require("../models/District");
const DistrictApplication = require("../models/DistrictApplication");
const SuperAdmin = require("../models/SuperAdmin");
const { auth } = require("../middleware/auth");

exports.signup = async (req, res) => {
    try {
        const { name, username, email, password, language, role, districtId, phoneNumber, aadharNumber, districtName, state, latitude, longitude } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ $or: [ { email }, { username } ] });
        if (existingUser) {
            return res.status(400).json({ 
                success: false,
                msg: existingUser.email === email ? "User already exists with this email" : "Username already taken" 
            });
        }

        // Block writing to User collection for now
        if (role === 'user') {
            return res.status(400).json({ success: false, msg: 'User signup is disabled for now' });
        }

        // SUPER ADMIN: write to SuperAdmin collection instead of User
        if (role === 'superAdmin') {
            const existingSuper = await SuperAdmin.findOne({});
            if (existingSuper) {
                return res.status(400).json({ success: false, msg: 'A super admin already exists' });
            }

            const hashedPassword = await bcrypt.hash(password, 12);
            const sa = new SuperAdmin({ name, email, password: hashedPassword });
            await sa.save();
            return res.status(201).json({ success: true, msg: 'Super admin created successfully' });
        }

        // ADMIN: store as pending DistrictApplication; actual District will be created only after super admin approval
        if (role === 'admin') {
            const payload = {
                name: districtName,
                state,
                adminProfile: { name, username, email, phoneNumber, aadharNumber },
                coordinates: (latitude !== undefined && longitude !== undefined) ? { lat: latitude, lng: longitude } : undefined
            };
            // Hash password into adminProfile.passwordHash
            try {
                payload.adminProfile.passwordHash = await bcrypt.hash(password, 12);
            } catch (_) {}


            // Enrich from reverse geocode if missing name/state
            if ((!payload.name || !payload.state) && latitude !== undefined && longitude !== undefined) {
                try {
                    const { reverseGeocode } = require('../services/geocodeService');
                    const geo = await reverseGeocode(latitude, longitude);
                    if (geo) {
                        payload.name = payload.name || geo.districtName;
                        payload.state = payload.state || geo.state;
                        payload.country = geo.country;
                        payload.pincode = geo.pincode;
                        payload.address = geo.address;
                    }
                } catch (_) {}
            }

            if (payload.coordinates) {
                payload.location = { type: 'Point', coordinates: [Number(payload.coordinates.lng), Number(payload.coordinates.lat)] };
            }

            const application = new DistrictApplication(payload);
            await application.save();

            // Notify super admin
            try {
                const Notification = require('../models/Notification');
                const SuperAdmin = require('../models/SuperAdmin');
                const sa = await SuperAdmin.findOne({});
                if (sa) {
                    await Notification.create({
                        recipientId: sa._id,
                        recipientModel: 'SuperAdmin',
                        title: 'New District Admin Application',
                        message: `${name} applied for ${application.name || 'a district'} (${state || ''}).`,
                        type: 'admin',
                        priority: 'high',
                        relatedEntity: 'district',
                        relatedEntityId: application._id,
                        actionUrl: '/superadmin/approvals'
                    });
                }
            } catch (_) {}
            return res.status(201).json({ success: true, msg: 'Admin registration submitted for super admin approval', applicationId: application._id });
        }

        // Fallback (should not reach)
        return res.status(400).json({ success: false, msg: 'Unsupported role' });
    } catch (err) {
        console.error('Signup error:', err);
        res.status(500).json({ 
            success: false,
            msg: "Error in signup", 
            error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
        });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user and include district info
        const user = await User.findOne({ email }).populate('districtId', 'name state');
        if (!user) {
            // If no user found, check if there is a pending district application with this email
            const pendingApp = await require('../models/DistrictApplication').findOne({ 'adminProfile.email': email, status: 'pending' });
            if (pendingApp) {
                return res.status(403).json({ success: false, msg: 'Your admin application is pending approval by super admin' });
            }
            return res.status(400).json({ success: false, msg: "Invalid credentials" });
        }

        // Must be active
        if (!user.isActive) {
            return res.status(400).json({ 
                success: false,
                msg: "Account is deactivated" 
            });
        }

        // Admins must be approved before login
        if (user.role === 'admin' && user.approvalStatus !== 'approved') {
            return res.status(403).json({
                success: false,
                msg: user.approvalStatus === 'pending' ? 'Your account is pending approval by super admin' : 'Your account was rejected by super admin'
            })
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ 
                success: false,
                msg: "Invalid credentials" 
            });
        }

        // Update last login
        user.lastLogin = new Date();
        await user.save();

        // Generate token
        const token = jwt.sign(
            { id: user._id, role: user.role }, 
            process.env.JWT_SECRET, 
            { expiresIn: process.env.JWT_EXPIRE || "1d" }
        );

        res.json({ 
            success: true,
            msg: "Login successful", 
            token, 
            user: user.profile
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ 
            success: false,
            msg: "Error in login", 
            error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
        });
    }
};

exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
            .populate('districtId', 'name state')
            .select('-password');
        
        if (!user) {
            return res.status(404).json({ 
                success: false,
                msg: "User not found" 
            });
        }

        res.json({ 
            success: true,
            user: user.profile
        });
    } catch (err) {
        console.error('Get profile error:', err);
        res.status(500).json({ 
            success: false,
            msg: "Error fetching profile", 
            error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
        });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const { name, language, phoneNumber, profilePicture } = req.body;
        const updateData = {};

        if (name) updateData.name = name;
        if (language) updateData.language = language;
        if (phoneNumber) updateData.phoneNumber = phoneNumber;
        if (profilePicture) updateData.profilePicture = profilePicture;

        const user = await User.findByIdAndUpdate(
            req.user._id,
            updateData,
            { new: true, runValidators: true }
        ).populate('districtId', 'name state');

        res.json({ 
            success: true,
            msg: "Profile updated successfully",
            user: user.profile
        });
    } catch (err) {
        console.error('Update profile error:', err);
        res.status(500).json({ 
            success: false,
            msg: "Error updating profile", 
            error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
        });
    }
};

exports.changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        
        const user = await User.findById(req.user._id);
        
        // Verify current password
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ 
                success: false,
                msg: "Current password is incorrect" 
            });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 12);
        
        // Update password
        user.password = hashedPassword;
        await user.save();

        res.json({ 
            success: true,
            msg: "Password changed successfully"
        });
    } catch (err) {
        console.error('Change password error:', err);
        res.status(500).json({ 
            success: false,
            msg: "Error changing password", 
            error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
        });
    }
};

// Forgot password: request OTP via email
exports.requestPasswordOtp = async (req, res) => {
    try {
        let { channel, identifier } = req.body; // channel kept for backward-compat; defaults to 'email'
        channel = 'email'
        if (!identifier) return res.status(400).json({ success: false, msg: 'identifier is required' })
        const role = 'admin' // admin side covers admin and user; we allow email lookup either way
        const OtpService = require('../services/otpService')

        // ensure user exists
        const email = (identifier || '').trim().toLowerCase()
        let accountRole = 'admin'
        let user = await require('../models/User').findOne({ email })
        if (!user) {
            // Check embedded admin profile in Districts
            const District = require('../models/District')
            const district = await District.findOne({ 'adminProfile.email': email })
            if (!district) return res.status(404).json({ success: false, msg: 'No account with this email' })
        } else {
            accountRole = user.role
        }
        await OtpService.sendOtpEmail(email, accountRole)

        return res.json({ success: true, msg: 'OTP sent' })
    } catch (err) {
        console.error('Request password OTP error:', err)
        res.status(500).json({ success: false, msg: 'Error sending OTP' })
    }
}

// Forgot password: verify OTP and reset password (email-only)
exports.verifyOtpAndResetPassword = async (req, res) => {
    try {
        const { identifier, code, newPassword } = req.body
        if (!identifier || !code || !newPassword) {
            return res.status(400).json({ success: false, msg: 'Missing required fields' })
        }

        const OtpService = require('../services/otpService')
        const normalizedIdentifier = (identifier || '').trim().toLowerCase()
        const verify = await OtpService.verifyOtp('email', normalizedIdentifier, 'admin', code)
        if (!verify.success) return res.status(400).json({ success: false, msg: verify.msg || 'Invalid code' })

        const bcrypt = require('bcryptjs')
        const hashedPassword = await bcrypt.hash(newPassword, 12)

        let user = await require('../models/User').findOneAndUpdate({ email: normalizedIdentifier }, { password: hashedPassword }, { new: true })
        if (!user) {
            const District = require('../models/District')
            const district = await District.findOne({ 'adminProfile.email': normalizedIdentifier })
            if (!district) return res.status(404).json({ success: false, msg: 'Account not found' })
            await District.updateOne({ _id: district._id }, { $set: { 'adminProfile.passwordHash': hashedPassword } })
        }

        return res.json({ success: true, msg: 'Password reset successfully' })
    } catch (err) {
        console.error('Verify OTP and reset password error:', err)
        res.status(500).json({ success: false, msg: 'Error resetting password' })
    }
}


