const { body, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            msg: 'Validation failed',
            errors: errors.array()
        });
    }
    next();
};

const validateUser = [
    body('name').trim().isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
    body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('role').optional().isIn(['user', 'admin', 'superAdmin']).withMessage('Invalid role'),
    body('language').optional().isLength({ min: 2, max: 20 }).withMessage('Invalid language'),
    handleValidationErrors
];

const validateLogin = [
    body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
    body('password').notEmpty().withMessage('Password is required'),
    handleValidationErrors
];

const validateIssue = [
    body('title').trim().isLength({ min: 5, max: 100 }).withMessage('Title must be between 5 and 100 characters'),
    body('description').trim().isLength({ min: 10, max: 1000 }).withMessage('Description must be between 10 and 1000 characters'),
    body('location.lat').isFloat({ min: -90, max: 90 }).withMessage('Invalid latitude'),
    body('location.lng').isFloat({ min: -180, max: 180 }).withMessage('Invalid longitude'),
    body('districtId').isMongoId().withMessage('Invalid district ID'),
    handleValidationErrors
];

const validateSOS = [
    body('type').trim().isLength({ min: 2, max: 50 }).withMessage('SOS type must be between 2 and 50 characters'),
    body('phoneNumber').isMobilePhone().withMessage('Please provide a valid phone number'),
    body('districtId').isMongoId().withMessage('Invalid district ID'),
    handleValidationErrors
];

const validateDistrict = [
    body('name').trim().isLength({ min: 2, max: 100 }).withMessage('District name must be between 2 and 100 characters'),
    body('state').trim().isLength({ min: 2, max: 50 }).withMessage('State must be between 2 and 50 characters'),
    body('adminId').optional().isMongoId().withMessage('Invalid admin ID'),
    handleValidationErrors
];

module.exports = {
    validateUser,
    validateLogin,
    validateIssue,
    validateSOS,
    validateDistrict,
    handleValidationErrors
};
