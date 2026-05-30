require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const { fetchPendingProperties } = require('./src/modules/admin/property.admin.service');

async function test() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const pending = await fetchPendingProperties();
        const output = pending.map(p => ({
            id: p.id,
            ownerId: p.ownerId,
            owner: p.owner || "MISSING OWNER OBJECT"
        }));
        fs.writeFileSync('pending_output.json', JSON.stringify(output, null, 2));
    } catch (err) {
        fs.writeFileSync('pending_output.json', err.stack);
    } finally {
        process.exit(0);
    }
}
test();
