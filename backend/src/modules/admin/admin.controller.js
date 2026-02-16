const adminService = require('./admin.service');

/**
 * CREATE ADMIN
 */
const createAdmin = async (req, res, next) => {
    try {

        const admin = await adminService.createAdmin(req.body);

        res.status(201).json({
            success: true,
            message: 'Admin created successfully',
            data: admin
        });

    } catch (error) {
        next(error);
    }
};


/**
 * SUSPEND ADMIN / STAFF
 */
const suspendAdmin = async (req, res, next) => {
    try {

        const { identifier } = req.body;

        const result = await adminService.suspendAdmin(identifier);

        res.status(200).json({
            success: true,
            ...result
        });

    } catch (error) {
        next(error);
    }
};

module.exports = {
    createAdmin,
    suspendAdmin
};
