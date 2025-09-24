const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { auth } = require("../middleware/auth");

exports.signup = async (req, res) => {
    try {
        const { name, email, password, language, role, districtId, phoneNumber } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ 
                success: false,
                msg: "User already exists with this email" 
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);
        
        // Create new user
        const newUser = new User({ 
            name, 
            email, 
            password: hashedPassword, 
            language, 
            role, 
            districtId,
            phoneNumber
        });
        
        await newUser.save();

        // Generate token
        const token = jwt.sign(
            { id: newUser._id, role: newUser.role }, 
            process.env.JWT_SECRET, 
            { expiresIn: process.env.JWT_EXPIRE || "1d" }
        );

        res.status(201).json({ 
            success: true,
            msg: "Signup successful", 
            token,
            user: newUser.profile
        });
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
            return res.status(400).json({ 
                success: false,
                msg: "Invalid credentials" 
            });
        }

        // Check if user is active
        if (!user.isActive) {
            return res.status(400).json({ 
                success: false,
                msg: "Account is deactivated" 
            });
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


