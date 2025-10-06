const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: [true, 'Name is required'],
        trim: true,
        minlength: [2, 'Name must be at least 2 characters'],
        maxlength: [50, 'Name cannot exceed 50 characters']
    },
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        trim: true,
        minlength: [4, 'Username must be at least 4 characters'],
        maxlength: [20, 'Username cannot exceed 20 characters'],
        match: [/^[a-zA-Z0-9._-]+$/, 'Username may contain letters, numbers, dot, underscore and hyphen only']
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
        required: false
    },
    approvalStatus: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: function() { return this.role === 'admin' ? 'pending' : 'approved' }
    },
    aadharNumber: {
        type: String,
        required: [true, 'Aadhar number is required'],
        match: [/^\d{12}$/, 'Please enter a valid 12-digit Aadhar number']
    },
    districtName: { 
        type: String,
        required: function() { return this.role === 'admin' },
        trim: true
    },
    state: { 
        type: String,
        required: function() { return this.role === 'admin' },
        trim: true
    },
    isActive: { type: Boolean, default: true },
    lastLogin: { type: Date },
    profilePicture: { type: String },
    phoneNumber: { 
        type: String,
        required: [true, 'Phone number is required'],
        match: [/^[6-9]\d{9}$/, 'Please enter a valid Indian phone number']
    },
    latitude: {
        type: Number,
        min: [-90, 'Latitude must be between -90 and 90'],
        max: [90, 'Latitude must be between -90 and 90']
    },
    longitude: {
        type: Number,
        min: [-180, 'Longitude must be between -180 and 180'],
        max: [180, 'Longitude must be between -180 and 180']
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
        username: this.username,
        email: this.email,
        language: this.language,
        points: this.points,
        role: this.role,
        districtId: this.districtId,
        profilePicture: this.profilePicture,
        approvalStatus: this.approvalStatus,
        districtName: this.districtName,
        state: this.state,
        phoneNumber: this.phoneNumber,
        aadharNumber: this.aadharNumber,
        latitude: this.latitude,
        longitude: this.longitude,
        createdAt: this.createdAt
    };
});

module.exports = mongoose.model("User", userSchema);
