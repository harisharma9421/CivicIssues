const express = require("express");
const { 
    createIssue, 
    getAllIssues, 
    getIssueById, 
    upvoteIssue, 
    updateIssueStatus, 
    deleteIssue 
} = require("../controllers/issueController");
const { auth, adminAuth } = require("../middleware/auth");
const { validateIssue } = require("../middleware/validation");
const { uploadMultiple } = require("../middleware/upload");

const router = express.Router();

// Public routes
router.get("/", getAllIssues);
router.get("/:id", getIssueById);

// Protected routes
router.post("/", auth, uploadMultiple, validateIssue, createIssue);
router.put("/:id/upvote", auth, upvoteIssue);

// Admin routes
router.put("/:id/status", auth, adminAuth, updateIssueStatus);
router.delete("/:id", auth, deleteIssue);

module.exports = router;
