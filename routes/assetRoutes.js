const express = require('express');
const router = express.Router();
const assetController = require('../controllers/assetController');
const { protect, isAdmin } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Assets
 *   description: Asset management operations
 */

/**
 * @swagger
 * /api/assets:
 *   post:
 *     summary: Add a new asset (Admin only)
 *     tags: [Assets]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - asset_name
 *               - asset_id
 *               - asset_category
 *               - condition
 *             properties:
 *               asset_name:
 *                 type: string
 *               asset_id:
 *                 type: string
 *               asset_category:
 *                 type: string
 *               condition:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Asset added successfully
 *       400:
 *         description: Asset ID already exists
 */
router.post('/', protect, isAdmin, assetController.createAsset);

/**
 * @swagger
 * /api/assets:
 *   get:
 *     summary: Get all assets (Admin only)
 *     tags: [Assets]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all assets
 */
router.get('/', protect, isAdmin, assetController.getAllAssets);

/**
 * @swagger
 * /api/assets/summary:
 *   get:
 *     summary: Get asset inventory summary (Admin only)
 *     tags: [Assets]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Summary of asset counts by category
 */
router.get('/summary', protect, isAdmin, assetController.getAssetCountSummary);

/**
 * @swagger
 * /api/assets/{id}:
 *   put:
 *     summary: Update asset details (Admin only)
 *     tags: [Assets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Asset ID (MongoDB _id)
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               asset_name:
 *                 type: string
 *               asset_category:
 *                 type: string
 *               condition:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Asset updated successfully
 *       404:
 *         description: Asset not found
 */
router.put('/:id', protect, isAdmin, assetController.updateAsset);

/**
 * @swagger
 * /api/assets/{id}:
 *   delete:
 *     summary: Delete an asset (Admin only)
 *     tags: [Assets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Asset ID (MongoDB _id)
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Asset deleted successfully
 *       404:
 *         description: Asset not found
 */
router.delete('/:id', protect, isAdmin, assetController.deleteAsset);

/**
 * @swagger
 * /api/assets/available/{category}:
 *   get:
 *     summary: Get available assets by category (Admin only)
 *     tags: [Assets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: category
 *         required: true
 *         description: Asset category
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of available assets in the given category
 */
router.get('/available/:category', protect, isAdmin, assetController.getAvailableAssetsByCategory);

module.exports = router;
