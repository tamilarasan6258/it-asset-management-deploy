const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// TODO: add auth middleware for protected access
const { protect, isAdmin } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management and registration
 */

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Register a new user (Admin only)
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 example: StrongPassword123
 *               role:
 *                 type: string
 *                 enum: [admin, deptHead, employee]
 *                 example: employee
 *               department:
 *                 type: string
 *                 example: IT
 *             required:
 *               - name
 *               - email
 *               - password
 *               - role
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User created successfully
 *                 user:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     role:
 *                       type: string
 *                     department:
 *                       type: string
 *       400:
 *         description: User already exists
 *       500:
 *         description: Server error
 */
router.post('/',protect,isAdmin, userController.createUser); // add protect, isAdmin middleware later

module.exports = router;
