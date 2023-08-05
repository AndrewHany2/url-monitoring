const express = require('express')
const router = express.Router()
const UserController = require('../controllers/user.controller')
const { registerSchema } = require('../middlewares/validations')
const { validationMiddleware } = require('../middlewares')

router.post('/register', validationMiddleware(registerSchema), UserController.Register)

module.exports = router
