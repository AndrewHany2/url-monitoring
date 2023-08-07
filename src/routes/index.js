const userRouter = require('./user.router.js');
const checkRouter = require('./check.router.js');
const authRouter = require('./auth.router.js');
const { ErrorHandler } = require('../middlewares');
const swaggerDocs = require('./swagger.js');

const addRoutes = (app) => {
  app.use('/api/user', userRouter);
  app.use('/api/auth', authRouter);
  app.use('/api/url/check', checkRouter);
  swaggerDocs(app);
  app.use(ErrorHandler);
};

module.exports = addRoutes;
