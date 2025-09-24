const Leaderboard = require("../models/Leaderboard");
const User = require("../models/User");

exports.addEntry = async (req, res) => {
    try {
        const leaderboard = new Leaderboard(req.body);
        await leaderboard.save();
        
        res.status(201).json({ 
            success: true,
            msg: "Leaderboard entry added successfully", 
            leaderboard 
        });
    } catch (err) {
        console.error('Add leaderboard entry error:', err);
        res.status(500).json({ 
            success: false,
            msg: "Error adding leaderboard entry", 
            error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
        });
    }
};

exports.getTopUsers = async (req, res) => {
    try {
        const { 
            limit = 10, 
            districtId,
            timeframe = 'all' // all, monthly, yearly
        } = req.query;

        let sortField = 'points';
        if (timeframe === 'monthly') sortField = 'monthlyPoints';
        if (timeframe === 'yearly') sortField = 'yearlyPoints';

        const query = {};
        if (districtId) query.districtId = districtId;

        const topUsers = await Leaderboard.find(query)
            .populate({
                path: 'userId',
                select: 'name email profilePicture districtId',
                populate: {
                    path: 'districtId',
                    select: 'name state'
                }
            })
            .sort({ [sortField]: -1 })
            .limit(parseInt(limit));

        // Update ranks
        topUsers.forEach((entry, index) => {
            entry.rank = index + 1;
        });

        res.json({ 
            success: true,
            topUsers,
            timeframe,
            districtId: districtId || 'all'
        });
    } catch (err) {
        console.error('Get top users error:', err);
        res.status(500).json({ 
            success: false,
            msg: "Error fetching leaderboard", 
            error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
        });
    }
};

exports.getUserRank = async (req, res) => {
    try {
        const { userId, districtId } = req.params;

        // Get user's leaderboard entry
        const userEntry = await Leaderboard.findOne({ userId, districtId })
            .populate('userId', 'name email profilePicture');

        if (!userEntry) {
            return res.status(404).json({ 
                success: false,
                msg: "User not found in leaderboard" 
            });
        }

        // Get user's rank
        const usersAbove = await Leaderboard.countDocuments({
            districtId,
            points: { $gt: userEntry.points }
        });

        const rank = usersAbove + 1;

        // Update rank in database
        userEntry.rank = rank;
        await userEntry.save();

        res.json({ 
            success: true,
            user: userEntry,
            rank,
            totalUsers: await Leaderboard.countDocuments({ districtId })
        });
    } catch (err) {
        console.error('Get user rank error:', err);
        res.status(500).json({ 
            success: false,
            msg: "Error fetching user rank", 
            error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
        });
    }
};

exports.updatePoints = async (req, res) => {
    try {
        const { userId, points, reason } = req.body;

        let leaderboardEntry = await Leaderboard.findOne({ userId });
        
        if (!leaderboardEntry) {
            // Create new entry if doesn't exist
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ 
                    success: false,
                    msg: "User not found" 
                });
            }

            leaderboardEntry = new Leaderboard({
                userId,
                districtId: user.districtId,
                points: 0
            });
        }

        // Update points
        leaderboardEntry.points += points;
        leaderboardEntry.monthlyPoints += points;
        leaderboardEntry.yearlyPoints += points;
        
        // Add achievement if significant
        if (points >= 50) {
            leaderboardEntry.achievements.push({
                title: 'Point Bonus',
                description: `Earned ${points} points for ${reason || 'activity'}`,
                points: points
            });
        }

        await leaderboardEntry.save();

        res.json({ 
            success: true,
            msg: "Points updated successfully",
            leaderboardEntry 
        });
    } catch (err) {
        console.error('Update points error:', err);
        res.status(500).json({ 
            success: false,
            msg: "Error updating points", 
            error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
        });
    }
};

exports.getDistrictStats = async (req, res) => {
    try {
        const { districtId } = req.params;

        const stats = await Leaderboard.aggregate([
            { $match: { districtId } },
            {
                $group: {
                    _id: null,
                    totalUsers: { $sum: 1 },
                    totalPoints: { $sum: '$points' },
                    averagePoints: { $avg: '$points' },
                    maxPoints: { $max: '$points' },
                    minPoints: { $min: '$points' }
                }
            }
        ]);

        const topContributors = await Leaderboard.find({ districtId })
            .populate('userId', 'name email')
            .sort({ points: -1 })
            .limit(5);

        res.json({ 
            success: true,
            districtId,
            stats: stats[0] || {
                totalUsers: 0,
                totalPoints: 0,
                averagePoints: 0,
                maxPoints: 0,
                minPoints: 0
            },
            topContributors
        });
    } catch (err) {
        console.error('Get district stats error:', err);
        res.status(500).json({ 
            success: false,
            msg: "Error fetching district stats", 
            error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
        });
    }
};


