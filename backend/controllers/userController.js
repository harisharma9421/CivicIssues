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
            sortBy = 'createdAt',
            sortOrder = 'desc'
        } = req.query;

        const query = {};
        
        if (districtId) query.districtId = districtId;
        if (role) query.role = role;
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


