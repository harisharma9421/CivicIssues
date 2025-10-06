const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
    // Polymorphic recipient: User or SuperAdmin
    recipientId: { 
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'Recipient is required']
    },
    recipientModel: {
        type: String,
        enum: ['User', 'SuperAdmin'],
        required: true
    },
    title: { 
        type: String, 
        required: [true, 'Title is required'],
        trim: true,
        maxlength: [100, 'Title cannot exceed 100 characters']
    },
    message: { 
        type: String, 
        required: [true, 'Message is required'],
        trim: true,
        maxlength: [500, 'Message cannot exceed 500 characters']
    },
    type: {
        type: String,
        enum: ['issue_update', 'issue_resolved', 'points_earned', 'badge_earned', 'sos_alert', 'system', 'admin'],
        required: [true, 'Notification type is required']
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'urgent'],
        default: 'medium'
    },
    isRead: { type: Boolean, default: false },
    readAt: { type: Date },
    relatedEntity: {
        type: String,
        enum: ['issue', 'user', 'district', 'sos', 'leaderboard']
    },
    relatedEntityId: { type: mongoose.Schema.Types.ObjectId },
    actionUrl: { type: String },
    metadata: {
        type: Map,
        of: mongoose.Schema.Types.Mixed
    }
}, { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Indexes
notificationSchema.index({ recipientId: 1, recipientModel: 1, createdAt: -1 });
notificationSchema.index({ isRead: 1 });
notificationSchema.index({ type: 1 });
notificationSchema.index({ priority: 1 });

// Mark as read
notificationSchema.methods.markAsRead = function() {
    this.isRead = true;
    this.readAt = new Date();
    return this.save();
};

// Get unread count for a recipient
notificationSchema.statics.getUnreadCount = function(recipientId, recipientModel) {
    return this.countDocuments({ recipientId, recipientModel, isRead: false });
};

module.exports = mongoose.model("Notification", notificationSchema);
