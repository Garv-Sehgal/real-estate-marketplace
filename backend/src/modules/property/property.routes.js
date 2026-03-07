const express = require('express');
const router = express.Router();

const propertyController = require('./property.controller');
const authMiddleware = require('../../middlewares/auth.middleware');

// health check
router.get('/health', (req, res) => {
    res.json({ message: 'Property module working' });
});

/* ---------------- CREATE ---------------- */
const upload = require('./property.upload');

router.post('/', authMiddleware, upload.fields([
    { name: 'coverImage', maxCount: 1 },
    { name: 'govtId', maxCount: 1 },
    { name: 'ownershipProof', maxCount: 1 },
    { name: 'images', maxCount: 10 }
]), propertyController.createProperty);

/* ---------------- READ ---------------- */

// Public marketplace listings
router.get('/', propertyController.getMarketplace);

// Search properties
router.get('/search', propertyController.getSearchProperties);

// Logged-in user's listings
router.get('/me', authMiddleware, propertyController.getMyListings);

// Single property details
router.get('/:id', propertyController.getPropertyByIdController);

module.exports = router;