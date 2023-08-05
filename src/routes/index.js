const userRouter = require('./user.router.js')
const { ErrorHandler } = require('../middlewares')

const addRoutes = (app) => {
  app.use('/api/user', userRouter)
  app.use(ErrorHandler)
}

module.exports = addRoutes
