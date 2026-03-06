require('dotenv').config();

const express = require('express');
const cors = require('cors');

const healthRoutes = require('./routes/health.routes');
const authRoutes = require('./modules/auth');
const adminRoutes = require('./modules/admin/admin.routes');
const propertyRoutes = require('./modules/property');
const meetingRoutes = require('./modules/meetings/meeting.routes');
const errorHandler = require('./middlewares/error.middleware');
const connectDB = require('./config/db');

const app = express();

connectDB();

/* ---------------- CORS ---------------- */
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}));

const path = require('path');

/* ---------------- Body Parsers ---------------- */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ---------------- Static Files ---------------- */
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

/* ---------------- Routes ---------------- */
app.use('/api/v1/health', healthRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/property', propertyRoutes);
app.use('/api/v1/meetings', meetingRoutes);

/* ---------------- 404 Handler ---------------- */
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found',
    });
});

/* ---------------- Error Handler ---------------- */
app.use(errorHandler);

module.exports = app;
