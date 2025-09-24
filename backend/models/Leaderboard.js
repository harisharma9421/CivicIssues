const mongoose = require("mongoose");

const leaderboardSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User",
        required: [true, 'User is required'],
        unique: true
    },
    points: { 
        type: Number, 
        required: [true, 'Points are required'],
        min: [0, 'Points cannot be negative'],
        default: 0
    },
    rank: { 
        type: Number,
        min: [1, 'Rank must be at least 1']
    },
    districtId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "District",
        required: [true, 'District is required']
    },
    badges: [{
        name: { type: String, required: true },
        earnedAt: { type: Date, default: Date.now },
        description: String
    }],
    achievements: [{
        title: { type: String, required: true },
        description: String,
        earnedAt: { type: Date, default: Date.now },
        points: { type: Number, default: 0 }
    }],
    monthlyPoints: { type: Number, default: 0 },
    yearlyPoints: { type: Number, default: 0 },
    lastUpdated: { type: Date, default: Date.now }
}, { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Indexes
leaderboardSchema.index({ points: -1 });
leaderboardSchema.index({ districtId: 1, points: -1 });
leaderboardSchema.index({ rank: 1 });
leaderboardSchema.index({ lastUpdated: -1 });

// Virtual for user profile
leaderboardSchema.virtual('userProfile', {
    ref: 'User',
    localField: 'userId',
    foreignField: '_id',
    justOne: true
});

// Update rank when points change
leaderboardSchema.pre('save', async function(next) {
    if (this.isModified('points')) {
        this.lastUpdated = new Date();
    }
    next();
});

module.exports = mongoose.model("Leaderboard", leaderboardSchema);
