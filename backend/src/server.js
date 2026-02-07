require('dotenv').config();   // ⭐ MUST BE FIRST LINE

const config = require('./config/env');
const app = require('./app');

const PORT = config.port;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT} in ${config.nodeEnv} mode`);
});
