const mongoose = require("mongoose");

const districtSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: [true, 'District name is required'], 
        unique: true,
        trim: true,
        minlength: [2, 'District name must be at least 2 characters'],
        maxlength: [100, 'District name cannot exceed 100 characters'],
        index: true
    },
    state: { 
        type: String, 
        required: [true, 'State is required'],
        trim: true,
        minlength: [2, 'State must be at least 2 characters'],
        maxlength: [50, 'State cannot exceed 50 characters']
    },
    verified: { type: Boolean, default: false },
    adminId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User",
    },
    // Embedded admin details when not using User collection
    adminProfile: {
        name: { type: String, trim: true },
        username: { type: String, trim: true },
        email: { type: String, trim: true },
        phoneNumber: { type: String, trim: true },
        aadharNumber: { type: String, trim: true },
        passwordHash: { type: String }
    },
    population: { type: Number, min: [0, 'Population cannot be negative'] },
    area: { type: Number, min: [0, 'Area cannot be negative'] },
    coordinates: {
        lat: { type: Number, min: -90, max: 90 },
        lng: { type: Number, min: -180, max: 180 }
    },
    // GeoJSON point for precise geospatial queries
    location: {
        type: {
            type: String,
            enum: ['Point']
        },
        coordinates: {
            type: [Number], // [lng, lat]
            validate: {
                validator: function (value) {
                    if (!Array.isArray(value) || value.length !== 2) return false;
                    const [lng, lat] = value;
                    return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
                },
                message: 'location.coordinates must be [lng, lat] within valid ranges'
            }
        }
    },
    // Address metadata auto-populated from reverse geocoding
    country: { type: String },
    pincode: { type: String },
    address: { type: String },
    isActive: { type: Boolean, default: true },
    contactInfo: {
        phone: String,
        email: String,
        address: String
    }
}, { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Additional indexes
districtSchema.index({ name: 1, state: 1 });
districtSchema.index({ state: 1 });
districtSchema.index({ verified: 1 });
districtSchema.index({ adminId: 1 });
districtSchema.index({ location: '2dsphere' });

// Ensure we never save malformed GeoJSON
districtSchema.pre('validate', function(next) {
    if (this.location && (!Array.isArray(this.location.coordinates) || this.location.coordinates.length !== 2)) {
        this.location = undefined;
    }
    next();
});

// Virtual for full name
districtSchema.virtual('fullName').get(function() {
    return `${this.name}, ${this.state}`;
});

module.exports = mongoose.model("District", districtSchema);
