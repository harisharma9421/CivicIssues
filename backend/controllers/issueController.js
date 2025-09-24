const Issue = require("../models/Issue");
const User = require("../models/User");
const Notification = require("../models/Notification");

exports.createIssue = async (req, res) => {
    try {
        const issueData = {
            ...req.body,
            createdBy: req.user._id
        };

        const issue = new Issue(issueData);
        await issue.save();

        // Populate creator and district info
        await issue.populate([
            { path: 'createdBy', select: 'name email' },
            { path: 'districtId', select: 'name state' }
        ]);

        // Award points for creating issue
        await User.findByIdAndUpdate(req.user._id, { 
            $inc: { points: 10 } 
        });

        res.status(201).json({ 
            success: true,
            msg: "Issue reported successfully", 
            issue 
        });
    } catch (err) {
        console.error('Create issue error:', err);
        res.status(500).json({ 
            success: false,
            msg: "Error creating issue", 
            error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
        });
    }
};

exports.getAllIssues = async (req, res) => {
    try {
        const { 
            page = 1, 
            limit = 10, 
            status, 
            category, 
            priority, 
            districtId,
            sortBy = 'createdAt',
            sortOrder = 'desc'
        } = req.query;

        const query = {};
        
        if (status) query.status = status;
        if (category) query.category = category;
        if (priority) query.priority = priority;
        if (districtId) query.districtId = districtId;

        const sortOptions = {};
        sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

        const issues = await Issue.find(query)
            .populate('createdBy', 'name email profilePicture')
            .populate('districtId', 'name state')
            .populate('assignedTo', 'name email')
            .sort(sortOptions)
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Issue.countDocuments(query);

        res.json({
            success: true,
            issues,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / limit),
                totalIssues: total,
                hasNext: page * limit < total,
                hasPrev: page > 1
            }
        });
    } catch (err) {
        console.error('Get issues error:', err);
        res.status(500).json({ 
            success: false,
            msg: "Error fetching issues", 
            error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
        });
    }
};

exports.getIssueById = async (req, res) => {
    try {
        const issue = await Issue.findById(req.params.id)
            .populate('createdBy', 'name email profilePicture')
            .populate('districtId', 'name state')
            .populate('assignedTo', 'name email')
            .populate('upvotes', 'name email');

        if (!issue) {
            return res.status(404).json({ 
                success: false,
                msg: "Issue not found" 
            });
        }

        res.json({ 
            success: true,
            issue 
        });
    } catch (err) {
        console.error('Get issue error:', err);
        res.status(500).json({ 
            success: false,
            msg: "Error fetching issue", 
            error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
        });
    }
};

exports.upvoteIssue = async (req, res) => {
    try {
        const issue = await Issue.findById(req.params.id);
        
        if (!issue) {
            return res.status(404).json({ 
                success: false,
                msg: "Issue not found" 
            });
        }

        // Check if user already upvoted
        if (issue.upvotes.includes(req.user._id)) {
            return res.status(400).json({ 
                success: false,
                msg: "You have already upvoted this issue" 
            });
        }

        // Add upvote
        issue.upvotes.push(req.user._id);
        await issue.save();

        // Award points for upvoting
        await User.findByIdAndUpdate(req.user._id, { 
            $inc: { points: 2 } 
        });

        // Award points to issue creator
        await User.findByIdAndUpdate(issue.createdBy, { 
            $inc: { points: 1 } 
        });

        await issue.populate('upvotes', 'name email');

        res.json({ 
            success: true,
            msg: "Issue upvoted successfully",
            issue 
        });
    } catch (err) {
        console.error('Upvote issue error:', err);
        res.status(500).json({ 
            success: false,
            msg: "Error upvoting issue", 
            error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
        });
    }
};

exports.updateIssueStatus = async (req, res) => {
    try {
        const { status, resolutionNotes, assignedTo } = req.body;
        
        const updateData = { status };
        if (resolutionNotes) updateData.resolutionNotes = resolutionNotes;
        if (assignedTo) updateData.assignedTo = assignedTo;
        if (status === 'resolved') updateData.resolvedAt = new Date();

        const issue = await Issue.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        ).populate([
            { path: 'createdBy', select: 'name email' },
            { path: 'districtId', select: 'name state' },
            { path: 'assignedTo', select: 'name email' }
        ]);

        if (!issue) {
            return res.status(404).json({ 
                success: false,
                msg: "Issue not found" 
            });
        }

        // Create notification for issue creator
        if (status === 'resolved') {
            await Notification.create({
                recipient: issue.createdBy,
                title: 'Issue Resolved',
                message: `Your issue "${issue.title}" has been resolved!`,
                type: 'issue_resolved',
                priority: 'medium',
                relatedEntity: 'issue',
                relatedEntityId: issue._id
            });

            // Award points for resolution
            await User.findByIdAndUpdate(issue.createdBy, { 
                $inc: { points: 20 } 
            });
        }

        res.json({ 
            success: true,
            msg: "Issue status updated successfully",
            issue 
        });
    } catch (err) {
        console.error('Update issue status error:', err);
        res.status(500).json({ 
            success: false,
            msg: "Error updating issue status", 
            error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
        });
    }
};

exports.deleteIssue = async (req, res) => {
    try {
        const issue = await Issue.findById(req.params.id);
        
        if (!issue) {
            return res.status(404).json({ 
                success: false,
                msg: "Issue not found" 
            });
        }

        // Check if user is the creator or admin
        if (issue.createdBy.toString() !== req.user._id.toString() && 
            req.user.role !== 'admin' && req.user.role !== 'superAdmin') {
            return res.status(403).json({ 
                success: false,
                msg: "Not authorized to delete this issue" 
            });
        }

        await Issue.findByIdAndDelete(req.params.id);

        res.json({ 
            success: true,
            msg: "Issue deleted successfully"
        });
    } catch (err) {
        console.error('Delete issue error:', err);
        res.status(500).json({ 
            success: false,
            msg: "Error deleting issue", 
            error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
        });
    }
};


