const mongoose = require("mongoose");

const sosSchema = new mongoose.Schema({
    type: { 
        type: String, 
        required: [true, 'SOS type is required'],
        trim: true,
        minlength: [2, 'SOS type must be at least 2 characters'],
        maxlength: [50, 'SOS type cannot exceed 50 characters'],
        enum: ['police', 'fire', 'medical', 'women_helpline', 'child_helpline', 'disaster', 'other']
    },
    name: { 
        type: String, 
        required: [true, 'Service name is required'],
        trim: true,
        minlength: [2, 'Service name must be at least 2 characters'],
        maxlength: [100, 'Service name cannot exceed 100 characters']
    },
    phoneNumber: { 
        type: String, 
        required: [true, 'Phone number is required'],
        match: [/^[6-9]\d{9}$/, 'Please enter a valid Indian phone number']
    },
    districtId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "District",
        required: [true, 'District is required']
    },
    isActive: { type: Boolean, default: true },
    isVerified: { type: Boolean, default: false },
    description: { 
        type: String, 
        trim: true,
        maxlength: [500, 'Description cannot exceed 500 characters']
    },
    emergencyLevel: {
        type: String,
        enum: ['low', 'medium', 'high', 'critical'],
        default: 'medium'
    },
    workingHours: {
        start: { type: String, default: '00:00' },
        end: { type: String, default: '23:59' }
    },
    coordinates: {
        lat: { type: Number, min: -90, max: 90 },
        lng: { type: Number, min: -180, max: 180 }
    }
}, { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Indexes
sosSchema.index({ districtId: 1 });
sosSchema.index({ type: 1 });
sosSchema.index({ isActive: 1 });
sosSchema.index({ emergencyLevel: 1 });

module.exports = mongoose.model("SOS", sosSchema);
