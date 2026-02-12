const express = require('express');
const healthRoutes = require('./routes/health.routes');
const authRoutes = require('./modules/auth');
const errorHandler = require('./middlewares/error.middleware');
const adminRoutes = require('./modules/admin/admin.routes');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/v1/health', healthRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/admin', adminRoutes);


// 404 handler
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: 'Route not found',
    });
});

// Global Error Handler
app.use(errorHandler);

module.exports = app;
