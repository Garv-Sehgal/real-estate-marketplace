require('dotenv').config();

const config = require('./config/env');
const app = require('./app');
const connectDB = require('./config/db');
const { seedSuperAdmin } = require('./config/seeder');

const PORT = config.port;

const startServer = async () => {
    try {
        // 1️⃣ Connect DB
        await connectDB();
        console.log('Database connected successfully');

        // 2️⃣ Run Seeder AFTER DB connection
        await seedSuperAdmin();

        // 3️⃣ Start server
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT} in ${config.nodeEnv} mode`);
        });

    } catch (error) {
        console.error('Startup error:', error);
        process.exit(1);
    }
};

startServer();
