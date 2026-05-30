const fs = require('fs');
const FormData = require('form-data');
const fetch = require('node-fetch');

async function testUpload() {
    fs.writeFileSync('test.jpg', 'fake image content');

    const form = new FormData();
    form.append('title', 'Test Property');
    form.append('listingType', 'sell');
    form.append('category', 'residential');
    form.append('bhk', '2 BHK');
    form.append('images', fs.createReadStream('test.jpg'));

    try {
        const res = await fetch('http://localhost:3001/api/v1/property', {
            method: 'POST',
            body: form,
            headers: {
                // Not authenticated, wait, authMiddleware will block!
            }
        });
        const text = await res.text();
        console.log(res.status, text);
    } catch (err) {
        console.error(err);
    }
}
testUpload();
