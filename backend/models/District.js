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
        required: [true, 'Admin is required']
    },
    population: { type: Number, min: [0, 'Population cannot be negative'] },
    area: { type: Number, min: [0, 'Area cannot be negative'] },
    coordinates: {
        lat: { type: Number, min: -90, max: 90 },
        lng: { type: Number, min: -180, max: 180 }
    },
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
districtSchema.index({ state: 1 });
districtSchema.index({ verified: 1 });
districtSchema.index({ adminId: 1 });

// Virtual for full name
districtSchema.virtual('fullName').get(function() {
    return `${this.name}, ${this.state}`;
});

module.exports = mongoose.model("District", districtSchema);
