const mongoose = require("mongoose");
const fs = require("fs");
require("dotenv").config({ path: "./.env" });
const Property = require("./src/modules/property/property.model");

async function run() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const prop = await Property.findOne().sort({ createdAt: -1 }).lean();
        const output = {
            id: prop._id,
            title: prop.title,
            coverImage: prop.coverImage,
            images: prop.images,
            verification: prop.verification
        };
        fs.writeFileSync("db_output.json", JSON.stringify(output, null, 2));
    } catch (err) {
        fs.writeFileSync("db_output.json", JSON.stringify({ error: err.message }));
    } finally {
        process.exit(0);
    }
}
run();
