const express = require('express');
const router = express.Router();
const CheckController = require('../controllers/check.controller');
const { validationMiddleware, authMiddleware } = require('../middlewares');
const { checkValidationSchema } = require('../middlewares/validations');

/**
 * @openapi
 * '/api/url/check':
 *  post:
 *     tags:
 *     - Check Url
 *     summary: for adding new url check
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            required:
 *              - name
 *              - url
 *              - protocol
 *              - path
 *              - port
 *              - webhook
 *              - timeout
 *              - interval
 *              - threshold
 *              - authentication.username
 *              - authentication.password
 *              - httpHeaders
 *              - assert.statusCode
 *              - tags
 *              - ignoreSSL
 *            properties:
 *              name:
 *                type: string
 *              url:
 *                type: string
 *              protocol:
 *                type: string
 *              port:
 *                type: string
 *              webhook:
 *                type: string
 *              timeout:
 *                type: string
 *              interval:
 *                type: string
 *              threshold:
 *                type: string
 *              authentication:
 *                type: object
 *                required:
 *                  usename: string
 *                  password: string
 *              httpHeaders:
 *                type: array
 *              assert:
 *                type: object
 *                required:
 *                  statusCode: string
 *              tags:
 *                type: array
 *              ignoreSSL:
 *                type: boolean
 *     responses:
 *      200:
 *        description: Logged in
 *      401:
 *        description: Invalid email or password
*/
router.post('/', validationMiddleware(checkValidationSchema), authMiddleware, CheckController.CreateUrlCheck);
router.put('/update/:id', validationMiddleware(checkValidationSchema), authMiddleware, CheckController.UpdateUrlCheck);
router.post('/delete', validationMiddleware(checkValidationSchema), authMiddleware, CheckController.CreateUrlCheck);

module.exports = router;
