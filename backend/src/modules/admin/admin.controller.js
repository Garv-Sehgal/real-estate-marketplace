const adminService = require('./admin.service');

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

module.exports = {
    createAdmin
};
