const express = require('express');
const { validationMiddleware } = require('../middlewares');
const { loginSchema } = require('../middlewares/validations');
const AuthController = require('../controllers/auth.controller');
const router = express.Router();

/**
 * @openapi
 * '/api/auth/login':
 *  post:
 *     tags:
 *     - Login
 *     summary: login
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            required:
 *              - email
 *              - password
 *            properties:
 *              email:
 *                type: string
 *              password:
 *                type: string
 *     responses:
 *      200:
 *        description: Logged in
 *      401:
 *        description: Invalid email or password
*/
router.post(
  '/login',
  validationMiddleware(loginSchema, false),
  AuthController.Login
);
module.exports = router;
