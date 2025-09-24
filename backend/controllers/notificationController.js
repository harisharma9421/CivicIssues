const Notification = require("../models/Notification");

exports.getUserNotifications = async (req, res) => {
    try {
        const { page = 1, limit = 20, isRead } = req.query;
        const userId = req.user._id;

        const query = { recipient: userId };
        if (isRead !== undefined) query.isRead = isRead === 'true';

        const notifications = await Notification.find(query)
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Notification.countDocuments(query);
        const unreadCount = await Notification.countDocuments({ recipient: userId, isRead: false });

        res.json({
            success: true,
            notifications,
            unreadCount,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / limit),
                totalNotifications: total,
                hasNext: page * limit < total,
                hasPrev: page > 1
            }
        });
    } catch (err) {
        console.error('Get notifications error:', err);
        res.status(500).json({ 
            success: false,
            msg: "Error fetching notifications", 
            error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
        });
    }
};

exports.markAsRead = async (req, res) => {
    try {
        const { notificationId } = req.params;
        const userId = req.user._id;

        const notification = await Notification.findOne({
            _id: notificationId,
            recipient: userId
        });

        if (!notification) {
            return res.status(404).json({ 
                success: false,
                msg: "Notification not found" 
            });
        }

        await notification.markAsRead();

        res.json({ 
            success: true,
            msg: "Notification marked as read",
            notification 
        });
    } catch (err) {
        console.error('Mark notification as read error:', err);
        res.status(500).json({ 
            success: false,
            msg: "Error marking notification as read", 
            error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
        });
    }
};

exports.markAllAsRead = async (req, res) => {
    try {
        const userId = req.user._id;

        await Notification.updateMany(
            { recipient: userId, isRead: false },
            { 
                isRead: true, 
                readAt: new Date() 
            }
        );

        res.json({ 
            success: true,
            msg: "All notifications marked as read"
        });
    } catch (err) {
        console.error('Mark all notifications as read error:', err);
        res.status(500).json({ 
            success: false,
            msg: "Error marking all notifications as read", 
            error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
        });
    }
};

exports.deleteNotification = async (req, res) => {
    try {
        const { notificationId } = req.params;
        const userId = req.user._id;

        const notification = await Notification.findOneAndDelete({
            _id: notificationId,
            recipient: userId
        });

        if (!notification) {
            return res.status(404).json({ 
                success: false,
                msg: "Notification not found" 
            });
        }

        res.json({ 
            success: true,
            msg: "Notification deleted successfully"
        });
    } catch (err) {
        console.error('Delete notification error:', err);
        res.status(500).json({ 
            success: false,
            msg: "Error deleting notification", 
            error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
        });
    }
};

exports.createNotification = async (req, res) => {
    try {
        const notificationData = {
            ...req.body,
            recipient: req.user._id
        };

        const notification = new Notification(notificationData);
        await notification.save();

        res.status(201).json({ 
            success: true,
            msg: "Notification created successfully",
            notification 
        });
    } catch (err) {
        console.error('Create notification error:', err);
        res.status(500).json({ 
            success: false,
            msg: "Error creating notification", 
            error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
        });
    }
};

exports.getUnreadCount = async (req, res) => {
    try {
        const userId = req.user._id;
        const unreadCount = await Notification.getUnreadCount(userId);

        res.json({ 
            success: true,
            unreadCount 
        });
    } catch (err) {
        console.error('Get unread count error:', err);
        res.status(500).json({ 
            success: false,
            msg: "Error fetching unread count", 
            error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
        });
    }
};
