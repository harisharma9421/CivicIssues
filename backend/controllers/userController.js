const User = require("../models/User");
const Leaderboard = require("../models/Leaderboard");

exports.getAllUsers = async (req, res) => {
    try {
        const { 
            page = 1, 
            limit = 10, 
            districtId, 
            role, 
            search,
            approvalStatus,
            sortBy = 'createdAt',
            sortOrder = 'desc'
        } = req.query;

        const query = {};
        
        if (districtId) query.districtId = districtId;
        if (role) query.role = role;
        if (approvalStatus) query.approvalStatus = approvalStatus;
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }

        const sortOptions = {};
        sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

        const users = await User.find(query)
            .populate('districtId', 'name state')
            .select('-password')
            .sort(sortOptions)
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await User.countDocuments(query);

        res.json({
            success: true,
            users,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / limit),
                totalUsers: total,
                hasNext: page * limit < total,
                hasPrev: page > 1
            }
        });
    } catch (err) {
        console.error('Get users error:', err);
        res.status(500).json({ 
            success: false,
            msg: "Error fetching users", 
            error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
        });
    }
};

exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
            .populate('districtId', 'name state')
            .select('-password');
        
        if (!user) {
            return res.status(404).json({ 
                success: false,
                msg: "User not found" 
            });
        }

        // Get user's leaderboard data
        const leaderboardData = await Leaderboard.findOne({ userId: user._id });

        res.json({ 
            success: true,
            user: user.profile,
            leaderboard: leaderboardData
        });
    } catch (err) {
        console.error('Get user error:', err);
        res.status(500).json({ 
            success: false,
            msg: "Error fetching user", 
            error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
        });
    }
};

exports.getUserStats = async (req, res) => {
    try {
        const userId = req.params.id;
        
        // Get user's issues
        const Issue = require("../models/Issue");
        const userIssues = await Issue.find({ createdBy: userId });
        
        // Get user's upvotes received
        const upvotesReceived = await Issue.aggregate([
            { $match: { createdBy: userId } },
            { $project: { upvoteCount: { $size: "$upvotes" } } },
            { $group: { _id: null, total: { $sum: "$upvoteCount" } } }
        ]);

        // Get user's upvotes given
        const upvotesGiven = await Issue.aggregate([
            { $match: { upvotes: userId } },
            { $count: "total" }
        ]);

        const stats = {
            issuesCreated: userIssues.length,
            issuesResolved: userIssues.filter(issue => issue.status === 'resolved').length,
            upvotesReceived: upvotesReceived[0]?.total || 0,
            upvotesGiven: upvotesGiven[0]?.total || 0,
            totalPoints: userIssues.reduce((sum, issue) => sum + (issue.status === 'resolved' ? 20 : 0), 0)
        };

        res.json({ 
            success: true,
            stats 
        });
    } catch (err) {
        console.error('Get user stats error:', err);
        res.status(500).json({ 
            success: false,
            msg: "Error fetching user stats", 
            error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
        });
    }
};

exports.updateUserStatus = async (req, res) => {
    try {
        const { isActive } = req.body;
        const userId = req.params.id;

        const user = await User.findByIdAndUpdate(
            userId,
            { isActive },
            { new: true, runValidators: true }
        ).populate('districtId', 'name state');

        if (!user) {
            return res.status(404).json({ 
                success: false,
                msg: "User not found" 
            });
        }

        res.json({ 
            success: true,
            msg: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
            user: user.profile
        });
    } catch (err) {
        console.error('Update user status error:', err);
        res.status(500).json({ 
            success: false,
            msg: "Error updating user status", 
            error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
        });
    }
};

// Super Admin: approve or reject admin signup and assign/create district
exports.moderateAdmin = async (req, res) => {
    try {
        const { action, districtName, state } = req.body; // action: 'approve' | 'reject'
        const userId = req.params.id;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ success: false, msg: 'User not found' });
        if (user.role !== 'admin') return res.status(400).json({ success: false, msg: 'Only admin accounts can be moderated' });

        if (action === 'reject') {
            user.approvalStatus = 'rejected';
            await user.save();
            return res.json({ success: true, msg: 'Admin signup rejected', user: user.profile });
        }

        // Approve: assign or create district
        user.approvalStatus = 'approved';

        let District = require('../models/District');
        // Prefer explicit districtName/state from body; fall back to values provided at signup
        const finalDistrictName = (districtName || user.districtName || '').trim();
        const finalState = (state || user.state || '').trim();

        if (!finalDistrictName || !finalState) {
            return res.status(400).json({
                success: false,
                msg: 'District name and state are required to approve admin. Provide them in request or ensure user has these fields.'
            });
        }

        // Enforce one admin per district
        let district = await District.findOne({ name: finalDistrictName, state: finalState });
        if (!district) {
            district = await District.create({ name: finalDistrictName, state: finalState, verified: true, adminId: user._id });
        } else {
            if (district.adminId && district.adminId.toString() !== user._id.toString()) {
                return res.status(400).json({ success: false, msg: 'This district already has an assigned admin' })
            }
            district.adminId = user._id;
            district.verified = true;
            await district.save();
        }

        user.districtId = district._id;
        // Persist chosen district/state back to user profile for consistency
        user.districtName = finalDistrictName;
        user.state = finalState;
        await user.save();

        return res.json({ success: true, msg: 'Admin approved and district assigned', user: user.profile, district });
    } catch (err) {
        console.error('Moderate admin error:', err);
        res.status(500).json({ success: false, msg: 'Error moderating admin', error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error' });
    }
}


