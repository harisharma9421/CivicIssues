const District = require("../models/District");
const User = require("../models/User");
const Issue = require("../models/Issue");
const { reverseGeocode } = require("../services/geocodeService");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.createDistrict = async (req, res) => {
    try {
        const payload = { ...req.body };

        // If lat/lng provided, enrich with reverse geocoding and GeoJSON
        const lat = payload.coordinates?.lat ?? payload.lat;
        const lng = payload.coordinates?.lng ?? payload.lng;
        if (lat !== undefined && lng !== undefined) {
            payload.coordinates = { lat: Number(lat), lng: Number(lng) };
            payload.location = { type: 'Point', coordinates: [Number(lng), Number(lat)] };

            const geo = await reverseGeocode(lat, lng);
            if (geo) {
                // Prefer client-provided name/state but fall back to geocoded
                payload.name = payload.name || geo.districtName || payload.name;
                payload.state = payload.state || geo.state || payload.state;
                payload.country = geo.country || payload.country;
                payload.pincode = geo.pincode || payload.pincode;
                payload.address = geo.address || payload.address;
            }
        }

        const district = new District(payload);
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
        const updates = { ...req.body };
        const lat = updates.coordinates?.lat ?? updates.lat;
        const lng = updates.coordinates?.lng ?? updates.lng;
        if (lat !== undefined && lng !== undefined) {
            updates.coordinates = { lat: Number(lat), lng: Number(lng) };
            updates.location = { type: 'Point', coordinates: [Number(lng), Number(lat)] };

            const geo = await reverseGeocode(lat, lng);
            if (geo) {
                if (!updates.name && geo.districtName) updates.name = geo.districtName;
                if (!updates.state && geo.state) updates.state = geo.state;
                if (geo.country) updates.country = geo.country;
                if (geo.pincode) updates.pincode = geo.pincode;
                if (geo.address) updates.address = geo.address;
            }
        } else {
            // If coordinates not provided, avoid setting a partial location
            if (updates.location) delete updates.location;
        }

        const district = await District.findByIdAndUpdate(
            req.params.id,
            updates,
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

// Resolve district details from coordinates and optionally find existing district near the point
exports.resolveByCoordinates = async (req, res) => {
    try {
        const lat = parseFloat(req.query.lat);
        const lng = parseFloat(req.query.lng);
        if (Number.isNaN(lat) || Number.isNaN(lng)) {
            return res.status(400).json({ success: false, msg: 'lat and lng are required as numbers' });
        }

        const geo = await reverseGeocode(lat, lng);

        // Try to find an existing district near the coordinates (within 50km)
        let nearest = null;
        try {
            nearest = await District.findOne({
                location: {
                    $near: {
                        $geometry: { type: 'Point', coordinates: [lng, lat] },
                        $maxDistance: 50000
                    }
                }
            }).select('name state country pincode address coordinates location verified _id');
        } catch (_) {}

        return res.json({
            success: true,
            data: {
                districtName: geo?.districtName || nearest?.name || null,
                state: geo?.state || nearest?.state || null,
                country: geo?.country || nearest?.country || null,
                pincode: geo?.pincode || nearest?.pincode || null,
                address: geo?.address || nearest?.address || null,
                lat,
                lng,
                matchedDistrict: nearest ? {
                    id: nearest._id,
                    name: nearest.name,
                    state: nearest.state,
                    verified: nearest.verified
                } : null
            }
        });
    } catch (err) {
        console.error('Resolve by coordinates error:', err);
        res.status(500).json({ 
            success: false, 
            msg: 'Failed to resolve coordinates', 
            error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error' 
        });
    }
};

// District admin login using embedded adminProfile
exports.adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ success: false, msg: 'Email and password are required' });
        }

        // First check if there is a pending application with this email
        try {
            const DistrictApplication = require('../models/DistrictApplication');
            const pending = await DistrictApplication.findOne({ 'adminProfile.email': email, status: 'pending' });
            if (pending) {
                return res.status(403).json({ success: false, msg: 'Your admin application is pending approval by super admin' });
            }
        } catch (_) {}

        // Find approved district by admin email
        const district = await District.findOne({ 'adminProfile.email': email, verified: true });
        if (!district || !district.adminProfile?.passwordHash) {
            return res.status(400).json({ success: false, msg: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, district.adminProfile.passwordHash);
        if (!isMatch) {
            return res.status(400).json({ success: false, msg: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { role: 'admin', districtId: district._id, email: district.adminProfile.email },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRE || '1d' }
        );

        return res.json({
            success: true,
            msg: 'Login successful',
            token,
            user: {
                role: 'admin',
                districtId: district._id,
                districtName: district.name,
                state: district.state,
                email: district.adminProfile.email,
                name: district.adminProfile.name
            }
        });
    } catch (err) {
        console.error('District admin login error:', err);
        res.status(500).json({ success: false, msg: 'Error in login', error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error' });
    }
};
