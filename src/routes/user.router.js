const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user.controller');
const { registerSchema, emailVerficationSchema } = require('../middlewares/validations');
const { validationMiddleware } = require('../middlewares');

/**
 * @openapi
 * '/api/user/register':
 *  post:
 *     tags:
 *     - User
 *     summary: Create a user
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            required:
 *              - firstName
 *              - lastName
 *              - email
 *              - password
 *            properties:
 *              firstName:
 *                type: string
 *              lastName:
 *                type: string
 *              email:
 *                type: string
 *              password:
 *                type: string
 *     responses:
 *      201:
 *        description: Created
 *      422:
 *        description: Validation Error
 *      409:
 *        description: Conflict
 *      500:
 *        description: Server Error
*/
router.post('/register', validationMiddleware(registerSchema), UserController.Register);
/**
 * @openapi
 * /verify:
 *  get:
 *     tags:
 *     - Verify Email
 *     description: Verify email
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         description: user id want his email to be verified
 *       - in: query
 *         name: token
 *         schema:
 *           type: string
 *         description: user token generated when register
 *     responses:
 *       200:
 *         description: Email Verified
 *       400:
 *         description: Invalid Link
*/
router.get('/verify', validationMiddleware(emailVerficationSchema, true), UserController.VerifyEmail);

module.exports = router;
