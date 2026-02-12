require('dotenv').config();   // ⭐ MUST BE FIRST LINE

const config = require('./config/env');
const app = require('./app');
const { seedSuperAdmin } = require('./config/seeder');

const PORT = config.port;

const startServer = async () => {

    await seedSuperAdmin();

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT} in ${config.nodeEnv} mode`);
    });

};

startServer();
