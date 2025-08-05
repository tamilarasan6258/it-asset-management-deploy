const express = require('express');
const router = express.Router();
const { protect, isDeptHead, isAdmin } = require('../middlewares/authMiddleware');
const assignmentController = require('../controllers/assignmentController');

/**
 * @swagger
 * tags:
 *   name: Assignment
 *   description: Asset assignment and return management
 */

/**
 * @swagger
 * /api/assignments:
 *   post:
 *     summary: Assign an asset to a user (Admin only)
 *     tags: [Assignment]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - requestId
 *               - assetId
 *             properties:
 *               requestId:
 *                 type: string
 *               assetId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Asset assigned successfully
 *       400:
 *         description: Invalid request or asset
 */
router.post('/', protect, isAdmin, assignmentController.assignAsset);

/**
 * @swagger
 * /api/assignments/return/{id}:
 *   put:
 *     summary: Return an assigned asset (Dept Head only)
 *     tags: [Assignment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Assignment ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Asset returned successfully
 *       404:
 *         description: Assignment not found
 */
router.put('/return/:id', protect, isDeptHead, assignmentController.returnAsset);

/**
 * @swagger
 * /api/assignments/all:
 *   get:
 *     summary: Get all employee assignments (Admin only)
 *     tags: [Assignment]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all assignments
 */
router.get('/all', protect, isAdmin, assignmentController.getAllEmployeeAssignments);

/**
 * @swagger
 * /api/assignments/dept-assets:
 *   get:
 *     summary: Get all assignments for the current user's department (Dept Head only)
 *     tags: [Assignment]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of department assignments
 */
router.get('/dept-assets', protect, isDeptHead, assignmentController.getAllDeptAssignments);

/**
 * @swagger
 * /api/assignments/my:
 *   get:
 *     summary: Get logged-in user's assigned assets
 *     tags: [Assignment]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user's assignments
 */
router.get('/my', protect, assignmentController.getMyAssignments);

/**
 * @swagger
 * /api/assignments/return-requests-dept:
 *   get:
 *     summary: Get return requests awaiting department head approval
 *     tags: [Assignment]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of return requests
 */
router.get('/return-requests-dept', protect, isDeptHead, assignmentController.getReturnRequestsForDeptHead);

/**
 * @swagger
 * /api/assignments/pending-returns:
 *   get:
 *     summary: Get pending returns for admin finalization
 *     tags: [Assignment]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of pending returns
 */
router.get('/pending-returns', protect, isAdmin, assignmentController.getPendingReturnsForAdmin);

/**
 * @swagger
 * /api/assignments/{id}/request-return:
 *   patch:
 *     summary: Request asset return (Employee)
 *     tags: [Assignment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Assignment ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Return requested
 */
router.patch('/:id/request-return', protect, assignmentController.requestReturn);

/**
 * @swagger
 * /api/assignments/{id}/approve-return:
 *   patch:
 *     summary: Approve return request (Dept Head)
 *     tags: [Assignment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Assignment ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - message
 *             properties:
 *               message:
 *                 type: string
 *                 example: Approved and verified
 *     responses:
 *       200:
 *         description: Return approved
 */
router.patch('/:id/approve-return', protect, isDeptHead, assignmentController.approveReturnByDeptHead);

/**
 * @swagger
 * /api/assignments/{id}/finalize-return:
 *   patch:
 *     summary: Finalize asset return (Admin only)
 *     tags: [Assignment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Assignment ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - condition
 *             properties:
 *               condition:
 *                 type: string
 *                 example: Good condition
 *     responses:
 *       200:
 *         description: Return finalized
 */
router.patch('/:id/finalize-return', protect, isAdmin, assignmentController.finalizeReturnByAdmin);

module.exports = router;
