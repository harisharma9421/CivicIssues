const District = require("../models/District");
const User = require("../models/User");
const Issue = require("../models/Issue");

exports.createDistrict = async (req, res) => {
    try {
        const district = new District(req.body);
        await district.save();
        
        res.status(201).json({ 
            success: true,
            msg: "District created successfully", 
            district 
        });
    } catch (err) {
        console.error('Create district error:', err);
        res.status(500).json({ 
            success: false,
            msg: "Error creating district", 
            error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
        });
    }
};

exports.getAllDistricts = async (req, res) => {
    try {
        const { 
            page = 1, 
            limit = 10, 
            state, 
            verified,
            isActive = true,
            search
        } = req.query;

        const query = {};
        
        if (state) query.state = state;
        if (verified !== undefined) query.verified = verified === 'true';
        if (isActive !== undefined) query.isActive = isActive === 'true';
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { state: { $regex: search, $options: 'i' } }
            ];
        }

        const districts = await District.find(query)
            .populate('adminId', 'name email')
            .sort({ name: 1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await District.countDocuments(query);

        res.json({
            success: true,
            districts,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / limit),
                totalDistricts: total,
                hasNext: page * limit < total,
                hasPrev: page > 1
            }
        });
    } catch (err) {
        console.error('Get districts error:', err);
        res.status(500).json({ 
            success: false,
            msg: "Error fetching districts", 
            error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
        });
    }
};

exports.getDistrictById = async (req, res) => {
    try {
        const district = await District.findById(req.params.id)
            .populate('adminId', 'name email phoneNumber');

        if (!district) {
            return res.status(404).json({ 
                success: false,
                msg: "District not found" 
            });
        }

        res.json({ 
            success: true,
            district 
        });
    } catch (err) {
        console.error('Get district error:', err);
        res.status(500).json({ 
            success: false,
            msg: "Error fetching district", 
            error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
        });
    }
};

exports.updateDistrict = async (req, res) => {
    try {
        const district = await District.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).populate('adminId', 'name email');

        if (!district) {
            return res.status(404).json({ 
                success: false,
                msg: "District not found" 
            });
        }

        res.json({ 
            success: true,
            msg: "District updated successfully",
            district 
        });
    } catch (err) {
        console.error('Update district error:', err);
        res.status(500).json({ 
            success: false,
            msg: "Error updating district", 
            error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
        });
    }
};

exports.deleteDistrict = async (req, res) => {
    try {
        const district = await District.findByIdAndDelete(req.params.id);

        if (!district) {
            return res.status(404).json({ 
                success: false,
                msg: "District not found" 
            });
        }

        res.json({ 
            success: true,
            msg: "District deleted successfully"
        });
    } catch (err) {
        console.error('Delete district error:', err);
        res.status(500).json({ 
            success: false,
            msg: "Error deleting district", 
            error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
        });
    }
};

exports.getDistrictStats = async (req, res) => {
    try {
        const districtId = req.params.id;

        // Get basic district info
        const district = await District.findById(districtId);
        if (!district) {
            return res.status(404).json({ 
                success: false,
                msg: "District not found" 
            });
        }

        // Get statistics
        const [
            totalUsers,
            totalIssues,
            resolvedIssues,
            pendingIssues,
            recentIssues
        ] = await Promise.all([
            User.countDocuments({ districtId }),
            Issue.countDocuments({ districtId }),
            Issue.countDocuments({ districtId, status: 'resolved' }),
            Issue.countDocuments({ districtId, status: 'pending' }),
            Issue.find({ districtId })
                .sort({ createdAt: -1 })
                .limit(5)
                .populate('createdBy', 'name email')
                .select('title status createdAt createdBy')
        ]);

        const stats = {
            district: district.fullName,
            totalUsers,
            totalIssues,
            resolvedIssues,
            pendingIssues,
            resolutionRate: totalIssues > 0 ? ((resolvedIssues / totalIssues) * 100).toFixed(2) : 0,
            recentIssues
        };

        res.json({ 
            success: true,
            stats 
        });
    } catch (err) {
        console.error('Get district stats error:', err);
        res.status(500).json({ 
            success: false,
            msg: "Error fetching district stats", 
            error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
        });
    }
};

exports.verifyDistrict = async (req, res) => {
    try {
        const { verified } = req.body;
        
        const district = await District.findByIdAndUpdate(
            req.params.id,
            { verified },
            { new: true, runValidators: true }
        ).populate('adminId', 'name email');

        if (!district) {
            return res.status(404).json({ 
                success: false,
                msg: "District not found" 
            });
        }

        res.json({ 
            success: true,
            msg: `District ${verified ? 'verified' : 'unverified'} successfully`,
            district 
        });
    } catch (err) {
        console.error('Verify district error:', err);
        res.status(500).json({ 
            success: false,
            msg: "Error updating district verification", 
            error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
        });
    }
};
