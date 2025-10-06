const jwt = require('jsonwebtoken');
const User = require('../models/User');
const SuperAdmin = require('../models/SuperAdmin');

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ msg: 'No token, authorization denied' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // expose token role for downstream middleware
        req.userRole = decoded.role;

        // Check if it's a super admin
        if (decoded.role === 'superAdmin') {
            const superAdmin = await SuperAdmin.findById(decoded.id).select('-password');
            if (!superAdmin) {
                return res.status(401).json({ msg: 'Token is not valid' });
            }
            // attach a virtual role for consistency
            req.user = { ...superAdmin.toObject(), role: 'superAdmin' };
        } else if (decoded.role === 'admin' && decoded.districtId) {
            // Token issued via district admin login; attach a minimal user context
            req.user = { role: 'admin', districtId: decoded.districtId, email: decoded.email };
        } else {
            // Regular user authentication
            const user = await User.findById(decoded.id).select('-password');
            if (!user) {
                return res.status(401).json({ msg: 'Token is not valid' });
            }
            req.user = user;
            if (!req.userRole && user.role) req.userRole = user.role;
        }

        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};

const adminAuth = async (req, res, next) => {
    try {
        const role = req.userRole || req.user?.role;
        if (role !== 'admin' && role !== 'superAdmin') {
            return res.status(403).json({ msg: 'Access denied. Admin privileges required.' });
        }
        next();
    } catch (err) {
        res.status(403).json({ msg: 'Access denied' });
    }
};

const superAdminAuth = async (req, res, next) => {
    try {
        const role = req.userRole || req.user?.role;
        if (role !== 'superAdmin') {
            return res.status(403).json({ msg: 'Access denied. Super admin privileges required.' });
        }
        next();
    } catch (err) {
        res.status(403).json({ msg: 'Access denied' });
    }
};

module.exports = { auth, adminAuth, superAdminAuth };
