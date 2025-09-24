const express = require("express");
const { 
    getUserNotifications, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification, 
    createNotification, 
    getUnreadCount 
} = require("../controllers/notificationController");
const { auth } = require("../middleware/auth");

const router = express.Router();

// All routes are protected
router.use(auth);

// Get user notifications
router.get("/", getUserNotifications);

// Get unread count
router.get("/unread-count", getUnreadCount);

// Mark notification as read
router.put("/:notificationId/read", markAsRead);

// Mark all notifications as read
router.put("/mark-all-read", markAllAsRead);

// Delete notification
router.delete("/:notificationId", deleteNotification);

// Create notification (for testing or admin use)
router.post("/", createNotification);

module.exports = router;
