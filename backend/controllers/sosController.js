const SOS = require("../models/SOS");

exports.addSOS = async (req, res) => {
    try {
        const sos = new SOS(req.body);
        await sos.save();
        
        res.status(201).json({ 
            success: true,
            msg: "SOS contact added successfully", 
            sos 
        });
    } catch (err) {
        console.error('Add SOS error:', err);
        res.status(500).json({ 
            success: false,
            msg: "Error adding SOS contact", 
            error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
        });
    }
};

exports.getAllSOS = async (req, res) => {
    try {
        const { 
            districtId, 
            type, 
            emergencyLevel,
            isActive = true 
        } = req.query;

        const query = {};
        
        if (districtId) query.districtId = districtId;
        if (type) query.type = type;
        if (emergencyLevel) query.emergencyLevel = emergencyLevel;
        if (isActive !== undefined) query.isActive = isActive === 'true';

        const sosContacts = await SOS.find(query)
            .populate('districtId', 'name state')
            .sort({ emergencyLevel: 1, type: 1 });

        res.json({ 
            success: true,
            sosContacts 
        });
    } catch (err) {
        console.error('Get SOS contacts error:', err);
        res.status(500).json({ 
            success: false,
            msg: "Error fetching SOS contacts", 
            error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
        });
    }
};

exports.getSOSByDistrict = async (req, res) => {
    try {
        const { districtId } = req.params;
        
        const sosContacts = await SOS.find({ 
            districtId, 
            isActive: true 
        })
        .populate('districtId', 'name state')
        .sort({ emergencyLevel: -1, type: 1 });

        if (!sosContacts.length) {
            return res.status(404).json({ 
                success: false,
                msg: "No SOS contacts found for this district" 
            });
        }

        res.json({ 
            success: true,
            districtId,
            sosContacts 
        });
    } catch (err) {
        console.error('Get SOS by district error:', err);
        res.status(500).json({ 
            success: false,
            msg: "Error fetching SOS contacts for district", 
            error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
        });
    }
};

exports.getSOSById = async (req, res) => {
    try {
        const sos = await SOS.findById(req.params.id)
            .populate('districtId', 'name state');

        if (!sos) {
            return res.status(404).json({ 
                success: false,
                msg: "SOS contact not found" 
            });
        }

        res.json({ 
            success: true,
            sos 
        });
    } catch (err) {
        console.error('Get SOS error:', err);
        res.status(500).json({ 
            success: false,
            msg: "Error fetching SOS contact", 
            error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
        });
    }
};

exports.updateSOS = async (req, res) => {
    try {
        const updateData = req.body;
        
        const sos = await SOS.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        ).populate('districtId', 'name state');

        if (!sos) {
            return res.status(404).json({ 
                success: false,
                msg: "SOS contact not found" 
            });
        }

        res.json({ 
            success: true,
            msg: "SOS contact updated successfully",
            sos 
        });
    } catch (err) {
        console.error('Update SOS error:', err);
        res.status(500).json({ 
            success: false,
            msg: "Error updating SOS contact", 
            error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
        });
    }
};

exports.deleteSOS = async (req, res) => {
    try {
        const sos = await SOS.findByIdAndDelete(req.params.id);

        if (!sos) {
            return res.status(404).json({ 
                success: false,
                msg: "SOS contact not found" 
            });
        }

        res.json({ 
            success: true,
            msg: "SOS contact deleted successfully"
        });
    } catch (err) {
        console.error('Delete SOS error:', err);
        res.status(500).json({ 
            success: false,
            msg: "Error deleting SOS contact", 
            error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
        });
    }
};


