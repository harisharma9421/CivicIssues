const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: [true, 'Name is required'],
        trim: true,
        minlength: [2, 'Name must be at least 2 characters'],
        maxlength: [50, 'Name cannot exceed 50 characters']
    },
    email: { 
        type: String, 
        required: [true, 'Email is required'], 
        unique: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email'],
        index: true
    },
    password: { 
        type: String, 
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters']
    },
    googleId: { type: String, sparse: true },
    language: { 
        type: String, 
        default: "English",
        enum: ["English", "Hindi", "Bengali", "Telugu", "Marathi", "Tamil", "Gujarati", "Kannada", "Malayalam", "Punjabi"]
    },
    points: { 
        type: Number, 
        default: 0,
        min: [0, 'Points cannot be negative']
    },
    role: { 
        type: String, 
        enum: ["user", "admin", "superAdmin"], 
        default: "user" 
    },
    districtId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "District",
        required: [true, 'District is required']
    },
    isActive: { type: Boolean, default: true },
    lastLogin: { type: Date },
    profilePicture: { type: String },
    phoneNumber: { 
        type: String,
        match: [/^[6-9]\d{9}$/, 'Please enter a valid Indian phone number']
    }
}, { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Additional indexes for better performance
userSchema.index({ districtId: 1 });
userSchema.index({ points: -1 });
userSchema.index({ role: 1 });

// Virtual for user's full profile
userSchema.virtual('profile').get(function() {
    return {
        id: this._id,
        name: this.name,
        email: this.email,
        language: this.language,
        points: this.points,
        role: this.role,
        districtId: this.districtId,
        profilePicture: this.profilePicture,
        createdAt: this.createdAt
    };
});

module.exports = mongoose.model("User", userSchema);
