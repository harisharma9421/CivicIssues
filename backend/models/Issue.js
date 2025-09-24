const mongoose = require("mongoose");

const issueSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: [true, 'Title is required'],
        trim: true,
        minlength: [5, 'Title must be at least 5 characters'],
        maxlength: [100, 'Title cannot exceed 100 characters']
    },
    description: { 
        type: String, 
        required: [true, 'Description is required'],
        trim: true,
        minlength: [10, 'Description must be at least 10 characters'],
        maxlength: [1000, 'Description cannot exceed 1000 characters']
    },
    location: {
        lat: { 
            type: Number, 
            required: [true, 'Latitude is required'],
            min: [-90, 'Invalid latitude'],
            max: [90, 'Invalid latitude']
        },
        lng: { 
            type: Number, 
            required: [true, 'Longitude is required'],
            min: [-180, 'Invalid longitude'],
            max: [180, 'Invalid longitude']
        },
        address: { type: String, trim: true }
    },
    category: {
        type: String,
        enum: ['infrastructure', 'sanitation', 'safety', 'transport', 'environment', 'health', 'education', 'other'],
        default: 'other'
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'urgent'],
        default: 'medium'
    },
    media: [{ 
        type: String,
        validate: {
            validator: function(v) {
                return v.length <= 10; // Max 10 media files
            },
            message: 'Cannot have more than 10 media files'
        }
    }],
    createdBy: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User",
        required: [true, 'Creator is required']
    },
    districtId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "District",
        required: [true, 'District is required']
    },
    upvotes: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User" 
    }],
    status: { 
        type: String, 
        enum: ["pending", "in_progress", "resolved", "rejected"], 
        default: "pending" 
    },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    resolutionNotes: { type: String, trim: true },
    resolvedAt: { type: Date },
    estimatedResolutionTime: { type: Date }
}, { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Indexes for better performance
issueSchema.index({ createdBy: 1 });
issueSchema.index({ districtId: 1 });
issueSchema.index({ status: 1 });
issueSchema.index({ category: 1 });
issueSchema.index({ priority: 1 });
issueSchema.index({ 'location.lat': 1, 'location.lng': 1 });
issueSchema.index({ createdAt: -1 });

// Virtual for upvote count
issueSchema.virtual('upvoteCount').get(function() {
    return this.upvotes.length;
});

// Virtual for days since creation
issueSchema.virtual('daysOpen').get(function() {
    const now = new Date();
    const diffTime = Math.abs(now - this.createdAt);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

module.exports = mongoose.model("Issue", issueSchema);
