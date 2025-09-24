const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ msg: 'No token, authorization denied' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');
        
        if (!user) {
            return res.status(401).json({ msg: 'Token is not valid' });
        }

        req.user = user;
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};

const adminAuth = async (req, res, next) => {
    try {
        if (req.user.role !== 'admin' && req.user.role !== 'superAdmin') {
            return res.status(403).json({ msg: 'Access denied. Admin privileges required.' });
        }
        next();
    } catch (err) {
        res.status(403).json({ msg: 'Access denied' });
    }
};

const superAdminAuth = async (req, res, next) => {
    try {
        if (req.user.role !== 'superAdmin') {
            return res.status(403).json({ msg: 'Access denied. Super admin privileges required.' });
        }
        next();
    } catch (err) {
        res.status(403).json({ msg: 'Access denied' });
    }
};

module.exports = { auth, adminAuth, superAdminAuth };
