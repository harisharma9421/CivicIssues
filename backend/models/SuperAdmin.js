const mongoose = require("mongoose");

const superAdminSchema = new mongoose.Schema({
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
    phoneNumber: { 
        type: String,
        required: [true, 'Phone number is required'],
        match: [/^[6-9]\d{9}$/, 'Please enter a valid Indian phone number']
    },
    aadharNumber: {
        type: String,
        required: [true, 'Aadhar number is required'],
        match: [/^\d{12}$/, 'Please enter a valid 12-digit Aadhar number']
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
    },
    isActive: { type: Boolean, default: true },
    lastLogin: { type: Date },
    profilePicture: { type: String },
    accountCreated: { type: Boolean, default: false }
}, { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Ensure only one super admin can exist
superAdminSchema.pre('save', async function(next) {
    if (this.isNew) {
        const existingSuperAdmin = await this.constructor.findOne({});
        if (existingSuperAdmin) {
            const error = new Error('Super admin account already exists. Only one super admin is allowed.');
            error.statusCode = 400;
            return next(error);
        }
    }
    next();
});

// Virtual for super admin profile
superAdminSchema.virtual('profile').get(function() {
    return {
        id: this._id,
        name: this.name,
        email: this.email,
        phoneNumber: this.phoneNumber,
        aadharNumber: this.aadharNumber,
        latitude: this.latitude,
        longitude: this.longitude,
        isActive: this.isActive,
        profilePicture: this.profilePicture,
        accountCreated: this.accountCreated,
        lastLogin: this.lastLogin,
        createdAt: this.createdAt
    };
});

module.exports = mongoose.model("SuperAdmin", superAdminSchema);
