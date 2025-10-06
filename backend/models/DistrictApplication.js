const mongoose = require("mongoose");

const districtApplicationSchema = new mongoose.Schema({
    name: { type: String, trim: true },
    state: { type: String, trim: true },
    country: { type: String },
    pincode: { type: String },
    address: { type: String },
    coordinates: {
        lat: { type: Number, min: -90, max: 90 },
        lng: { type: Number, min: -180, max: 180 }
    },
    location: {
        type: {
            type: String,
            enum: ['Point']
        },
        coordinates: {
            type: [Number] // [lng, lat]
        }
    },
    adminProfile: {
        name: { type: String, trim: true, required: true },
        username: { type: String, trim: true, required: true },
        email: { type: String, trim: true, required: true },
        phoneNumber: { type: String, trim: true, required: true },
        aadharNumber: { type: String, trim: true, required: true },
        passwordHash: { type: String, required: true }
    },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending', index: true },
    decisionReason: { type: String }
}, {
    timestamps: true
});

districtApplicationSchema.index({ location: '2dsphere' });

module.exports = mongoose.model("DistrictApplication", districtApplicationSchema);


