const express = require('express');
const router = express.Router();
const requestController = require('../controllers/requestController');
const { protect, isDeptHead, isAdmin } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Requests
 *   description: Asset Request Management (Employee, Dept Head, Admin)
 */

/**
 * @swagger
 * /api/requests:
 *   post:
 *     summary: Create a new asset request
 *     tags: [Requests]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - asset_category
 *               - reason
 *             properties:
 *               asset_category:
 *                 type: string
 *                 example: Laptop
 *               reason:
 *                 type: string
 *                 example: Need for development work
 *     responses:
 *       201:
 *         description: Request submitted successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */
router.post('/', protect, requestController.createRequest);

/**
 * @swagger
 * /api/requests/my:
 *   get:
 *     summary: Get current user's requests
 *     tags: [Requests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Items per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Filter by status
 *     responses:
 *       200:
 *         description: List of user's requests
 *       500:
 *         description: Server error
 */
router.get('/my', protect, requestController.getMyRequests);

/**
 * @swagger
 * /api/requests/department:
 *   get:
 *     summary: Get all requests for Dept Head's department
 *     tags: [Requests]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of department requests
 *       500:
 *         description: Server error
 */
router.get('/department', protect, isDeptHead, requestController.getRequestsByDepartment);

/**
 * @swagger
 * /api/requests/{id}/status:
 *   patch:
 *     summary: Update request status by Dept Head
 *     tags: [Requests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Request ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [approved, rejected]
 *               remarks:
 *                 type: string
 *     responses:
 *       200:
 *         description: Request status updated
 *       404:
 *         description: Request not found
 *       500:
 *         description: Server error
 */
router.patch('/:id/status', protect, isDeptHead, requestController.updateRequestStatus);

/**
 * @swagger
 * /api/requests/forward/{id}:
 *   put:
 *     summary: Forward request to Admin by Dept Head
 *     tags: [Requests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Request forwarded
 *       404:
 *         description: Request not found
 */
router.put('/forward/:id', protect, isDeptHead, requestController.forwardToAdmin);

/**
 * @swagger
 * /api/requests/admin-review/{id}:
 *   put:
 *     summary: Admin reviews request
 *     tags: [Requests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *               - adminRemarks
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [approved, rejected]
 *               adminRemarks:
 *                 type: string
 *     responses:
 *       200:
 *         description: Admin reviewed request
 *       400:
 *         description: Invalid request
 *       500:
 *         description: Server error
 */
router.put('/admin-review/:id', protect, isAdmin, requestController.reviewRequestByAdmin);

/**
 * @swagger
 * /api/requests/forwarded:
 *   get:
 *     summary: Get all forwarded requests for Admin
 *     tags: [Requests]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of forwarded requests
 */
router.get('/forwarded', protect, isAdmin, requestController.getForwardedRequestsForAdmin);

/**
 * @swagger
 * /api/requests/admin-approved:
 *   get:
 *     summary: Get admin-approved and dept-approved requests
 *     tags: [Requests]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of admin-approved requests
 */
router.get('/admin-approved', protect, isAdmin, requestController.getAdminApprovedRequests);

/**
 * @swagger
 * /api/requests/summary:
 *   get:
 *     summary: Get asset request summary by category
 *     tags: [Requests]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Asset request summary
 */
router.get('/summary', protect, isAdmin, requestController.getRequestAssetSummary);

module.exports = router;
